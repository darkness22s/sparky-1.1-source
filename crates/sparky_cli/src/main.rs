use base64::{engine::general_purpose::STANDARD as BASE64_STANDARD, Engine as _};
use clap::Parser;
use sparky_agent::{AgentLoop, AgentLoopOptions, InteractionMode};
use sparky_ai::{
    codex_auth_status, login_codex, logout_codex, AnthropicProvider, AssistantMessageEvent,
    CodexProvider, ContentPart, GeminiProvider, LlmProvider, OpenAiProvider,
};
use sparky_config::{DEFAULT_CONTEXT_WINDOW_TOKENS, DEFAULT_MAX_TURNS};
use sparky_extensions::{EventBus, JsExtensionRunner, SparkyEvent};
use sparky_session::SessionManager;
use sparky_tools::{is_hidden_control_tool, register_http_mcp_tools, ToolRegistry};
use std::env;
use std::io::{self, Write};
use std::path::Path;
use std::sync::Arc;
use tokio::io::AsyncReadExt;
use tracing_subscriber::EnvFilter;

#[derive(Parser, Debug)]
#[command(name = "sparky")]
#[command(about = "Sparky AI Coding Agent", long_about = None)]
struct Cli {
    #[arg(long, help = "Sign in with a ChatGPT Codex subscription")]
    codex_login: bool,

    #[arg(long, help = "Print ChatGPT Codex authentication status as JSON")]
    codex_auth_status: bool,

    #[arg(long, help = "Remove the saved ChatGPT Codex authentication")]
    codex_logout: bool,

    #[arg(short, long, help = "Prompt to execute directly")]
    prompt: Option<String>,

    #[arg(long, conflicts_with = "prompt", help = "Read the prompt from stdin")]
    prompt_stdin: bool,

    #[arg(long = "image-path", value_name = "PATH")]
    image_paths: Vec<String>,

    #[arg(long = "image-mime-type", value_name = "MIME")]
    image_mime_types: Vec<String>,

    #[arg(long, help = "Reasoning effort for models that support it")]
    effort: Option<String>,

    #[arg(
        long,
        value_parser = ["build", "plan"],
        default_value = "build",
        help = "Interaction policy: build may modify the workspace, plan is read-only"
    )]
    interaction_mode: String,

    #[arg(
        long,
        help = "Provider-advertised context window, in tokens or k/m notation"
    )]
    context_window: Option<String>,

    #[arg(
        short = 'r',
        long,
        default_value = "openai",
        help = "Model API: openai, anthropic, gemini, opencode, ollama"
    )]
    provider: String,

    #[arg(
        short,
        long,
        default_value = "gpt-4o",
        help = "Model ID to use (e.g. gpt-4o, claude-3-5-sonnet-latest, gemini-1.5-pro)"
    )]
    model: String,

    #[arg(short, long, default_value = ".", help = "Working directory path")]
    cwd: String,

    #[arg(long, help = "Custom Base URL for OpenAI/Ollama compatible provider")]
    base_url: Option<String>,

    #[arg(short, long, help = "Optional JS/TS extension file path to load")]
    extension: Option<String>,

    #[arg(long, help = "Write one machine-readable JSON result to stdout")]
    json: bool,

    #[arg(long, help = "Write newline-delimited JSON token events to stdout")]
    json_stream: bool,

    #[arg(
        long,
        help = "Resume an existing Sparky session in the working directory"
    )]
    session: Option<String>,

    #[arg(
        long,
        help = "Instructions appended to Sparky's built-in system prompt"
    )]
    append_system_prompt: Option<String>,

    #[arg(
        long,
        requires = "mcp_bearer_token_env_var",
        help = "HTTP MCP endpoint to expose as agent tools"
    )]
    mcp_url: Option<String>,

    #[arg(
        long,
        requires = "mcp_url",
        help = "Environment variable containing the bearer token for --mcp-url"
    )]
    mcp_bearer_token_env_var: Option<String>,
}

fn write_json_line(value: serde_json::Value) {
    println!("{}", value);
    let _ = io::stdout().flush();
}

fn required_api_key(variable: &str) -> anyhow::Result<String> {
    let value = env::var(variable).unwrap_or_default().trim().to_string();
    anyhow::ensure!(
        !value.is_empty(),
        "ERROR: {} environment variable is not set. Set it before running sparky.",
        variable
    );
    Ok(value)
}

fn parse_context_window_tokens(value: Option<&str>) -> anyhow::Result<Option<usize>> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    let normalized = value.to_ascii_lowercase().replace(',', "");
    let (number, multiplier) = if let Some(number) = normalized.strip_suffix('b') {
        (number, 1_000_000_000_f64)
    } else if let Some(number) = normalized.strip_suffix('m') {
        (number, 1_000_000_f64)
    } else if let Some(number) = normalized.strip_suffix('k') {
        (number, 1_000_f64)
    } else if let Some(number) = normalized.strip_suffix("tokens") {
        (number, 1_f64)
    } else {
        (normalized.as_str(), 1_f64)
    };
    let amount: f64 = number
        .trim()
        .parse()
        .map_err(|_| anyhow::anyhow!("Invalid context window '{value}'"))?;
    let tokens = amount * multiplier;
    anyhow::ensure!(
        tokens.is_finite() && tokens > 0.0 && tokens.fract() == 0.0,
        "Context window must be a positive whole number of tokens"
    );
    anyhow::ensure!(
        tokens <= usize::MAX as f64,
        "Context window is too large for this platform"
    );
    Ok(Some(tokens as usize))
}

fn write_stream_event(event: &AssistantMessageEvent) {
    match event {
        AssistantMessageEvent::TextDelta(delta) => {
            write_json_line(serde_json::json!({ "type": "delta", "delta": delta }));
        }
        AssistantMessageEvent::ThinkingDelta(delta) => {
            write_json_line(serde_json::json!({ "type": "thinking_delta", "delta": delta }));
        }
        _ => {}
    }
}

struct ProgressIndicator {
    stop: Option<tokio::sync::oneshot::Sender<()>>,
    task: Option<tokio::task::JoinHandle<()>>,
}

impl ProgressIndicator {
    fn start() -> Self {
        eprint!("Sparky is working");
        let _ = io::stderr().flush();
        let (stop, mut stopped) = tokio::sync::oneshot::channel();
        let task = tokio::spawn(async move {
            let mut interval = tokio::time::interval(std::time::Duration::from_millis(750));
            interval.tick().await;
            loop {
                tokio::select! {
                    _ = interval.tick() => {
                        eprint!(".");
                        let _ = io::stderr().flush();
                    }
                    _ = &mut stopped => break,
                }
            }
        });
        Self {
            stop: Some(stop),
            task: Some(task),
        }
    }

    async fn finish(mut self) {
        if let Some(stop) = self.stop.take() {
            let _ = stop.send(());
        }
        if let Some(task) = self.task.take() {
            let _ = task.await;
        }
        eprintln!();
    }
}

impl Drop for ProgressIndicator {
    fn drop(&mut self) {
        if let Some(stop) = self.stop.take() {
            let _ = stop.send(());
        }
        if let Some(task) = self.task.take() {
            task.abort();
            eprintln!();
        }
    }
}

async fn run_prompt(
    agent_loop: &AgentLoop,
    session: &mut SessionManager,
    prompt: &str,
    images: Vec<ContentPart>,
    json_stream: bool,
    show_progress: bool,
) -> anyhow::Result<String> {
    let progress = show_progress.then(ProgressIndicator::start);
    let result = if json_stream {
        agent_loop
            .run_turn_streaming_with_images(prompt, images, session, write_stream_event)
            .await
    } else {
        agent_loop
            .run_turn_with_images(prompt, images, session)
            .await
    };
    if let Some(progress) = progress {
        progress.finish().await;
    }
    result
}

async fn load_image_parts(
    paths: &[String],
    mime_types: &[String],
) -> anyhow::Result<Vec<ContentPart>> {
    anyhow::ensure!(
        paths.len() == mime_types.len(),
        "Each --image-path must have a matching --image-mime-type"
    );
    let mut images = Vec::with_capacity(paths.len());
    for (path, mime_type) in paths.iter().zip(mime_types) {
        let bytes = tokio::fs::read(path).await?;
        anyhow::ensure!(!bytes.is_empty(), "Image attachment '{}' is empty", path);
        images.push(ContentPart::Image {
            data: BASE64_STANDARD.encode(bytes),
            mime_type: mime_type.clone(),
        });
    }
    Ok(images)
}

fn write_result(cli: &Cli, result: &str, session_id: &str) {
    if cli.json_stream {
        write_json_line(serde_json::json!({
            "type": "result",
            "response": result,
            "sessionId": session_id,
        }));
    } else if cli.json {
        println!(
            "{}",
            serde_json::json!({
                "response": result,
                "sessionId": session_id,
            })
        );
    } else {
        println!("\nSparky Response:\n{}", result);
    }
}

fn output_snippet(output: &str, max_bytes: usize) -> &str {
    if output.len() <= max_bytes {
        return output;
    }
    let mut boundary = max_bytes;
    while boundary > 0 && !output.is_char_boundary(boundary) {
        boundary -= 1;
    }
    &output[..boundary]
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = dotenvy::dotenv();

    let cli = Cli::parse();

    if cli.codex_login {
        println!("{}", serde_json::to_string(&login_codex().await?)?);
        return Ok(());
    }
    if cli.codex_auth_status {
        println!("{}", serde_json::to_string(&codex_auth_status())?);
        return Ok(());
    }
    if cli.codex_logout {
        println!("{}", serde_json::to_string(&logout_codex().await?)?);
        return Ok(());
    }

    if !cli.json && !cli.json_stream {
        tracing_subscriber::fmt()
            .with_env_filter(EnvFilter::from_default_env().add_directive("sparky=info".parse()?))
            .init();
    }

    let provider: Arc<dyn LlmProvider> = match cli.provider.to_lowercase().as_str() {
        "openai-codex" | "codex" | "chatgpt" => Arc::new(CodexProvider::new()),
        "anthropic" => {
            let key = required_api_key("ANTHROPIC_API_KEY")?;
            Arc::new(AnthropicProvider::new(key, cli.base_url.clone()))
        }
        "gemini" => {
            let key = required_api_key("GEMINI_API_KEY")?;
            Arc::new(GeminiProvider::new(key))
        }
        "ollama" => {
            let base_url = cli
                .base_url
                .clone()
                .unwrap_or_else(|| "http://localhost:11434/v1".to_string());
            Arc::new(OpenAiProvider::new("", Some(base_url)))
        }
        "opencode" | "opencode-zen" | "zen" => {
            let key = required_api_key("OPENCODE_API_KEY")?;
            let base_url = cli
                .base_url
                .clone()
                .or_else(|| env::var("OPENCODE_BASE_URL").ok())
                .unwrap_or_else(|| "https://opencode.ai/zen/v1".to_string());
            Arc::new(OpenAiProvider::new_with_api_key_env(
                key,
                Some(base_url),
                "OPENCODE_API_KEY",
            ))
        }
        "openai" | _ => {
            let key = required_api_key("OPENAI_API_KEY")?;
            Arc::new(OpenAiProvider::new(key, cli.base_url.clone()))
        }
    };

    let mut tool_registry = ToolRegistry::new();
    if let Some(mcp_url) = cli.mcp_url.as_deref() {
        let token_variable = cli
            .mcp_bearer_token_env_var
            .as_deref()
            .expect("clap validates --mcp-url requirements");
        let token = required_api_key(token_variable)?;
        let tool_count =
            register_http_mcp_tools(&mut tool_registry, mcp_url, &format!("Bearer {}", token))
                .await?;
        tracing::info!(mcp_url, tool_count, "Loaded HTTP MCP tools");
    }
    let extension_runner = if let Some(extension_path) = cli.extension.as_deref() {
        let runner = JsExtensionRunner::new();
        runner
            .load_extension_file(Path::new(extension_path))
            .await?;
        let tool_count = runner.register_tools(&mut tool_registry).await?;
        tracing::info!(
            extension_path,
            tool_count,
            "Loaded JavaScript extension API"
        );
        Some(runner)
    } else {
        None
    };
    let mut event_bus = EventBus::new();

    if let Some(runner) = extension_runner.clone() {
        event_bus.subscribe(move |event| {
            if let Err(error) = runner.emit_event_nowait(event) {
                tracing::error!("Failed to dispatch event to JavaScript extension: {error}");
            }
        });
    }

    if cli.json_stream {
        event_bus.subscribe(|event| match event {
            SparkyEvent::ToolExecutionStart {
                tool_call_id,
                tool_name,
                arguments,
            } if !is_hidden_control_tool(tool_name) => write_json_line(serde_json::json!({
                "type": "tool.started",
                "toolCallId": tool_call_id,
                "toolName": tool_name,
                "arguments": arguments,
            })),
            SparkyEvent::ToolExecutionEnd {
                tool_call_id,
                tool_name,
                output,
                is_error,
            } if !is_hidden_control_tool(tool_name) => write_json_line(serde_json::json!({
                "type": "tool.completed",
                "toolCallId": tool_call_id,
                "toolName": tool_name,
                "output": output,
                "isError": is_error,
            })),
            SparkyEvent::UsageUpdate {
                prompt_tokens,
                completion_tokens,
                total_tokens,
                cumulative_total_tokens,
            } => write_json_line(serde_json::json!({
                "type": "usage",
                "promptTokens": prompt_tokens,
                "completionTokens": completion_tokens,
                "totalTokens": total_tokens,
                "cumulativeTotalTokens": cumulative_total_tokens,
            })),
            _ => {}
        });
    } else if !cli.json {
        event_bus.subscribe(|event| match event {
            SparkyEvent::TurnStart { turn_index } => {
                println!("--- Turn {} ---", turn_index);
            }
            SparkyEvent::ToolExecutionStart {
                tool_name,
                arguments,
                ..
            } if !is_hidden_control_tool(tool_name) => {
                println!("Tool Call [{}] args: {}", tool_name, arguments);
            }
            SparkyEvent::ToolExecutionEnd {
                tool_name,
                is_error,
                output,
                ..
            } if !is_hidden_control_tool(tool_name) => {
                let status = if *is_error { "FAILED" } else { "OK" };
                let snippet = output_snippet(output, 300);
                if *is_error {
                    eprintln!("Tool [{}] status: {}", tool_name, status);
                    eprintln!("   Output snippet: {}", snippet);
                } else {
                    println!("Tool [{}] status: {}", tool_name, status);
                    println!("   Output snippet: {}", snippet);
                }
            }
            _ => {}
        });
    }

    let mut session = match cli.session.as_deref() {
        Some(session_id) => SessionManager::load(&cli.cwd, session_id).await?,
        None => SessionManager::create_new(&cli.cwd, None).await?,
    };
    if !cli.json && !cli.json_stream {
        println!(
            "Sparky AI Agent initialized. Session ID: {}",
            session.session_id()
        );
    }

    let interaction_mode = match cli.interaction_mode.as_str() {
        "plan" => InteractionMode::Plan,
        _ => InteractionMode::Build,
    };
    let context_window_tokens = parse_context_window_tokens(cli.context_window.as_deref())?
        .or(Some(DEFAULT_CONTEXT_WINDOW_TOKENS));

    let loop_options = AgentLoopOptions {
        cwd: cli.cwd.clone(),
        model_name: cli.model.clone(),
        max_turns: DEFAULT_MAX_TURNS,
        temperature: Some(0.7),
        reasoning_effort: cli.effort.clone(),
        append_system_prompt: cli.append_system_prompt.clone(),
        context_window_tokens,
        interaction_mode,
    };

    let agent_loop = AgentLoop::new(provider, tool_registry, event_bus, loop_options);

    const DEFAULT_PROMPT: &str = "Summarize your available tools and environment.";
    let prompt_from_stdin = if cli.prompt_stdin {
        let mut prompt = String::new();
        tokio::io::stdin().read_to_string(&mut prompt).await?;
        anyhow::ensure!(!prompt.trim().is_empty(), "Prompt stdin was empty");
        Some(prompt)
    } else {
        None
    };
    let prompt = prompt_from_stdin
        .as_deref()
        .or(cli.prompt.as_deref())
        .unwrap_or(DEFAULT_PROMPT);
    let image_parts = load_image_parts(&cli.image_paths, &cli.image_mime_types).await?;
    if !cli.json && !cli.json_stream {
        if cli.prompt.is_some() {
            println!("\nUser Prompt: {}\n", prompt);
        } else {
            println!("\nNo prompt supplied. Running default Sparky status check...\n");
        }
    }

    let interrupted = tokio::select! {
        result = async {
            if prompt.trim().eq_ignore_ascii_case("/compact") {
                let compacted = agent_loop.compact_session(&mut session).await?;
                Ok(if compacted {
                    "Context compacted.".to_string()
                } else {
                    "Context was already compact.".to_string()
                })
            } else {
                run_prompt(
                    &agent_loop,
                    &mut session,
                    prompt,
                    image_parts,
                    cli.json_stream,
                    !cli.json && !cli.json_stream,
                )
                .await
            }
        } => {
            let result = result?;
            write_result(&cli, &result, session.session_id());
            false
        }
        signal = tokio::signal::ctrl_c() => {
            signal?;
            true
        }
    };

    if interrupted {
        session.save().await?;
        if cli.json_stream {
            write_json_line(serde_json::json!({
                "type": "shutdown",
                "message": "Interrupt received; session saved.",
                "sessionId": session.session_id(),
            }));
        } else if cli.json {
            eprintln!(
                "Interrupt received; session {} saved.",
                session.session_id()
            );
        } else {
            println!(
                "\nInterrupt received. Session {} saved. Exiting gracefully.",
                session.session_id()
            );
        }
    }

    Ok(())
}
