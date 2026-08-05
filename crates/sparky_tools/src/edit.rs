use crate::path_guard::canonicalize_existing;
use crate::tool::{Tool, ToolExecutionMode, ToolExecutionResult};
use async_trait::async_trait;
use serde_json::json;
use similar::TextDiff;
use tokio::fs;

pub struct EditTool;

#[async_trait]
impl Tool for EditTool {
    fn name(&self) -> &str {
        "edit"
    }

    fn label(&self) -> &str {
        "Edit File"
    }

    fn description(&self) -> &str {
        "Replace an exact target string block with new replacement text in a file."
    }

    fn parameters(&self) -> serde_json::Value {
        json!({
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Path to file to edit"
                },
                "old_text": {
                    "type": "string",
                    "description": "Exact existing content block to be replaced"
                },
                "new_text": {
                    "type": "string",
                    "description": "New content block to insert"
                }
            },
            "required": ["path", "old_text", "new_text"]
        })
    }

    fn execution_mode(&self) -> ToolExecutionMode {
        ToolExecutionMode::Sequential
    }

    async fn execute(
        &self,
        args: serde_json::Value,
        cwd: &str,
    ) -> anyhow::Result<ToolExecutionResult> {
        let rel_path = match args.get("path").and_then(|v| v.as_str()) {
            Some(p) => p,
            None => return Ok(ToolExecutionResult::error("Missing 'path' parameter")),
        };

        let old_text = match args.get("old_text").and_then(|v| v.as_str()) {
            Some(t) => t,
            None => return Ok(ToolExecutionResult::error("Missing 'old_text' parameter")),
        };

        let new_text = match args.get("new_text").and_then(|v| v.as_str()) {
            Some(t) => t,
            None => return Ok(ToolExecutionResult::error("Missing 'new_text' parameter")),
        };

        let full_path = match canonicalize_existing(cwd, rel_path) {
            Ok(path) => path,
            Err(err) => return Ok(ToolExecutionResult::error(err.to_string())),
        };

        let content = match fs::read_to_string(&full_path).await {
            Ok(c) => c,
            Err(e) => {
                return Ok(ToolExecutionResult::error(format!(
                    "Failed to read file {}: {}",
                    rel_path, e
                )))
            }
        };

        let matches: Vec<_> = content.match_indices(old_text).collect();
        if matches.is_empty() {
            return Ok(ToolExecutionResult::error(format!(
                "Could not find exact match for target 'old_text' in {}",
                rel_path
            )));
        }
        if matches.len() > 1 {
            return Ok(ToolExecutionResult::error(format!(
                "Found {} multiple occurrences of target 'old_text' in {}. Please provide a more unique target block.",
                matches.len(),
                rel_path
            )));
        }

        let updated = content.replacen(old_text, new_text, 1);
        let diff = TextDiff::from_lines(&content, &updated)
            .unified_diff()
            .header(rel_path, rel_path)
            .to_string();
        match fs::write(&full_path, updated).await {
            Ok(_) => Ok(ToolExecutionResult::success(format!(
                "Successfully edited {}\n\n{}",
                rel_path, diff
            ))),
            Err(e) => Ok(ToolExecutionResult::error(format!(
                "Failed to write updated file {}: {}",
                rel_path, e
            ))),
        }
    }
}
