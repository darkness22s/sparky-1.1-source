use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::path::{Path, PathBuf};
use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::Command;

const JWT_CLAIM_PATH: &str = "https://api.openai.com/auth";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodexCredentials {
    pub access: String,
    pub refresh: String,
    pub expires: i64,
    pub account_id: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CodexAuthStatus {
    pub authenticated: bool,
    pub account_id: Option<String>,
    pub expires: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct ManagedCodexAuth {
    auth_mode: Option<String>,
    tokens: Option<ManagedCodexTokens>,
}

#[derive(Debug, Deserialize)]
struct ManagedCodexTokens {
    access_token: String,
    refresh_token: String,
    account_id: Option<String>,
}

fn home_dir() -> anyhow::Result<PathBuf> {
    std::env::var_os("USERPROFILE")
        .or_else(|| std::env::var_os("HOME"))
        .map(PathBuf::from)
        .ok_or_else(|| anyhow::anyhow!("Unable to resolve the user home directory"))
}

fn codex_home() -> anyhow::Result<PathBuf> {
    if let Some(path) = std::env::var_os("SPARKY_CODEX_HOME") {
        return Ok(PathBuf::from(path));
    }
    if let Some(path) = std::env::var_os("CODEX_HOME") {
        return Ok(PathBuf::from(path));
    }
    Ok(home_dir()?.join(".codex"))
}

fn codex_binary() -> PathBuf {
    std::env::var_os("SPARKY_CODEX_BINARY_PATH")
        .or_else(|| std::env::var_os("CODEX_BINARY_PATH"))
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("codex"))
}

pub fn codex_auth_path() -> anyhow::Result<PathBuf> {
    Ok(codex_home()?.join("auth.json"))
}

fn decode_jwt_payload(access: &str) -> anyhow::Result<Value> {
    let payload = access
        .split('.')
        .nth(1)
        .ok_or_else(|| anyhow::anyhow!("Invalid ChatGPT access token"))?;
    let decoded = URL_SAFE_NO_PAD.decode(payload)?;
    Ok(serde_json::from_slice(&decoded)?)
}

fn account_id(access: &str) -> anyhow::Result<String> {
    let value = decode_jwt_payload(access)?;
    value[JWT_CLAIM_PATH]["chatgpt_account_id"]
        .as_str()
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .ok_or_else(|| anyhow::anyhow!("ChatGPT account id is missing from the access token"))
}

fn expires_at(access: &str) -> anyhow::Result<i64> {
    let value = decode_jwt_payload(access)?;
    value["exp"]
        .as_i64()
        .map(|seconds| seconds.saturating_mul(1000))
        .ok_or_else(|| anyhow::anyhow!("ChatGPT access token expiry is missing"))
}

fn read_managed_credentials(path: &Path) -> anyhow::Result<CodexCredentials> {
    let data = std::fs::read(path)?;
    let auth: ManagedCodexAuth = serde_json::from_slice(&data)?;
    anyhow::ensure!(
        auth.auth_mode.as_deref() == Some("chatgpt"),
        "Codex is not signed in with ChatGPT"
    );
    let tokens = auth
        .tokens
        .ok_or_else(|| anyhow::anyhow!("Codex auth.json does not contain ChatGPT tokens"))?;
    anyhow::ensure!(
        !tokens.access_token.trim().is_empty() && !tokens.refresh_token.trim().is_empty(),
        "Codex auth.json contains incomplete ChatGPT credentials"
    );
    let account_id = tokens
        .account_id
        .filter(|value| !value.trim().is_empty())
        .or_else(|| account_id(&tokens.access_token).ok())
        .ok_or_else(|| anyhow::anyhow!("ChatGPT account id is missing"))?;
    Ok(CodexCredentials {
        expires: expires_at(&tokens.access_token)?,
        access: tokens.access_token,
        refresh: tokens.refresh_token,
        account_id,
    })
}

async fn run_codex(args: &[&str]) -> anyhow::Result<()> {
    let output = Command::new(codex_binary())
        .args(args)
        .env("CODEX_HOME", codex_home()?)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .await
        .map_err(|error| {
            anyhow::anyhow!(
                "Unable to start the Codex CLI. Install Codex or set SPARKY_CODEX_BINARY_PATH: {error}"
            )
        })?;
    if output.status.success() {
        return Ok(());
    }
    let detail = String::from_utf8_lossy(&output.stderr).trim().to_string();
    anyhow::bail!(
        "Codex {} failed{}",
        args.join(" "),
        if detail.is_empty() {
            format!(" (exit code {})", output.status.code().unwrap_or(-1))
        } else {
            format!(": {detail}")
        }
    )
}

async fn write_rpc_line(
    stdin: &mut tokio::process::ChildStdin,
    value: Value,
) -> anyhow::Result<()> {
    stdin.write_all(value.to_string().as_bytes()).await?;
    stdin.write_all(b"\n").await?;
    stdin.flush().await?;
    Ok(())
}

async fn read_rpc_response(
    lines: &mut tokio::io::Lines<BufReader<tokio::process::ChildStdout>>,
    id: i64,
) -> anyhow::Result<Value> {
    loop {
        let line = tokio::time::timeout(std::time::Duration::from_secs(30), lines.next_line())
            .await
            .map_err(|_| anyhow::anyhow!("Codex authentication refresh timed out"))??
            .ok_or_else(|| {
                anyhow::anyhow!("Codex app-server closed during authentication refresh")
            })?;
        let value: Value = serde_json::from_str(&line)?;
        if value["id"].as_i64() != Some(id) {
            continue;
        }
        if !value["error"].is_null() {
            anyhow::bail!("Codex authentication refresh failed: {}", value["error"]);
        }
        return Ok(value["result"].clone());
    }
}

/// Ask Codex's supported app-server to refresh its managed ChatGPT tokens.
/// Sparky never writes or logs the token file; it only reads the refreshed
/// credentials after app-server has completed the normal managed flow.
async fn refresh_managed_auth() -> anyhow::Result<()> {
    let mut child = Command::new(codex_binary())
        .arg("app-server")
        .env("CODEX_HOME", codex_home()?)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .kill_on_drop(true)
        .spawn()
        .map_err(|error| anyhow::anyhow!("Unable to start Codex app-server: {error}"))?;
    let mut stdin = child
        .stdin
        .take()
        .ok_or_else(|| anyhow::anyhow!("Codex app-server stdin was unavailable"))?;
    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| anyhow::anyhow!("Codex app-server stdout was unavailable"))?;
    let mut lines = BufReader::new(stdout).lines();

    write_rpc_line(
        &mut stdin,
        json!({
            "method": "initialize",
            "id": 1,
            "params": {
                "clientInfo": {
                    "name": "sparky",
                    "title": "Sparky",
                    "version": env!("CARGO_PKG_VERSION")
                },
                "capabilities": { "experimentalApi": true }
            }
        }),
    )
    .await?;
    let _ = read_rpc_response(&mut lines, 1).await?;
    write_rpc_line(&mut stdin, json!({ "method": "initialized" })).await?;
    write_rpc_line(
        &mut stdin,
        json!({ "method": "account/read", "id": 2, "params": { "refreshToken": true } }),
    )
    .await?;
    let result = read_rpc_response(&mut lines, 2).await?;
    anyhow::ensure!(
        !result["account"].is_null(),
        "Codex is not signed in with ChatGPT"
    );
    let _ = child.kill().await;
    Ok(())
}

pub async fn login_codex() -> anyhow::Result<CodexAuthStatus> {
    run_codex(&["login"]).await?;
    let status = codex_auth_status();
    anyhow::ensure!(
        status.authenticated,
        "Codex login finished without a usable ChatGPT session"
    );
    Ok(status)
}

pub fn codex_auth_status() -> CodexAuthStatus {
    let credentials = codex_auth_path()
        .ok()
        .and_then(|path| read_managed_credentials(&path).ok());
    CodexAuthStatus {
        authenticated: credentials.is_some(),
        account_id: credentials.as_ref().map(|value| value.account_id.clone()),
        expires: credentials.map(|value| value.expires),
    }
}

pub async fn logout_codex() -> anyhow::Result<CodexAuthStatus> {
    run_codex(&["logout"]).await?;
    Ok(codex_auth_status())
}

pub async fn valid_codex_credentials() -> anyhow::Result<CodexCredentials> {
    let path = codex_auth_path()?;
    let mut credentials = read_managed_credentials(&path).map_err(|error| {
        anyhow::anyhow!("Sign in with ChatGPT from Sparky Models settings first ({error})")
    })?;
    if credentials.expires <= chrono::Utc::now().timestamp_millis() + 5 * 60 * 1000 {
        refresh_managed_auth().await.map_err(|error| {
            anyhow::anyhow!(
                "Your ChatGPT session could not be refreshed. Sign in again from Models settings ({error})"
            )
        })?;
        credentials = read_managed_credentials(&path)?;
    }
    Ok(credentials)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_managed_codex_auth_without_rewriting_it() {
        let access = format!(
            "header.{}.signature",
            URL_SAFE_NO_PAD.encode(
                json!({
                    "exp": 2_000_000_000,
                    JWT_CLAIM_PATH: { "chatgpt_account_id": "account-1" }
                })
                .to_string()
            )
        );
        let directory =
            std::env::temp_dir().join(format!("sparky-codex-auth-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&directory).unwrap();
        let path = directory.join("auth.json");
        std::fs::write(
            &path,
            json!({
                "auth_mode": "chatgpt",
                "tokens": {
                    "access_token": access,
                    "refresh_token": "refresh",
                    "account_id": "account-1"
                }
            })
            .to_string(),
        )
        .unwrap();
        let credentials = read_managed_credentials(&path).unwrap();
        assert_eq!(credentials.account_id, "account-1");
        assert_eq!(credentials.expires, 2_000_000_000_000);
        std::fs::remove_dir_all(directory).unwrap();
    }
}
