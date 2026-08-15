import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { test } from "node:test";

const html = await readFile(new URL("./admin.html", import.meta.url), "utf8");
const script = await readFile(new URL("./admin.js", import.meta.url), "utf8");
const awsSigner = await readFile(new URL("../sparky-analytics/convex/awsReleases.ts", import.meta.url), "utf8");
const releaseBackend = await readFile(new URL("../sparky-analytics/convex/releases.ts", import.meta.url), "utf8");

test("Analytics exposes one all-platform Update action", () => {
  assert.match(html, /id="analytics-update-button"[^>]*>Update all apps</u);
  assert.match(script, /analytics-update-button/u);
  assert.match(script, /activateWorkspace\("releases-workspace"\)/u);
});

test("stable releases require Windows, Apple Silicon, Intel, and Linux bundles", () => {
  for (const id of ["release-files-windows", "release-files-mac-arm64", "release-files-mac-x64", "release-files-linux"]) {
    assert.match(html, new RegExp(`id="${id}"`, "u"));
  }
  for (const platform of ["windows-x64", "macos-arm64", "macos-x64", "linux-x64"]) {
    assert.match(script, new RegExp(`"${platform}"`, "u"));
  }
  assert.match(script, /awsReleases:createUploadUrl/u);
  assert.match(script, /awsReleases:publish/u);
  assert.match(script, /sha256File/u);
  assert.match(script, /signed\.alreadyUploaded/u);
  assert.doesNotMatch(html, /Convex File Storage/u);
});

test("AWS browser uploads use unsigned payloads without an empty-body checksum", () => {
  assert.match(awsSigner, /requestChecksumCalculation:\s*"WHEN_REQUIRED"/u);
  assert.doesNotMatch(script, /setRequestHeader\("x-amz-meta-sha256"/u);
  assert.match(script, /request\.responseXML/u);
});

test("failed AWS drafts can be resumed without a misleading publish retry", () => {
  assert.match(releaseBackend, /existing\.status !== "draft"/u);
  assert.match(releaseBackend, /ctx\.db\.patch\(existing\._id, draft\)/u);
  assert.match(awsSigner, /AWS upload is missing for \$\{file\.platform\}\/\$\{file\.name\}/u);
  assert.match(script, /Verify uploaded files/u);
  assert.doesNotMatch(script, /Retry AWS publish/u);
});

test("admin Plugins workspace syncs, publishes, and separates Composio toolkits", () => {
  assert.match(html, /id="plugins-workspace"/u);
  assert.match(html, /id="sync-plugins"/u);
  assert.match(html, /id="plugin-available-list"/u);
  assert.match(html, /id="plugin-enabled-list"/u);
  assert.match(script, /pluginCatalog:syncComposioToolkits/u);
  assert.match(script, /pluginCatalog:\$\{action\}/u);
  assert.match(script, /action !== "add" && action !== "remove"/u);
  assert.match(html, /Already-added plugins are removed/u);
});

test("redesigned Docs and Changelog survive a production build", async () => {
  const dist = new URL("./dist/", import.meta.url);
  const styles = await readFile(new URL("styles.css", dist), "utf8");
  const changelog = await readFile(new URL("changelog.html", dist), "utf8");
  const changelogScript = await readFile(new URL("changelog.js", dist), "utf8");
  const releaseNotes = await readFile(new URL("release-notes/1.1.2.txt", dist), "utf8");
  const docs = await readFile(new URL("docs/overview.html", dist), "utf8");

  assert.match(styles, /Shared pages from the current Sparky redesign/u);
  assert.match(styles, /\.docs-layout/u);
  assert.match(styles, /\.cl-entry/u);
  assert.match(styles, /\.cl-dialog/u);
  assert.doesNotMatch(changelog, /legacy-pages/u);
  assert.doesNotMatch(docs, /legacy-pages/u);
  assert.match(changelog, /\/assets\/[^"]+\.css/u);
  assert.match(docs, /\/assets\/[^"]+\.css/u);
  assert.match(changelogScript, /Memory, Plan mode, images, and more/u);
  assert.match(changelogScript, /Read full blog post/u);
  assert.match(releaseNotes, /^Persistent Memory/u);
  assert.match(releaseNotes, /Desktop product identity remains Sparky\.\s*$/u);

  for (const name of ["styles.css", "script.js", "changelog.js", "logo.svg", "hero-iridescent.png"]) {
    const file = new URL(name, dist);
    await access(file);
    assert.ok((await stat(file)).size > 0, `${name} is empty`);
  }
});
