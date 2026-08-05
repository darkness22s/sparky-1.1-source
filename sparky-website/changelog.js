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

async function loadChangelog() {
  const list = document.getElementById("changelog-list");
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
    if (currentReleases.length === 0 && previousReleases.length === 0) {
      throw new Error("Release history unavailable");
    }

    const releasesByVersion = new Map();
    for (const release of [...currentReleases, ...previousReleases]) {
      if (release.channel === "release" && release.version && !releasesByVersion.has(release.version)) {
        releasesByVersion.set(release.version, release);
      }
    }
    const published = [...releasesByVersion.values()].sort(
      (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0),
    );
    list.replaceChildren(...published.map((release) => {
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
    if (!published.length) list.innerHTML = '<p class="cl-loading">No published release notes yet.</p>';
  } catch {
    list.innerHTML = '<p class="cl-loading">The changelog is temporarily unavailable.</p>';
  }
}

void loadChangelog();
