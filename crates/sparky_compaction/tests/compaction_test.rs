use async_trait::async_trait;
use sparky_ai::{CompletionOptions, EventStream, LlmProvider, Message};
use sparky_compaction::CompactionEngine;
use sparky_session::SessionManager;
use std::sync::Arc;

struct SummaryProvider;

#[async_trait]
impl LlmProvider for SummaryProvider {
    fn provider_name(&self) -> &str {
        "test"
    }

    async fn complete(
        &self,
        _messages: &[Message],
        _options: &CompletionOptions,
    ) -> anyhow::Result<Message> {
        Ok(Message::assistant("old work summarized", None))
    }

    async fn stream(
        &self,
        _messages: &[Message],
        _options: &CompletionOptions,
    ) -> anyhow::Result<EventStream> {
        anyhow::bail!("compaction should use complete")
    }
}

#[tokio::test]
async fn compaction_replaces_old_prefix_with_summary_and_keeps_recent_message() {
    let dir = tempfile::tempdir().unwrap();
    let cwd = dir.path().to_str().unwrap();
    let mut session = SessionManager::create_new(cwd, None).await.unwrap();
    for index in 0..4 {
        session
            .append_message(Message::user(format!(
                "message-{index}:{}",
                "x".repeat(100_000)
            )))
            .await
            .unwrap();
    }

    let compacted = CompactionEngine::new(0.0)
        .compact(&mut session, Arc::new(SummaryProvider), "test-model", 1)
        .await
        .unwrap();

    assert!(compacted);
    assert_eq!(session.entry_count(), 2);
    let context = session.build_context_messages();
    assert_eq!(context.len(), 2);
    assert_eq!(
        context[0].text(),
        "[Compaction Summary]: old work summarized"
    );
    assert!(context[1].text().starts_with("message-3:"));
}
