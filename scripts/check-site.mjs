import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredPages = ["index.html", "status.html", "explorer.html", "404.html"];
const errors = [];
let checkedLinks = 0;

function fail(message) {
  errors.push(message);
}

for (const page of requiredPages) {
  const absolute = join(root, page);
  if (!existsSync(absolute)) {
    fail(`Missing required page: ${page}`);
    continue;
  }

  const html = readFileSync(absolute, "utf8");
  for (const [label, pattern] of [
    ["HTML doctype", /^<!doctype html>/i],
    ["language attribute", /<html\b[^>]*\blang=["'][^"']+["']/i],
    ["title", /<title>[^<]+<\/title>/i],
    ["viewport metadata", /<meta\b[^>]*name=["']viewport["']/i],
    ["description metadata", /<meta\b[^>]*name=["']description["']/i],
    ["main heading", /<h1\b[^>]*>.+?<\/h1>/is],
  ]) {
    if (!pattern.test(html)) fail(`${page}: missing ${label}`);
  }

  const ids = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) fail(`${page}: duplicate id "${match[1]}"`);
    ids.add(match[1]);
  }

  const tags = /<(?:a|link|script|img|source)\b([^>]*)>/gi;
  for (const tag of html.matchAll(tags)) {
    const attrs = tag[1];
    const attr = /\b(?:href|src)=["']([^"']+)["']/i.exec(attrs);
    if (!attr) continue;

    const target = attr[1].trim();
    if (!target || target.startsWith("data:") || target.startsWith("mailto:") ||
        target.startsWith("tel:") || target.startsWith("javascript:") ||
        target.startsWith("//") || /^https?:/i.test(target)) continue;

    const [rawPath, rawFragment] = target.split("#", 2);
    const pathPart = (rawPath || "").split("?", 1)[0];
    if (!pathPart) {
      if (rawFragment && !ids.has(decodeURIComponent(rawFragment))) {
        fail(`${page}: missing anchor #${rawFragment}`);
      }
      continue;
    }

    let decoded;
    try {
      decoded = decodeURIComponent(pathPart);
    } catch {
      fail(`${page}: malformed local URL "${target}"`);
      continue;
    }

    const resolved = normalize(resolve(root, dirname(join(root, page)), decoded));
    if (resolved !== root && !resolved.startsWith(root + "/")) {
      fail(`${page}: local URL escapes site root: "${target}"`);
      continue;
    }
    if (!existsSync(resolved)) {
      fail(`${page}: broken local link or asset "${target}"`);
      continue;
    }
    if (rawFragment) {
      const destination = statSync(resolved).isDirectory()
        ? join(resolved, "index.html")
        : resolved;
      if (existsSync(destination) && destination.endsWith(".html")) {
        const destinationHtml = readFileSync(destination, "utf8");
        const destinationIds = new Set(
          [...destinationHtml.matchAll(/\bid=["']([^"']+)["']/gi)].map((item) => item[1]),
        );
        if (!destinationIds.has(decodeURIComponent(rawFragment))) {
          fail(`${page}: missing anchor "${target}"`);
        }
      }
    }
    checkedLinks += 1;
  }
}

for (const file of ["robots.txt", "sitemap.xml"]) {
  if (!existsSync(join(root, file))) fail(`Missing SEO file: ${file}`);
}

if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  console.error(`Website validation failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log(`Website validation passed: ${requiredPages.length} pages and ${checkedLinks} local links/assets checked.`);
}
