import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [licenseJsonPath] = process.argv.slice(2);
if (!licenseJsonPath) {
  throw new Error("Usage: node scripts/generate-third-party-notices.mjs <pnpm-licenses-json|->");
}

const websiteRoot = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(websiteRoot, "..");
let raw = licenseJsonPath === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(licenseJsonPath, "utf8");
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
const grouped = JSON.parse(raw);

function normalizeLicense(value, packageName = "") {
  if (!value) return "Unknown";
  if (/^see license in /iu.test(value)) return `Vendor terms (${value})`;
  if (value === "Unknown" && /^@anthropic-ai\/claude-agent-sdk(?:-|$)/u.test(packageName)) {
    return "Vendor terms (see LICENSE.md)";
  }
  return value;
}

const entries = Object.entries(grouped)
  .flatMap(([license, packages]) =>
    packages.map((pkg) => ({
      name: pkg.name,
      versions: pkg.versions,
      license: normalizeLicense(pkg.license || license, pkg.name),
      author: pkg.author || null,
      homepage: pkg.homepage || null,
    })),
  )
  .sort((left, right) => left.name.localeCompare(right.name) || left.license.localeCompare(right.license));

fs.mkdirSync(path.join(websiteRoot, "public"), { recursive: true });
fs.writeFileSync(
  path.join(websiteRoot, "public", "third-party-licenses.json"),
  `${JSON.stringify({
    generatedFrom: "Sparky desktop/server production dependency graph",
    packageCount: entries.length,
    entries,
  }, null, 2)}\n`,
);

const notices = [
  "Sparky third-party notices",
  "",
  "This inventory was generated from the production dependency graph used by Sparky's desktop and server bundles.",
  "",
  "Sparky is derived from T3 Code. The upstream MIT notice is included below.",
  "",
  fs.readFileSync(path.join(workspaceRoot, "sparky-desktop", "source", "LICENSE"), "utf8").trim(),
  "",
];
const seen = new Set();

for (const packages of Object.values(grouped)) {
  for (const pkg of packages) {
    const key = `${pkg.name}@${pkg.versions.join(",")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    notices.push("=".repeat(80), `${pkg.name} ${pkg.versions.join(", ")} — ${normalizeLicense(pkg.license || "Unknown", pkg.name)}`);
    if (pkg.homepage) notices.push(`Upstream: ${pkg.homepage}`);

    let includedLicense = false;
    for (const root of [...new Set(pkg.paths || [])]) {
      let names = [];
      try {
        names = fs.readdirSync(root);
      } catch {
        continue;
      }
      for (const name of names.filter((candidate) => /^(?:license|licence|copying|notice)(?:[._-].*)?$/iu.test(candidate))) {
        const filePath = path.join(root, name);
        let stat;
        try {
          stat = fs.statSync(filePath);
        } catch {
          continue;
        }
        if (!stat.isFile()) continue;
        let text;
        try {
          text = fs.readFileSync(filePath, "utf8").trim();
        } catch {
          continue;
        }
        if (!text || text.length > 250_000) continue;
        notices.push(`\n--- ${name} ---\n${text}`);
        includedLicense = true;
      }
    }
    if (!includedLicense) notices.push("License text was not present as a package-root file; consult the upstream link above.");
    notices.push("");
  }
}

fs.writeFileSync(
  path.join(websiteRoot, "public", "third-party-notices.txt"),
  `${notices.join("\n").replace(/\n{3,}/gu, "\n\n")}\n`,
);
console.log(JSON.stringify({ packageCount: entries.length, noticesBytes: Buffer.byteLength(notices.join("\n"), "utf8") }));
