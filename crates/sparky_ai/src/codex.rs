use crate::codex_auth::valid_codex_credentials;
use crate::provider::{CompletionOptions, EventStream, LlmProvider};
use crate::types::{AssistantMessageEvent, ContentPart, Message, Role, ToolCall, UsageStats};
use async_trait::async_trait;
use futures::StreamExt;
use serde_json::{json, Value};
use tokio_stream::wrappers::UnboundedReceiverStream;

pub struct CodexProvider {
    client: reqwest::Client,
}

const MAX_CODEX_ATTEMPTS: u32 = 2;

impl CodexProvider {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::builder()
                .connect_timeout(std::time::Duration::from_secs(20))
                .pool_idle_timeout(std::time::Duration::from_secs(60))
                .build()
                .expect("valid Codex HTTP client configuration"),
        }
    }

    fn request_body(messages: &[Message], options: &CompletionOptions, stream: bool) -> Value {
        fn input_content(message: &Message) -> Value {
            let mut parts = Vec::new();
            for part in &message.content {
                match part {
                    ContentPart::Text { text } => {
                        parts.push(json!({ "type": "input_text", "text": text }));
                    }
                    ContentPart::Image { data, mime_type } => {
                        parts.push(json!({
                            "type": "input_image",
                            "image_url": format!("data:{mime_type};base64,{data}"),
                        }));
                    }
                    ContentPart::Thinking { thinking, .. } => {
                        parts.push(json!({ "type": "input_text", "text": thinking }));
                    }
                }
            }
            if parts.len() == 1 && parts[0]["type"] == "input_text" {
                parts.pop().unwrap()["text"].clone()
            } else {
                Value::Array(parts)
            }
        }

        let mut input = Vec::new();
        for message in messages {
            match message.role {
                Role::System => {
                    input.push(json!({ "role": "developer", "content": message.text() }))
                }
                Role::User | Role::Custom(_) => {
                    input.push(json!({ "role": "user", "content": input_content(message) }))
                }
                Role::Assistant => {
                    if !message.text().is_empty() {
                        input.push(json!({ "role": "assistant", "content": message.text() }));
                    }
                    for call in message.tool_calls.clone().unwrap_or_default() {
                        input.push(json!({
                            "type": "function_call",
                            "call_id": call.id,
                            "name": call.name,
                            "arguments": call.arguments.to_string(),
                        }));
                    }
                }
                Role::Tool => {
                    if let Some(result) = &message.tool_result {
                        input.push(json!({
                            "type": "function_call_output",
                            "call_id": result.tool_call_id,
                            "output": result.output,
                        }));
                    }
                }
            }
        }
        let tools = options
            .tools
            .iter()
            .map(|tool| {
                json!({
                    "type": "function",
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.parameters,
                    "strict": false,
                })
            })
            .collect::<Vec<_>>();
        let mut body = json!({
            "model": options.model,
            "input": input,
            "tools": tools,
            "text": { "verbosity": "low" },
            "include": ["reasoning.encrypted_content"],
            "tool_choice": "auto",
            "parallel_tool_calls": true,
            "store": false,
            "stream": stream,
        });
        if let Some(effort) = options
            .reasoning_effort
            .as_deref()
            .filter(|value| !value.trim().is_empty() && *value != "none")
        {
            body["reasoning"] = json!({ "effort": effort, "summary": "auto" });
        }
        body
    }

    async fn send(
        &self,
        messages: &[Message],
        options: &CompletionOptions,
        stream: bool,
    ) -> anyhow::Result<reqwest::Response> {
        let request_body = Self::request_body(messages, options, stream);
        for attempt in 1..=MAX_CODEX_ATTEMPTS {
            let credentials = valid_codex_credentials().await?;
            let response = self
                .client
                .post("https://chatgpt.com/backend-api/codex/responses")
                .bearer_auth(credentials.access)
                .header("chatgpt-account-id", credentials.account_id)
                .header("originator", "sparky")
                .header("OpenAI-Beta", "responses=experimental")
                .header("Accept", "text/event-stream")
                .header(
                    "User-Agent",
                    concat!("sparky-rust/", env!("CARGO_PKG_VERSION")),
                )
                .json(&request_body)
                .send()
                .await;
            match response {
                Ok(response) if response.status().is_success() => return Ok(response),
                Ok(response) => {
                    let status = response.status();
                    let retryable = status.as_u16() == 408
                        || status.as_u16() == 429
                        || status.is_server_error();
                    let body = response.text().await.unwrap_or_default();
                    if retryable && attempt < MAX_CODEX_ATTEMPTS {
                        tokio::time::sleep(std::time::Duration::from_secs(1 << (attempt - 1)))
                            .await;
                        continue;
                    }
                    let detail = provider_error_detail(&body);
                    anyhow::bail!("ChatGPT Codex request failed (HTTP {status}): {detail}");
                }
                Err(error)
                    if attempt < MAX_CODEX_ATTEMPTS
                        && (error.is_connect() || error.is_timeout()) =>
                {
                    tokio::time::sleep(std::time::Duration::from_secs(1 << (attempt - 1))).await;
                }
                Err(error) => {
                    anyhow::bail!(
                        "Unable to reach ChatGPT Codex after {attempt} attempt(s): {error}"
                    )
                }
            }
        }
        anyhow::bail!("Unable to reach ChatGPT Codex after {MAX_CODEX_ATTEMPTS} attempts")
    }
}

impl Default for CodexProvider {
    fn default() -> Self {
        Self::new()
    }
}

fn response_message(value: &Value, model: &str) -> Message {
    let mut text = String::new();
    let mut calls = Vec::new();
    for item in value["output"].as_array().into_iter().flatten() {
        match item["type"].as_str().unwrap_or_default() {
            "message" => {
                for part in item["content"].as_array().into_iter().flatten() {
                    if let Some(value) = part["text"].as_str() {
                        text.push_str(value);
                    }
                }
            }
            "function_call" => calls.push(ToolCall {
                id: item["call_id"]
                    .as_str()
                    .or_else(|| item["id"].as_str())
                    .unwrap_or_default()
                    .to_string(),
                name: item["name"].as_str().unwrap_or_default().to_string(),
                arguments: serde_json::from_str(item["arguments"].as_str().unwrap_or("{}"))
                    .unwrap_or_else(|_| json!({})),
            }),
            _ => {}
        }
    }
    let mut message = Message::assistant(text, (!calls.is_empty()).then_some(calls));
    message.provider = Some("openai-codex".to_string());
    message.model = Some(model.to_string());
    message
}

fn provider_error_detail(body: &str) -> String {
    let parsed = serde_json::from_str::<Value>(body).ok();
    let detail = parsed
        .as_ref()
        .and_then(|value| {
            value["error"]["message"]
                .as_str()
                .or_else(|| value["message"].as_str())
        })
        .unwrap_or(body)
        .trim();
    if detail.is_empty() {
        return "The provider returned no error details".to_string();
    }
    detail.chars().take(2_000).collect()
}

fn stream_error_detail(event: &Value) -> String {
    event["error"]["message"]
        .as_str()
        .or_else(|| event["response"]["error"]["message"].as_str())
        .or_else(|| event["message"].as_str())
        .map(str::to_owned)
        .unwrap_or_else(|| event.to_string().chars().take(2_000).collect())
}

#[async_trait]
impl LlmProvider for CodexProvider {
    fn provider_name(&self) -> &str {
        "openai-codex"
    }

    async fn complete(
        &self,
        messages: &[Message],
        options: &CompletionOptions,
    ) -> anyhow::Result<Message> {
        let value: Value = self.send(messages, options, false).await?.json().await?;
        Ok(response_message(&value, &options.model))
    }

    async fn stream(
        &self,
        messages: &[Message],
        options: &CompletionOptions,
    ) -> anyhow::Result<EventStream> {
        let response = self.send(messages, options, true).await?;
        let mut bytes = response.bytes_stream();
        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
        tokio::spawn(async move {
            let mut buffer = String::new();
            let mut saw_event = false;
            let mut calls: std::collections::HashMap<u64, (String, String)> =
                std::collections::HashMap::new();
            while let Some(chunk) = bytes.next().await {
                let chunk = match chunk {
                    Ok(chunk) => chunk,
                    Err(error) => {
                        let _ = tx.send(AssistantMessageEvent::Error(format!(
                            "ChatGPT response stream disconnected before completion: {error}"
                        )));
                        return;
                    }
                };
                buffer.push_str(&String::from_utf8_lossy(&chunk));
                while let Some(end) = buffer.find('\n') {
                    let line = buffer[..end].trim().to_string();
                    buffer.drain(..=end);
                    let Some(data) = line.strip_prefix("data: ") else {
                        continue;
                    };
                    if data == "[DONE]" {
                        let _ = tx.send(AssistantMessageEvent::Error(
                            "ChatGPT ended the response stream without a completion event. Your work was saved; retry the message to continue.".into(),
                        ));
                        return;
                    }
                    let Ok(event) = serde_json::from_str::<Value>(data) else {
                        continue;
                    };
                    saw_event = true;
                    match event["type"].as_str().unwrap_or_default() {
                        "response.output_text.delta" => {
                            if let Some(delta) = event["delta"].as_str() {
                                let _ = tx.send(AssistantMessageEvent::TextDelta(delta.into()));
                            }
                        }
                        "response.reasoning_summary_text.delta" => {
                            if let Some(delta) = event["delta"].as_str() {
                                let _ = tx.send(AssistantMessageEvent::ThinkingDelta(delta.into()));
                            }
                        }
                        "response.output_item.added"
                            if event["item"]["type"] == "function_call" =>
                        {
                            let index = event["output_index"].as_u64().unwrap_or(0);
                            let id = event["item"]["call_id"]
                                .as_str()
                                .or_else(|| event["item"]["id"].as_str())
                                .unwrap_or_default()
                                .to_string();
                            let name = event["item"]["name"]
                                .as_str()
                                .unwrap_or_default()
                                .to_string();
                            calls.insert(index, (id.clone(), name.clone()));
                            let _ = tx.send(AssistantMessageEvent::ToolCallDelta {
                                id,
                                name,
                                arguments_delta: String::new(),
                            });
                        }
                        "response.function_call_arguments.delta" => {
                            let index = event["output_index"].as_u64().unwrap_or(0);
                            if let Some((id, name)) = calls.get(&index) {
                                let _ = tx.send(AssistantMessageEvent::ToolCallDelta {
                                    id: id.clone(),
                                    name: name.clone(),
                                    arguments_delta: event["delta"]
                                        .as_str()
                                        .unwrap_or_default()
                                        .into(),
                                });
                            }
                        }
                        "response.completed" => {
                            let usage = &event["response"]["usage"];
                            let input = usage["input_tokens"].as_u64().unwrap_or(0) as u32;
                            let output = usage["output_tokens"].as_u64().unwrap_or(0) as u32;
                            let _ = tx.send(AssistantMessageEvent::Done {
                                usage: Some(UsageStats {
                                    prompt_tokens: input,
                                    completion_tokens: output,
                                    total_tokens: input.saturating_add(output),
                                }),
                            });
                            return;
                        }
                        "error" | "response.failed" => {
                            let _ =
                                tx.send(AssistantMessageEvent::Error(stream_error_detail(&event)));
                            return;
                        }
                        _ => {}
                    }
                }
            }
            let _ = tx.send(AssistantMessageEvent::Error(if saw_event {
                "ChatGPT closed the response stream before completion. Your session was saved; retry the message to continue.".into()
            } else {
                "ChatGPT closed the response stream before sending any events. Check your connection and retry.".into()
            }));
        });
        Ok(Box::pin(UnboundedReceiverStream::new(rx)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::ToolParamSchema;

    #[test]
    fn builds_codex_responses_tool_conversation() {
        let messages = vec![
            Message::system("You are Sparky."),
            Message::user("Read the file"),
            Message::assistant(
                "",
                Some(vec![ToolCall {
                    id: "call-1".into(),
                    name: "read".into(),
                    arguments: json!({ "path": "README.md" }),
                }]),
            ),
            Message::tool_result("call-1", "contents", false),
        ];
        let options = CompletionOptions {
            model: "gpt-5.6-sol".into(),
            reasoning_effort: Some("high".into()),
            tools: vec![ToolParamSchema {
                name: "read".into(),
                description: "Read a file".into(),
                parameters: json!({ "type": "object" }),
            }],
            max_tokens: Some(4_096),
            ..Default::default()
        };

        let body = CodexProvider::request_body(&messages, &options, true);
        assert_eq!(body["model"], "gpt-5.6-sol");
        assert_eq!(body["store"], false);
        assert_eq!(body["input"][2]["type"], "function_call");
        assert_eq!(body["input"][3]["type"], "function_call_output");
        assert_eq!(body["tools"][0]["name"], "read");
        assert!(body.get("max_output_tokens").is_none());
        assert_eq!(body["reasoning"]["effort"], "high");
    }

    #[test]
    fn includes_user_images_as_responses_input_parts() {
        let messages = vec![Message::user_with_content(vec![
            ContentPart::Text {
                text: "Describe this".into(),
            },
            ContentPart::Image {
                data: "aGVsbG8=".into(),
                mime_type: "image/png".into(),
            },
        ])];
        let body = CodexProvider::request_body(&messages, &CompletionOptions::default(), false);
        assert_eq!(body["input"][0]["content"][0]["type"], "input_text");
        assert_eq!(body["input"][0]["content"][1]["type"], "input_image");
        assert_eq!(
            body["input"][0]["content"][1]["image_url"],
            "data:image/png;base64,aGVsbG8="
        );
    }
}
