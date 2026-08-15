const featuredRelease = {
  version: "1.1.2",
  publishedAt: "2026-08-09T00:00:00.000Z",
  name: "Memory, continuity, and a more dependable Sparky",
  intro:
    "Sparky 1.1.2 is a major reliability release built around one goal: helping the agent stay useful and trustworthy across real, long-running work.",
  summary:
    "Persistent Memory can now carry preferences and project context into future sessions. Provider conversations survive follow-ups, reloads, and compaction more reliably, while tool execution, streaming, cancellation, model discovery, and desktop feedback all received substantial hardening.",
  highlights: [
    "Create and manage global or project-scoped memories from Settings.",
    "Keep provider context intact across follow-ups, reloads, and Codex compaction.",
    "Get safer Windows file edits, clearer tool states, and more reliable cancellation.",
    "Use improved model capabilities, multimodal requests, Plan mode, notifications, and Linux support.",
  ],
  fullPostPath: "/release-notes/1.1.2.txt",
};

function renderChangelog(text) {
  const fragment = document.createDocumentFragment();
  let list = null;
  for (const rawLine of String(text || "").split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line) {
      list = null;
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!list) {
        list = document.createElement("ul");
        fragment.append(list);
      }
      const item = document.createElement("li");
      item.textContent = line.slice(2);
      list.append(item);
      continue;
    }
    list = null;
    const paragraph = document.createElement("p");
    paragraph.textContent = line.replace(/^#{1,6}\s+/u, "");
    fragment.append(paragraph);
  }
  return fragment;
}

let fullPostView = null;

function createFullPostView() {
  const dialog = document.createElement("dialog");
  dialog.className = "cl-dialog";
  dialog.setAttribute("aria-labelledby", "release-1-1-2-title");

  const panel = document.createElement("div");
  panel.className = "cl-dialog-panel";

  const header = document.createElement("header");
  header.className = "cl-dialog-header";
  const headingGroup = document.createElement("div");
  const kicker = document.createElement("span");
  kicker.className = "cl-dialog-kicker";
  kicker.textContent = "Full release notes";
  const heading = document.createElement("h2");
  heading.id = "release-1-1-2-title";
  heading.textContent = "Sparky 1.1.2";
  headingGroup.append(kicker, heading);

  const close = document.createElement("button");
  close.className = "cl-dialog-close";
  close.type = "button";
  close.setAttribute("aria-label", "Close full release notes");
  close.textContent = "Close";
  close.addEventListener("click", () => dialog.close());
  header.append(headingGroup, close);

  const content = document.createElement("div");
  content.className = "cl-post-raw";
  content.textContent = "Loading the full release notes…";
  panel.append(header, content);
  dialog.append(panel);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.body.append(dialog);
  return { content, dialog };
}

async function openFullPost() {
  fullPostView ||= createFullPostView();
  const { content, dialog } = fullPostView;
  if (!dialog.open) dialog.showModal();
  if (content.dataset.loaded === "true") return;

  try {
    const response = await fetch(featuredRelease.fullPostPath, { cache: "no-store" });
    if (!response.ok) throw new Error("Release notes unavailable");
    content.textContent = await response.text();
    content.dataset.loaded = "true";
  } catch {
    content.textContent = "The full release notes could not be loaded. Please try again.";
  }
}

function createFeaturedRelease() {
  const article = document.createElement("article");
  article.className = "cl-entry cl-entry-featured";

  const meta = document.createElement("div");
  meta.className = "cl-meta";
  const tag = document.createElement("span");
  tag.className = "cl-version";
  tag.textContent = featuredRelease.version;
  const date = document.createElement("time");
  date.className = "cl-date";
  date.dateTime = featuredRelease.publishedAt;
  date.textContent = "August 9, 2026";
  meta.append(tag, date);

  const body = document.createElement("div");
  body.className = "cl-body";
  const kicker = document.createElement("span");
  kicker.className = "cl-kicker";
  kicker.textContent = "Release spotlight";
  const heading = document.createElement("h2");
  heading.textContent = featuredRelease.name;
  const intro = document.createElement("p");
  intro.className = "cl-intro";
  intro.textContent = featuredRelease.intro;
  const summary = document.createElement("p");
  summary.textContent = featuredRelease.summary;
  const highlights = document.createElement("ul");
  for (const highlight of featuredRelease.highlights) {
    const item = document.createElement("li");
    item.textContent = highlight;
    highlights.append(item);
  }
  const button = document.createElement("button");
  button.className = "cl-read-more";
  button.type = "button";
  button.setAttribute("aria-haspopup", "dialog");
  button.textContent = "Read full blog post";
  button.addEventListener("click", () => void openFullPost());
  body.append(kicker, heading, intro, summary, highlights, button);
  article.append(meta, body);
  return article;
}

async function loadChangelog() {
  const list = document.getElementById("changelog-list");
  list.replaceChildren(createFeaturedRelease());
  try {
    const [currentResponse, previousResponse] = await Promise.all([
      fetch("/get/releases", { cache: "no-store" }),
      fetch("https://api.github.com/repos/darkness22s/sparky-macos-builder/releases?per_page=30", {
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);
    const currentReleases = currentResponse.ok ? await currentResponse.json() : [];
    const previousReleases = previousResponse.ok
      ? (await previousResponse.json())
          .filter((release) => !release.draft && !release.prerelease && /^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u.test(release.tag_name || ""))
          .map((release) => ({
            version: release.tag_name.replace(/^v/u, ""),
            name: release.name || `Sparky ${release.tag_name.replace(/^v/u, "")}`,
            changelog: release.body?.trim() || "Release published.",
            publishedAt: release.published_at || null,
            channel: "release",
          }))
      : [];
    const releasesByVersion = new Map();
    for (const release of [...currentReleases, ...previousReleases]) {
      if (
        release.channel === "release" &&
        release.version &&
        release.version !== featuredRelease.version &&
        !releasesByVersion.has(release.version)
      ) {
        releasesByVersion.set(release.version, release);
      }
    }
    const published = [...releasesByVersion.values()].sort(
      (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0),
    );
    list.append(...published.map((release) => {
      const article = document.createElement("article");
      article.className = "cl-entry";
      const meta = document.createElement("div");
      meta.className = "cl-meta";
      const tag = document.createElement("span");
      tag.className = "cl-version";
      tag.textContent = release.version;
      const date = document.createElement("time");
      date.className = "cl-date";
      date.textContent = release.publishedAt
        ? new Date(release.publishedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })
        : "Published release";
      meta.append(tag, date);
      const heading = document.createElement("h2");
      heading.textContent = release.name;
      const body = document.createElement("div");
      body.className = "cl-body";
      body.append(heading);
      body.append(renderChangelog(release.changelog));
      article.append(meta, body);
      return article;
    }));
  } catch {}
}

void loadChangelog();
