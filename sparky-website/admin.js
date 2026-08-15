const ADMIN_EMAIL = "soliamanmagbari@gmail.com";
const key = document.querySelector('meta[name="clerk-publishable-key"]')?.content;
const convexUrl = document.querySelector('meta[name="convex-client-url"]')?.content;
const views = ["auth-view", "blocked-view", "dashboard", "error-view"];
const show = (id) => views.forEach((view) => { document.getElementById(view).hidden = view !== id; });
const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
let releaseBusy = false;
let convexToken = null;
const metricKeys = [
  "uniqueVisitors",
  "sessions",
  "pageViews",
  "downloads",
  "downloadClicks",
  "downloadPageOpens",
  "downloadRequests",
  "downloadErrors",
  "demoInteractions",
  "engagedMs",
  "appUsers",
  "appLaunches",
];

function metricValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeDashboard(data) {
  const totals = Object.fromEntries(metricKeys.map((key) => [key, metricValue(data?.totals?.[key])]));
  const daily = Array.isArray(data?.daily)
    ? data.daily.map((day) => ({
        ...day,
        ...Object.fromEntries(metricKeys.map((key) => [key, metricValue(day?.[key])])),
      }))
    : [];
  return { ...data, totals, daily };
}

function duration(ms) {
  if (!ms) return "0s";
  const seconds = Math.round(ms / 1000);
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let latestData = null;
let chartMode = "traffic";
let pluginCatalogData = { syncedAt: null, enabled: [], available: [] };
let pluginSearchQuery = "";

function platformLabel(platform) {
  return ({
    "windows-x64": "Windows x64",
    "macos-arm64": "macOS Apple Silicon",
    "macos-x64": "macOS Intel",
    "linux-x64": "Linux x64",
    unknown: "Unknown platform",
  })[platform] || platform;
}

function chartSeries(data) {
  if (chartMode === "downloads") {
    return [
      { key: "intent", label: "Installer intent", className: "secondary", get: (day) => day.downloads + day.downloadClicks },
      { key: "requests", label: "Confirmed requests", className: "confirmed", get: (day) => day.downloadRequests },
      { key: "pageOpens", label: "Download page opens", className: "", get: (day) => day.downloadPageOpens },
    ];
  }
  return [
    { key: "pageViews", label: "Page views", className: "", get: (day) => day.pageViews },
    { key: "uniqueVisitors", label: "Unique visitors", className: "secondary", get: (day) => day.uniqueVisitors },
    { key: "requests", label: "Confirmed requests", className: "confirmed", get: (day) => day.downloadRequests },
  ];
}

function renderChart(data) {
  const chart = document.getElementById("chart");
  const title = document.getElementById("chart-title");
  if (!data.daily.length) {
    chart.innerHTML = '<div class="empty-chart"><p>Signals will appear here as the site and download router send classified events.</p></div>';
    return;
  }

  title.textContent = chartMode === "downloads" ? "Downloads, separated by evidence" : "Traffic over time";
  const width = 820;
  const height = 245;
  const left = 38;
  const right = 14;
  const top = 14;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const series = chartSeries(data);
  const values = series.flatMap((item) => data.daily.map(item.get));
  const max = Math.max(1, ...values);
  const x = (index) => left + (data.daily.length === 1 ? plotWidth / 2 : index * plotWidth / (data.daily.length - 1));
  const y = (value) => top + plotHeight - (value / max) * plotHeight;
  const pathFor = (item) => data.daily.map((day, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(item.get(day)).toFixed(1)}`).join(" ");
  const grid = [0, .25, .5, .75, 1].map((ratio) => {
    const lineY = top + plotHeight * ratio;
    return `<line class="chart-gridline" x1="${left}" y1="${lineY}" x2="${width - right}" y2="${lineY}" /><text class="chart-axis" x="0" y="${lineY + 4}">${compactNumber.format(Math.round(max * (1 - ratio)))}</text>`;
  }).join("");
  const labels = data.daily.map((day, index) => {
    if (data.daily.length > 10 && index % Math.ceil(data.daily.length / 7) !== 0 && index !== data.daily.length - 1) return "";
    return `<text class="chart-axis" text-anchor="middle" x="${x(index)}" y="${height - 5}">${new Date(`${day.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</text>`;
  }).join("");
  const firstSeries = series[0];
  const firstPath = pathFor(firstSeries);
  const areaPath = `${firstPath} L${x(data.daily.length - 1)},${top + plotHeight} L${x(0)},${top + plotHeight} Z`;
  const lines = series.map((item) => `<path class="chart-line ${item.className}" d="${pathFor(item)}"></path>`).join("");
  chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title.textContent)}"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#1499e8" stop-opacity=".22"></stop><stop offset="100%" stop-color="#1499e8" stop-opacity="0"></stop></linearGradient></defs>${grid}<path class="chart-area" d="${areaPath}"></path>${lines}${labels}</svg><div class="chart-legend">${series.map((item) => `<span><i class="${item.className}"></i>${item.label}</span>`).join("")}</div>`;
}

function renderFunnel(data) {
  const intent = data.totals.downloads + data.totals.downloadClicks;
  const requests = data.totals.downloadRequests;
  const ratio = intent ? Math.min(1, requests / intent) : 0;
  const circumference = 2 * Math.PI * 82;
  const innerCircumference = 2 * Math.PI * 57;
  document.getElementById("download-funnel").innerHTML = `<div class="funnel-graphic"><svg viewBox="0 0 220 220" aria-hidden="true"><circle class="funnel-track" cx="110" cy="110" r="82"></circle><circle class="funnel-arc" cx="110" cy="110" r="82" stroke-dasharray="${intent ? circumference : 0} ${circumference}"></circle><circle class="funnel-track" cx="110" cy="110" r="57"></circle><circle class="funnel-arc request" cx="110" cy="110" r="57" stroke-dasharray="${innerCircumference * ratio} ${innerCircumference}"></circle></svg><div class="funnel-center"><strong>${intent ? `${Math.round(ratio * 100)}%` : "—"}</strong><span>${intent ? "confirmed" : "awaiting data"}</span></div></div><div class="funnel-legend"><div class="funnel-stat"><span>Installer intent</span><strong>${compactNumber.format(intent)}</strong></div><div class="funnel-stat request"><span>Router requests</span><strong>${compactNumber.format(requests)}</strong></div></div>`;
}

function renderBreakdowns(data) {
  const platformTarget = document.getElementById("platform-breakdown");
  const platformRows = (data.downloadBreakdown || []).map((row) => ({
    ...row,
    clicks: metricValue(row.clicks),
    requests: metricValue(row.requests),
    errors: metricValue(row.errors),
  }));
  if (!platformRows.length) platformTarget.innerHTML = '<p class="breakdown-empty">Platform detail will appear after the updated click and router events arrive.</p>';
  else {
    const max = Math.max(1, ...platformRows.map((row) => Math.max(row.requests, row.clicks)));
    platformTarget.innerHTML = platformRows.map((row) => `<div class="breakdown-row"><div class="breakdown-label"><strong>${escapeHtml(platformLabel(row.platform))}</strong><span>${row.clicks} intent · ${row.requests} confirmed · ${row.errors} errors</span></div><strong class="breakdown-value">${row.requests}</strong><div class="breakdown-track"><span style="width:${Math.max(3, row.requests / max * 100)}%"></span></div></div>`).join("");
  }

  const environmentTarget = document.getElementById("environment-breakdown");
  const environmentRows = (data.environmentBreakdown || []).map((row) => ({
    ...row,
    visitors: metricValue(row.visitors),
  }));
  if (!environmentRows.length) environmentTarget.innerHTML = '<p class="breakdown-empty">Environment enrichment begins with the next page view. Existing events remain valid but unclassified.</p>';
  else {
    const max = Math.max(1, ...environmentRows.map((row) => row.visitors));
    environmentTarget.innerHTML = environmentRows.map((row) => `<div class="breakdown-row"><div class="breakdown-label"><strong>${escapeHtml(row.os)} · ${escapeHtml(row.browser)}</strong><span>${escapeHtml(row.device)} · normalized, not raw user-agent</span></div><strong class="breakdown-value">${row.visitors}</strong><div class="breakdown-track"><span style="width:${Math.max(3, row.visitors / max * 100)}%"></span></div></div>`).join("");
  }
}

function render(data) {
  data = normalizeDashboard(data);
  latestData = data;
  const average = data.totals.sessions ? data.totals.engagedMs / data.totals.sessions : 0;
  const installerClicks = data.totals.downloads + data.totals.downloadClicks;
  const installerClickDetail = data.totals.downloadClicks
    ? `${compactNumber.format(data.totals.downloadClicks)} new intent signals${data.totals.downloads ? ` · ${compactNumber.format(data.totals.downloads)} legacy` : ""}`
    : data.totals.downloads
      ? `${compactNumber.format(data.totals.downloads)} legacy signals`
      : "Awaiting the next installer click";
  const pageOpenDetail = data.totals.downloadPageOpens
    ? "Direct page-load signal"
    : "Page-load tracking is enabled for new visits";
  const appInstallationDetail = data.totals.appLaunches
    ? `${compactNumber.format(data.totals.appLaunches)} launches · ${duration(average)} avg attention`
    : "Desktop launch signal is not connected";
  const metrics = [
    ["Unique visitors", compactNumber.format(data.totals.uniqueVisitors), `${compactNumber.format(data.totals.sessions)} sessions`, "users"],
    ["Page views", compactNumber.format(data.totals.pageViews), "All tracked pages", "eye"],
    ["Installer clicks", compactNumber.format(installerClicks), installerClickDetail, "download"],
    ["Confirmed requests", compactNumber.format(data.totals.downloadRequests), "Router returned an installer", "pointer"],
    ["Download page opens", compactNumber.format(data.totals.downloadPageOpens), pageOpenDetail, "clock"],
    ["App installations", compactNumber.format(data.totals.appUsers), `${compactNumber.format(data.totals.appLaunches)} launches · ${duration(average)} avg attention`, "laptop"],
  ];
  metrics[5][2] = appInstallationDetail;
  document.getElementById("metric-grid").innerHTML = metrics.map(([label, value, detail, icon]) => `<article class="metric-card"><div class="metric-icon icon-${icon}"></div><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`).join("");
  renderChart(data);
  renderFunnel(data);
  renderBreakdowns(data);

  const labels = {
    page_view: "Page viewed",
    download: "Legacy download signal",
    download_page_open: "Download page opened",
    download_click: "Installer intent recorded",
    download_request: "Installer request confirmed",
    download_error: "Download request failed",
    demo_interaction: "Demo explored",
    desktop_render_interaction: "Demo interaction",
    app_launch: "Sparky launched",
  };
  document.getElementById("activity-list").innerHTML = data.recent.length ? data.recent.map((event) => {
    const detail = event.kind === "download_request"
      ? `${platformLabel(event.platform || "unknown")} · ${event.file || "file unknown"} · ${event.release || "release unknown"}`
      : event.kind === "download_error"
        ? `${event.outcome || "request failed"} · ${platformLabel(event.platform || "unknown")}`
        : event.kind === "page_view"
          ? `${event.path || "page"} · ${event.os || "environment pending"}`
          : event.label || event.path || "No additional detail";
    return `<div class="activity"><span class="activity-icon kind-${escapeHtml(event.kind)}"></span><div><b>${labels[event.kind] || "Activity"}</b><small>${escapeHtml(detail)}</small></div><time>${new Date(event.at).toLocaleDateString("en", { month: "short", day: "numeric" })} ${new Date(event.at).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}</time></div>`;
  }).join("") : '<div class="empty-activity">No events yet. The stream is connected and waiting.</div>';
}

async function convexCall(type, path, args = {}) {
  if (!convexToken) throw new Error("The Convex admin session is not ready.");
  const response = await fetch(`${convexUrl}/api/${type}`, {
    method: "POST",
    headers: { authorization: `Bearer ${convexToken}`, "content-type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.status === "error") {
    throw new Error(result?.errorMessage || `Convex request failed (HTTP ${response.status}).`);
  }
  return result?.value;
}

async function loadDashboard() {
  const refresh = async () => {
    render(await convexCall("query", "analytics:dashboard"));
  };
  await refresh();
  setInterval(() => void refresh().catch(() => {}), 15_000);
}

function pluginRow(plugin, actionLabel, action) {
  const initials = plugin.name.slice(0, 1).toUpperCase();
  const auth = plugin.managedAuthSchemes?.length ? "Managed auth" : "Provider credentials";
  return `<div class="plugin-admin-row"><span class="plugin-admin-icon" aria-hidden="true">${escapeHtml(initials)}</span><div class="plugin-admin-copy"><strong>${escapeHtml(plugin.name)}</strong><span>${escapeHtml(plugin.description)}</span><div class="plugin-admin-meta"><em>${escapeHtml(plugin.category)}</em><em>${escapeHtml(auth)}</em><em>${metricValue(plugin.toolsCount)} tools</em></div></div><button class="text-button" type="button" data-plugin-action="${escapeHtml(action)}" data-plugin-slug="${escapeHtml(plugin.slug)}">${escapeHtml(actionLabel)}</button></div>`;
}

function renderPluginCatalog() {
  const availableTarget = document.getElementById("plugin-available-list");
  const enabledTarget = document.getElementById("plugin-enabled-list");
  if (!availableTarget || !enabledTarget) return;
  const query = pluginSearchQuery.trim().toLowerCase();
  const available = pluginCatalogData.available.filter((plugin) => [plugin.name, plugin.slug, plugin.description, plugin.category, ...(plugin.tags || [])].join(" ").toLowerCase().includes(query));
  availableTarget.innerHTML = available.length ? available.map((plugin) => pluginRow(plugin, "Add", "add")).join("") : '<div class="empty-activity">No matching toolkits are waiting to be added.</div>';
  enabledTarget.innerHTML = pluginCatalogData.enabled.length ? pluginCatalogData.enabled.map((plugin) => pluginRow(plugin, "Remove", "remove")).join("") : '<div class="empty-activity">No plugins published yet.</div>';
  document.querySelectorAll("[data-plugin-action]").forEach((button) => {
    button.addEventListener("click", () => void updatePlugin(button.dataset.pluginAction, button.dataset.pluginSlug).catch((error) => {
      const status = document.getElementById("plugin-sync-status");
      if (status) status.textContent = error instanceof Error ? error.message : "Unable to update plugin.";
    }));
  });
  const status = document.getElementById("plugin-sync-status");
  if (status) status.textContent = pluginCatalogData.syncedAt ? `Synced ${new Date(pluginCatalogData.syncedAt).toLocaleString()}` : "Catalog has not been synced yet.";
}

async function loadPluginCatalog() {
  pluginCatalogData = await convexCall("query", "pluginCatalog:listAdmin");
  renderPluginCatalog();
}

async function syncPluginCatalog() {
  const button = document.getElementById("sync-plugins");
  if (button) button.disabled = true;
  try {
    const result = await convexCall("action", "pluginCatalog:syncComposioToolkits");
    await loadPluginCatalog();
    const status = document.getElementById("plugin-sync-status");
    if (status) status.textContent = `Synced ${compactNumber.format(result.count)} toolkits · ${compactNumber.format(result.enabledCount)} published`;
  } finally {
    if (button) button.disabled = false;
  }
}

async function updatePlugin(action, slug) {
  if (!slug || (action !== "add" && action !== "remove")) return;
  const button = document.querySelector(`[data-plugin-action="${CSS.escape(action)}"][data-plugin-slug="${CSS.escape(slug)}"]`);
  if (button) button.disabled = true;
  try {
    await convexCall("mutation", `pluginCatalog:${action}`, { slug });
    await loadPluginCatalog();
  } finally {
    if (button) button.disabled = false;
  }
}

function setupPluginWorkspace() {
  document.getElementById("sync-plugins")?.addEventListener("click", () => void syncPluginCatalog().catch((error) => {
    const status = document.getElementById("plugin-sync-status");
    if (status) status.textContent = error instanceof Error ? error.message : "Plugin sync failed.";
  }));
  document.getElementById("plugin-search")?.addEventListener("input", (event) => {
    pluginSearchQuery = event.currentTarget.value;
    renderPluginCatalog();
  });
  void loadPluginCatalog().catch((error) => {
    const status = document.getElementById("plugin-sync-status");
    if (status) status.textContent = error instanceof Error ? error.message : "Unable to load plugin catalog.";
  });
}

function setReleaseError(message = "") {
  const element = document.getElementById("release-error");
  element.textContent = message;
  element.hidden = !message;
}

function setReleaseProgress(percent, message) {
  const progress = document.getElementById("release-progress");
  progress.hidden = false;
  progress.querySelector("span").style.width = `${Math.max(0, Math.min(100, percent))}%`;
  progress.querySelector("p").textContent = message;
}

function setReleaseBusy(busy) {
  releaseBusy = busy;
  document.getElementById("upload-release").disabled = busy;
  document.getElementById("refresh-releases").disabled = busy;
}

function uploadFileToAws(uploadUrl, file, completedBytes, totalBytes) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", uploadUrl);
    request.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const uploaded = completedBytes + event.loaded;
        setReleaseProgress((uploaded / totalBytes) * 96, `Uploading ${file.name} to AWS...`);
      }
    });
    request.addEventListener("load", () => {
      if (request.status < 200 || request.status >= 300) {
        const xml = request.responseXML;
        const awsCode = xml?.querySelector("Code")?.textContent?.trim();
        const requestId = xml?.querySelector("RequestId")?.textContent?.trim();
        const detail = [awsCode, requestId && `request ${requestId}`].filter(Boolean).join(", ");
        reject(new Error(`AWS rejected ${file.name} (HTTP ${request.status}${detail ? `: ${detail}` : ""}).`));
        return;
      }
      resolve();
    });
    request.addEventListener("error", () => reject(new Error(`The AWS upload connection failed for ${file.name}.`)));
    request.send(file);
  });
}

async function sha256File(file) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function platformFiles() {
  return [
    ["windows-x64", [...document.getElementById("release-files-windows").files]],
    ["macos-arm64", [...document.getElementById("release-files-mac-arm64").files]],
    ["macos-x64", [...document.getElementById("release-files-mac-x64").files]],
    ["linux-x64", [...document.getElementById("release-files-linux").files]],
  ].flatMap(([platform, files]) => files.map((file) => ({ platform, file })));
}

function validateReleaseForm() {
  const tag = document.getElementById("release-tag").value.trim();
  const name = document.getElementById("release-name").value.trim() || `Sparky ${tag}`;
  const channel = document.getElementById("release-channel").value;
  const changelog = document.getElementById("release-changelog").value.trim();
  const files = platformFiles();

  if (!/^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u.test(tag)) {
    throw new Error("Use a valid version tag, for example v0.0.30 or v0.0.30-beta.1.");
  }
  if (!changelog) throw new Error("Add at least one changelog entry.");
  const namesFor = (platform) => new Set(files.filter((entry) => entry.platform === platform).map((entry) => entry.file.name));
  const windows = namesFor("windows-x64");
  const arm64 = namesFor("macos-arm64");
  const macX64 = namesFor("macos-x64");
  if (![...windows].some((name) => name.endsWith(".exe")) || !windows.has("latest.yml")) {
    throw new Error("Windows x64 needs its .exe installer and latest.yml.");
  }
  for (const [label, names] of [["Mac Apple Silicon", arm64], ["Mac Intel", macX64]]) {
    if (![...names].some((name) => name.endsWith(".dmg")) || !names.has("latest-mac.yml")) {
      throw new Error(`${label} needs its .dmg installer and latest-mac.yml.`);
    }
  }
  const linux = namesFor("linux-x64");
  if (![...linux].some((name) => name.endsWith(".AppImage")) || !linux.has("Sparky-x64.AppImage.asc")) {
    throw new Error("Linux x64 needs its .AppImage installer and detached signature.");
  }

  return {
    tag: tag.startsWith("v") ? tag : `v${tag}`,
    name,
    channel,
    changelog,
    files,
  };
}

async function createDraftAndUpload() {
  if (releaseBusy) return;
  setReleaseError();
  try {
    const form = validateReleaseForm();
    const platformSummary = "Windows x64, Mac Apple Silicon, Mac Intel, and Linux x64";
    if (!window.confirm(`Publish ${form.tag} to ${platformSummary}? Every current installer and update feed will switch after AWS verifies the uploads.`)) return;
    setReleaseBusy(true);
    const totalBytes = form.files.reduce((total, entry) => total + entry.file.size, 0);
    let hashedBytes = 0;
    const preparedFiles = [];
    for (const entry of form.files) {
      setReleaseProgress((hashedBytes / totalBytes) * 4, `Checking ${entry.file.name}...`);
      preparedFiles.push({ ...entry, sha256: await sha256File(entry.file) });
      hashedBytes += entry.file.size;
    }
    setReleaseProgress(4, "Creating release draft...");
    const release = await convexCall("mutation", "releases:createDraft", {
      tag: form.tag,
      name: form.name,
      changelog: form.changelog,
      channel: form.channel,
      files: preparedFiles.map(({ platform, file, sha256 }) => ({
        name: file.name,
        size: file.size,
        contentType: file.type || "application/octet-stream",
        platform,
        sha256,
      })),
    });

    let completedBytes = 0;
    for (const { platform, file } of preparedFiles) {
      const signed = await convexCall("action", "awsReleases:createUploadUrl", {
        id: release.id,
        name: file.name,
        platform,
      });
      if (signed.alreadyUploaded) {
        completedBytes += file.size;
        setReleaseProgress((completedBytes / totalBytes) * 96, `Verified existing AWS object for ${file.name}.`);
        continue;
      }
      if (!signed.uploadUrl) throw new Error(`AWS did not return an upload URL for ${file.name}.`);
      await uploadFileToAws(signed.uploadUrl, file, completedBytes, totalBytes);
      completedBytes += file.size;
    }
    setReleaseProgress(97, "Verifying AWS objects and switching release feeds...");
    const published = await convexCall("action", "awsReleases:publish", { id: release.id });
    setReleaseProgress(100, `${published.version} is live for all four desktop platforms.`);
    await Promise.all([loadReleases(), loadPublishedRelease()]);
  } catch (error) {
    setReleaseError(error instanceof Error ? error.message : "Unable to publish the release update.");
  } finally {
    setReleaseBusy(false);
  }
}

async function publishRelease(release) {
  if (!release || releaseBusy) return;
  const channelLabel = release.channel === "beta" ? "Beta" : "Release";
  if (!window.confirm(`Retry publishing ${release.tag} as ${channelLabel}? AWS must already contain every file in this draft.`)) return;

  setReleaseError();
  setReleaseBusy(true);
  try {
    await convexCall("action", "awsReleases:publish", { id: release.id });
    setReleaseProgress(100, release.channel === "beta"
      ? "Beta published. The stable website download was not changed."
      : "Release published. The website and update feed now point to this build.");
    await Promise.all([loadReleases(), loadPublishedRelease()]);
  } catch (error) {
    setReleaseError(error instanceof Error ? error.message : "Unable to publish the release.");
  } finally {
    setReleaseBusy(false);
  }
}

async function saveChangelog(id, textarea, button) {
  button.disabled = true;
  try {
    await convexCall("mutation", "releases:updateChangelog", { id, changelog: textarea.value.trim() });
    button.textContent = "Saved";
    setTimeout(() => { button.textContent = "Save changelog"; }, 1_500);
  } catch (error) {
    setReleaseError(error instanceof Error ? error.message : "Unable to save the changelog.");
  } finally {
    button.disabled = false;
  }
}

function makeReleaseCard(release) {
  const card = document.createElement("article");
  card.className = "release-item";

  const heading = document.createElement("div");
  heading.className = "release-item-heading";
  const title = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = release.name || release.version;
  const meta = document.createElement("small");
  meta.textContent = `${release.version} · ${release.status === "draft" ? "Draft" : release.channel === "beta" ? "Beta" : "Release"} · ${release.files?.length || 0} files`;
  title.append(name, meta);
  const badge = document.createElement("span");
  badge.className = `release-status ${release.status === "draft" ? "draft" : release.channel === "beta" ? "beta" : "published"}`;
  badge.textContent = release.status === "draft" ? "Draft" : release.channel === "beta" ? "Beta" : "Published";
  heading.append(title, badge);

  const textarea = document.createElement("textarea");
  textarea.rows = 5;
  textarea.value = release.changelog || "";
  textarea.setAttribute("aria-label", `Changelog for ${release.version}`);

  const actions = document.createElement("div");
  actions.className = "release-item-actions";
  const save = document.createElement("button");
  save.type = "button";
  save.className = "text-button";
  save.textContent = "Save changelog";
  save.addEventListener("click", () => void saveChangelog(release.id, textarea, save));
  actions.append(save);

  if (release.status === "draft") {
    const publish = document.createElement("button");
    publish.type = "button";
    publish.className = "text-button publish";
    publish.textContent = "Verify uploaded files";
    publish.addEventListener("click", () => void publishRelease({
      id: release.id,
      tag: release.version,
      channel: release.channel,
    }));
    actions.append(publish);
  }

  card.append(heading, textarea, actions);
  return card;
}

async function loadReleases() {
  const list = document.getElementById("release-list");
  list.innerHTML = '<div class="empty-activity">Loading releases...</div>';
  try {
    const releases = await convexCall("query", "releases:listAdmin");
    list.replaceChildren(...releases.map(makeReleaseCard));
    if (!releases.length) list.innerHTML = '<div class="empty-activity">No releases yet.</div>';
  } catch (error) {
    list.innerHTML = `<div class="form-message error">${escapeHtml(error instanceof Error ? error.message : "Unable to load releases.")}</div>`;
  }
}

async function loadPublishedRelease() {
  const target = document.getElementById("published-release");
  try {
    const response = await fetch("/get/manifest", { cache: "no-store" });
    if (!response.ok) throw new Error("No stable release");
    const release = await response.json();
    target.innerHTML = `<span>Website download</span><strong>${escapeHtml(release.version)}</strong><small>Published ${release.publishedAt ? new Date(release.publishedAt).toLocaleString() : "manually"}</small>`;
  } catch {
    target.innerHTML = "<span>Website download</span><strong>Not published</strong><small>Publish a Release to activate it.</small>";
  }
}

function setupReleaseWorkspace() {
  const activateWorkspace = (workspaceId) => {
    document.querySelectorAll("[data-workspace]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.workspace === workspaceId);
    });
    document.querySelectorAll(".workspace-view").forEach((workspace) => {
      workspace.hidden = workspace.id !== workspaceId;
    });
    document.getElementById("workspace-title").textContent = workspaceId === "releases-workspace" ? "Releases" : workspaceId === "plugins-workspace" ? "Plugins" : "Overview";
    if (workspaceId === "releases-workspace") void Promise.all([loadPublishedRelease(), loadReleases()]);
    if (workspaceId === "plugins-workspace") void loadPluginCatalog();
  };
  document.querySelectorAll("[data-workspace]").forEach((button) => {
    button.addEventListener("click", () => activateWorkspace(button.dataset.workspace));
  });
  document.querySelector("[data-open-releases]").addEventListener("click", () => activateWorkspace("releases-workspace"));
  document.getElementById("analytics-update-button").addEventListener("click", () => activateWorkspace("releases-workspace"));
  document.getElementById("upload-release").addEventListener("click", () => void createDraftAndUpload());
  document.getElementById("refresh-releases").addEventListener("click", () => void loadReleases());
  document.querySelectorAll("[data-chart-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      chartMode = button.dataset.chartMode || "traffic";
      document.querySelectorAll("[data-chart-mode]").forEach((control) => control.classList.toggle("active", control === button));
      if (latestData) renderChart(latestData);
    });
  });
}

function loadClerk() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.clerkPublishableKey = key;
    script.src = "https://relevant-gnu-81.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error("Unable to load Clerk authentication.")), { once: true });
    document.head.append(script);
  });
}

function loadClerkUi() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://relevant-gnu-81.clerk.accounts.dev/npm/@clerk/ui@1/dist/ui.browser.js";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error("Unable to load the Clerk login interface.")), { once: true });
    document.head.append(script);
  });
}

async function start() {
  if (!key || !convexUrl) throw new Error("The Clerk publishable key or Convex URL is missing from the site build.");
  await Promise.all([loadClerk(), loadClerkUi()]);
  const clerk = window.Clerk;
  await clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
  if (!clerk.user) {
    show("auth-view");
    clerk.mountSignIn(document.getElementById("sign-in"), { forceRedirectUrl: `${location.origin}/admin.html` });
    return;
  }
  const email = clerk.user.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (email !== ADMIN_EMAIL) {
    show("blocked-view");
    document.querySelector("[data-sign-out]").addEventListener("click", () => clerk.signOut({ redirectUrl: "/admin.html" }));
    return;
  }
  show("dashboard");
  document.getElementById("account-email").textContent = email;
  clerk.mountUserButton(document.getElementById("user-button"), { afterSignOutUrl: "/admin.html" });
  convexToken = await clerk.session.getToken({ template: "convex", skipCache: true });
  if (!convexToken) throw new Error("Clerk did not return the Convex session token.");
  setupReleaseWorkspace();
  setupPluginWorkspace();
  await Promise.all([loadDashboard(), loadPublishedRelease()]);
}

start().catch((error) => {
  show("error-view");
  document.getElementById("error-message").textContent = error instanceof Error ? error.message : "Unable to load admin.";
});
