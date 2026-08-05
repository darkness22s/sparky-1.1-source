use crate::tool::{truncate_output, Tool, ToolExecutionResult};
use async_trait::async_trait;
use regex::Regex;
use serde_json::json;

pub struct WebSearchTool;

#[async_trait]
impl Tool for WebSearchTool {
    fn name(&self) -> &str {
        "web_search"
    }

    fn label(&self) -> &str {
        "Web Search"
    }

    fn description(&self) -> &str {
        "Search the web via DuckDuckGo. Use this to find documentation, solutions, API references, or any current information. Results include titles, snippets, and URLs."
    }

    fn parameters(&self) -> serde_json::Value {
        json!({
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query (e.g. 'Python std::fs read file', 'Rust serde derive macro docs', 'Next.js 14 app router middleware')"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of results to return (default: 5, max: 10)",
                    "default": 5
                }
            },
            "required": ["query"]
        })
    }

    async fn execute(
        &self,
        args: serde_json::Value,
        _cwd: &str,
    ) -> anyhow::Result<ToolExecutionResult> {
        let query = match args.get("query").and_then(|v| v.as_str()) {
            Some(q) => q.trim(),
            None => return Ok(ToolExecutionResult::error("Missing 'query' parameter")),
        };

        if query.is_empty() {
            return Ok(ToolExecutionResult::error("Query cannot be empty"));
        }

        let max_results = args
            .get("max_results")
            .and_then(|v| v.as_i64())
            .unwrap_or(5)
            .min(10)
            .max(1) as usize;

        match search_duckduckgo(query, max_results).await {
            Ok(results) => {
                if results.is_empty() {
                    Ok(ToolExecutionResult::success("No results found."))
                } else {
                    let output = truncate_output(
                        format_results(&results),
                        sparky_config::DEFAULT_TOOL_OUTPUT_LIMIT_BYTES,
                    );
                    Ok(ToolExecutionResult::success(output))
                }
            }
            Err(e) => Ok(ToolExecutionResult::error(format!("Search failed: {}", e))),
        }
    }
}

#[derive(Debug)]
struct SearchResult {
    title: String,
    snippet: String,
    url: String,
}

async fn search_duckduckgo(query: &str, max_results: usize) -> anyhow::Result<Vec<SearchResult>> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .user_agent("Mozilla/5.0 (compatible; SparkySearch/1.0)")
        .build()?;

    // First try the Instant Answer API for quick structured data
    let api_url = format!(
        "https://api.duckduckgo.com/?q={}&format=json&no_html=1&skip_disambig=1",
        urlencoding(query)
    );

    let mut all_results: Vec<SearchResult> = Vec::new();

    if let Ok(resp) = client.get(&api_url).send().await {
        if let Ok(body) = resp.text().await {
            if let Ok(ddg_response) = serde_json::from_str::<serde_json::Value>(&body) {
                // Extract abstract
                if let Some(abstract_text) = ddg_response["AbstractText"].as_str() {
                    if !abstract_text.is_empty() {
                        let url = ddg_response["AbstractURL"].as_str().unwrap_or("");
                        let source = ddg_response["AbstractSource"].as_str().unwrap_or("");
                        all_results.push(SearchResult {
                            title: format!("{} - {}", source, truncate(abstract_text, 80)),
                            snippet: abstract_text.to_string(),
                            url: url.to_string(),
                        });
                    }
                }

                // Extract related topics
                if let Some(topics) = ddg_response["RelatedTopics"].as_array() {
                    for topic in topics {
                        if all_results.len() >= max_results {
                            break;
                        }
                        if let Some(text) = topic["Text"].as_str() {
                            let url = topic["FirstURL"].as_str().unwrap_or("");
                            if !text.is_empty() && !url.is_empty() {
                                all_results.push(SearchResult {
                                    title: truncate(text, 80).to_string(),
                                    snippet: text.to_string(),
                                    url: url.to_string(),
                                });
                            }
                        }
                        // Check nested topics
                        if let Some(topics) = topic["Topics"].as_array() {
                            for sub in topics {
                                if all_results.len() >= max_results {
                                    break;
                                }
                                if let Some(text) = sub["Text"].as_str() {
                                    let url = sub["FirstURL"].as_str().unwrap_or("");
                                    if !text.is_empty() && !url.is_empty() {
                                        all_results.push(SearchResult {
                                            title: truncate(text, 80).to_string(),
                                            snippet: text.to_string(),
                                            url: url.to_string(),
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                // Extract external results
                if let Some(results) = ddg_response["Results"].as_array() {
                    for result in results {
                        if all_results.len() >= max_results {
                            break;
                        }
                        let text = result["Text"].as_str().unwrap_or("");
                        let url = result["FirstURL"].as_str().unwrap_or("");
                        if !text.is_empty() && !url.is_empty() {
                            all_results.push(SearchResult {
                                title: truncate(text, 80).to_string(),
                                snippet: text.to_string(),
                                url: url.to_string(),
                            });
                        }
                    }
                }
            }
        }
    }

    // If we don't have enough results, also scrape the HTML search page
    if all_results.len() < max_results {
        let html_url = format!("https://html.duckduckgo.com/html/?q={}", urlencoding(query));

        if let Ok(resp) = client.get(&html_url).send().await {
            if let Ok(body) = resp.text().await {
                // Parse HTML results using regex
                let re = Regex::new(
                    r##"<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>([^<]*)</a>"##,
                )
                .unwrap_or_else(|_| Regex::new("").unwrap());

                let snippet_re =
                    Regex::new(r##"<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*href="[^"]*"[^>]*>([^<]*)</a>"##)
                        .unwrap_or_else(|_| Regex::new("").unwrap());

                let urls: Vec<String> = re.captures_iter(&body).map(|c| c[1].to_string()).collect();
                let titles: Vec<String> =
                    re.captures_iter(&body).map(|c| c[2].to_string()).collect();
                let snippets: Vec<String> = snippet_re
                    .captures_iter(&body)
                    .map(|c| c[1].to_string())
                    .collect();

                // Deduplicate by URL
                let mut seen_urls = std::collections::HashSet::new();
                for (i, url) in urls.iter().enumerate() {
                    if all_results.len() >= max_results {
                        break;
                    }
                    if url.is_empty() || url.starts_with("//") {
                        continue;
                    }
                    let clean_url = if url.starts_with("/") {
                        format!("https://duckduckgo.com{}", url)
                    } else {
                        url.to_string()
                    };
                    if seen_urls.contains(&clean_url) {
                        continue;
                    }
                    seen_urls.insert(clean_url.clone());

                    let title = titles.get(i).cloned().unwrap_or_default();
                    let snippet = snippets.get(i).cloned().unwrap_or_default();

                    let decoded_title = decode_html_entities(&title);
                    let decoded_snippet = decode_html_entities(&snippet);

                    all_results.push(SearchResult {
                        title: decoded_title,
                        snippet: decoded_snippet,
                        url: clean_url,
                    });
                }
            }
        }
    }

    // Trim to max_results
    all_results.truncate(max_results);
    Ok(all_results)
}

fn format_results(results: &[SearchResult]) -> String {
    let mut output = String::new();
    output.push_str(&format!("Web search results ({}):\n\n", results.len()));
    for (i, r) in results.iter().enumerate() {
        output.push_str(&format!("{}. {}\n", i + 1, r.title));
        output.push_str(&format!("   URL: {}\n", r.url));
        if !r.snippet.is_empty() {
            output.push_str(&format!("   {}\n", r.snippet));
        }
        output.push('\n');
    }
    output
}

fn urlencoding(query: &str) -> String {
    let mut encoded = String::new();
    for byte in query.as_bytes() {
        match *byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                encoded.push(*byte as char);
            }
            b' ' => encoded.push_str("+"),
            _ => encoded.push_str(&format!("%{:02X}", byte)),
        }
    }
    encoded
}

fn truncate(s: &str, max: usize) -> &str {
    if s.len() <= max {
        s
    } else {
        &s[..max]
    }
}

fn decode_html_entities(s: &str) -> String {
    s.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#39;", "'")
        .replace("&#x27;", "'")
        .replace("&#x2F;", "/")
        .replace("&nbsp;", " ")
}
