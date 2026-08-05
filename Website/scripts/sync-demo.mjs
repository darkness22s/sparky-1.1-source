import { cp, mkdir, rename, rm, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(websiteRoot, "../t3code-main/t3code-main/apps/web/dist-demo");
const publicRoot = resolve(websiteRoot, "public");
const target = resolve(publicRoot, "demo");
const targetRelative = relative(publicRoot, target);

if (!targetRelative || targetRelative.startsWith("..") || resolve(publicRoot, targetRelative) !== target) {
  throw new Error(`Refusing to replace unexpected demo target: ${target}`);
}

await stat(resolve(source, "demo.html"));
await mkdir(publicRoot, { recursive: true });
await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });
await rename(resolve(target, "demo.html"), resolve(target, "index.html"));

console.log(`Synced Sparky demo renderer to ${target}`);
