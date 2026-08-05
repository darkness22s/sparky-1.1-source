use sparky_ai::{CompletionOptions, LlmProvider, Message};
use sparky_session::{SessionEntry, SessionManager};
use std::sync::Arc;
use uuid::Uuid;

const KEEP_RECENT_TOKENS: usize = 20_000;

#[derive(Debug, Clone)]
pub struct ContextUsage {
    pub estimated_tokens: usize,
    pub max_tokens: usize,
    pub percentage: f32,
}

pub struct CompactionEngine {
    threshold_percent: f32,
}

impl Default for CompactionEngine {
    fn default() -> Self {
        Self {
            threshold_percent: 80.0,
        }
    }
}

impl CompactionEngine {
    pub fn new(threshold_percent: f32) -> Self {
        Self { threshold_percent }
    }

    pub fn estimate_tokens(messages: &[Message]) -> usize {
        messages.iter().map(Message::estimated_tokens).sum()
    }

    pub fn calculate_usage(&self, messages: &[Message], max_context_window: usize) -> ContextUsage {
        let estimated = Self::estimate_tokens(messages);
        let pct = if max_context_window > 0 {
            (estimated as f32 / max_context_window as f32) * 100.0
        } else {
            0.0
        };

        ContextUsage {
            estimated_tokens: estimated,
            max_tokens: max_context_window,
            percentage: pct,
        }
    }

    pub fn should_compact(&self, usage: &ContextUsage) -> bool {
        usage.percentage >= self.threshold_percent
    }

    pub async fn compact(
        &self,
        session: &mut SessionManager,
        provider: Arc<dyn LlmProvider>,
        model_name: &str,
        max_context_window: usize,
    ) -> anyhow::Result<bool> {
        let messages = session.build_context_messages();
        let usage = self.calculate_usage(&messages, max_context_window);

        if !self.should_compact(&usage) || messages.len() < 4 {
            return Ok(false);
        }

        let first_kept_entry_id = session
            .first_entry_id_for_recent_tokens(KEEP_RECENT_TOKENS)
            .ok_or_else(|| anyhow::anyhow!("Cannot compact a session without message entries"))?;

        let history = messages
            .iter()
            .map(|message| {
                let role = format!("{:?}", message.role);
                let text = message.text();
                let tool_calls = message
                    .tool_calls
                    .as_deref()
                    .unwrap_or_default()
                    .iter()
                    .map(|call| format!("{}({})", call.name, call.arguments))
                    .collect::<Vec<_>>()
                    .join(", ");
                if tool_calls.is_empty() {
                    format!("[{role}]\n{text}")
                } else {
                    format!("[{role}]\n{text}\nTool calls: {tool_calls}")
                }
            })
            .collect::<Vec<_>>()
            .join("\n\n");
        let prompt = vec![
            Message::system("You are a concise conversation summarizer. Preserve key facts, decisions, file modifications, tool results, unresolved errors, and ongoing goals. Return a structured summary that another coding agent can act on without the original transcript."),
            Message::user(format!("Summarize this conversation context:\n\n{history}")),
        ];

        let options = CompletionOptions {
            model: model_name.to_string(),
            temperature: Some(0.3),
            max_tokens: Some(1024),
            ..Default::default()
        };

        let summary_msg = provider.complete(&prompt, &options).await?;
        let summary_text = summary_msg.text();

        let compaction_entry = SessionEntry::Compaction {
            id: Uuid::new_v4().to_string(),
            parent_id: None,
            timestamp: chrono::Utc::now().to_rfc3339(),
            summary: summary_text,
            first_kept_entry_id: first_kept_entry_id.clone(),
            tokens_before: usage.estimated_tokens as u32,
        };

        session.append_entry(compaction_entry).await?;
        session.trim_entries_before(&first_kept_entry_id)?;
        session.rewrite_session_file().await?;
        Ok(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn calculates_usage_from_the_explicit_provider_window() {
        let engine = CompactionEngine::default();
        let usage = engine.calculate_usage(&[Message::user("hello")], 1_000);
        assert_eq!(usage.max_tokens, 1_000);
        assert!(usage.estimated_tokens > 0);
    }
}
