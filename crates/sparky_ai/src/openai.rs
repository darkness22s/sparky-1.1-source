use crate::formatting::{openai_messages, openai_tools};
use crate::provider::{CompletionOptions, EventStream, LlmProvider};
use crate::retry::send_with_retry;
use crate::stream_parser;
use crate::types::{Message, ToolCall};

use async_trait::async_trait;
use reqwest::Client;
use serde_json::{json, Value};

pub struct OpenAiProvider {
    api_key: String,
    api_key_env: Option<String>,
    base_url: String,
    provider_name: &'static str,
    provider_label: &'static str,
    client: Client,
}

impl OpenAiProvider {
    pub fn new(api_key: impl Into<String>, base_url: Option<String>) -> Self {
        Self::new_with_api_key_env(api_key, base_url, "OPENAI_API_KEY")
    }

    pub fn new_with_api_key_env(
        api_key: impl Into<String>,
        base_url: Option<String>,
        api_key_env: impl Into<String>,
    ) -> Self {
        Self::new_with_api_key_env_and_provider(api_key, base_url, api_key_env, "openai", "OpenAI")
    }

    pub fn new_with_api_key_env_and_provider(
        api_key: impl Into<String>,
        base_url: Option<String>,
        api_key_env: impl Into<String>,
        provider_name: &'static str,
        provider_label: &'static str,
    ) -> Self {
        let base_url = base_url.unwrap_or_else(|| "https://api.openai.com/v1".to_string());
        let is_local = base_url.contains("localhost")
            || base_url.contains("127.0.0.1")
            || base_url.contains("[::1]");
        Self {
            api_key: api_key.into().trim().to_string(),
            api_key_env: (!is_local).then(|| api_key_env.into()),
            base_url,
            provider_name,
            provider_label,
            client: Client::new(),
        }
    }

    fn validate_api_key(&self) -> anyhow::Result<()> {
        if self.api_key.trim().is_empty() {
            if let Some(api_key_env) = &self.api_key_env {
                anyhow::bail!(
                    "ERROR: {} environment variable is not set. Set it before running sparky.",
                    api_key_env
                );
            }
        }
        Ok(())
    }
}

#[async_trait]
impl LlmProvider for OpenAiProvider {
    fn provider_name(&self) -> &str {
        self.provider_name
    }

    async fn complete(
        &self,
        messages: &[Message],
        options: &CompletionOptions,
    ) -> anyhow::Result<Message> {
        self.validate_api_key()?;
        let formatted = openai_messages(messages);
        let mut body = json!({
            "model": options.model,
            "messages": formatted,
        });

        if let Some(temp) = options.temperature {
            body["temperature"] = json!(temp);
        }
        if let Some(max) = options.max_tokens {
            body["max_tokens"] = json!(max);
        }
        if let Some(effort) = options.reasoning_effort.as_deref() {
            body["reasoning_effort"] = json!(effort);
        }

        if !options.tools.is_empty() {
            body["tools"] = json!(openai_tools(&options.tools));
        }

        let resp = send_with_retry(self.provider_name, || async {
            let mut req = self
                .client
                .post(format!("{}/chat/completions", self.base_url))
                .json(&body);
            if !self.api_key.is_empty() {
                req = req.bearer_auth(&self.api_key);
            }
            req.send().await
        })
        .await?;
        if !resp.status().is_success() {
            let status = resp.status();
            let err_text = resp.text().await?;
            let hint = if matches!(status.as_u16(), 401 | 403) {
                " Check that the API key is valid and authorized for this model."
            } else {
                ""
            };
            anyhow::bail!(
                "{} API error (HTTP {}): {}{}",
                self.provider_label,
                status,
                err_text,
                hint
            );
        }

        let val: Value = resp.json().await?;
        let choice = &val["choices"][0]["message"];
        let content_str = choice["content"].as_str().unwrap_or("").to_string();

        let tool_calls = choice["tool_calls"].as_array().map(|arr| {
            arr.iter()
                .map(|tc| {
                    let id = tc["id"].as_str().unwrap_or("").to_string();
                    let name = tc["function"]["name"].as_str().unwrap_or("").to_string();
                    let args_str = tc["function"]["arguments"].as_str().unwrap_or("{}");
                    let args: Value = serde_json::from_str(args_str).unwrap_or(json!({}));
                    ToolCall {
                        id,
                        name,
                        arguments: args,
                    }
                })
                .collect()
        });

        let mut msg = Message::assistant(content_str, tool_calls);
        msg.provider = Some(self.provider_name.to_string());
        msg.model = Some(options.model.clone());
        Ok(msg)
    }

    async fn stream(
        &self,
        messages: &[Message],
        options: &CompletionOptions,
    ) -> anyhow::Result<EventStream> {
        self.validate_api_key()?;
        let formatted = openai_messages(messages);
        let mut body = json!({
            "model": options.model,
            "messages": formatted,
            "stream": true,
            "stream_options": { "include_usage": true }
        });

        if let Some(temp) = options.temperature {
            body["temperature"] = json!(temp);
        }
        if let Some(max) = options.max_tokens {
            body["max_tokens"] = json!(max);
        }
        if let Some(effort) = options.reasoning_effort.as_deref() {
            body["reasoning_effort"] = json!(effort);
        }

        if !options.tools.is_empty() {
            body["tools"] = json!(openai_tools(&options.tools));
        }

        let resp = send_with_retry(self.provider_name, || async {
            let mut req = self
                .client
                .post(format!("{}/chat/completions", self.base_url))
                .json(&body);
            if !self.api_key.is_empty() {
                req = req.bearer_auth(&self.api_key);
            }
            req.send().await
        })
        .await?;
        if !resp.status().is_success() {
            let status = resp.status();
            let err_text = resp.text().await?;
            let hint = if matches!(status.as_u16(), 401 | 403) {
                " Check that the API key is valid and authorized for this model."
            } else {
                ""
            };
            anyhow::bail!(
                "{} API error (HTTP {}): {}{}",
                self.provider_label,
                status,
                err_text,
                hint
            );
        }

        Ok(stream_parser::openai(resp))
    }
}
