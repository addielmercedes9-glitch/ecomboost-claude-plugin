#!/usr/bin/env node
// Scores the public side of a Shopify store. Uses no account and no API key.
// Usage: roast.mjs <domain> [--json]
//        roast.mjs --products p.json [--home h.html] [--robots r.txt] [--json]
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const CATEGORY_NAMES = { content: "Product copy", catalog: "Catalog", seo: "Search", ai: "AI shopping agents" };
const SUPPLIER_MARKERS = [
  /aliexpress|alibaba|dropship|alicdn\.com/i,
  /packing list\s*:/i,
  /product information\s*:/i,
  /100%\s*(brand\s*)?new/i,
  /package\s+(includes?|contents?)\s*:?/i,
  /due to (the )?(different|manual|light)/i,
  /please allow .{0,30}(error|difference|deviation)/i,
  /\b\d+\s*[x*]\s+[a-z]+.{0,40}\bnote\s*:/i,
];
const AI_BOTS = ["gptbot", "oai-searchbot", "chatgpt-user", "claudebot", "perplexitybot", "google-extended"];

const stripHtml = (html) =>
  String(html ?? "").replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const share = (items, test) => (items.length ? items.filter(test).length / items.length : 0);
const pct = (n) => `${Math.round(n * 100)}%`;

export function blockedAiBots(robots) {
  if (!robots) return [];
  const blocked = new Set();
  let agents = [];
  let inRules = false;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (key === "user-agent") {
      if (inRules) { agents = []; inRules = false; }
      agents.push(value.toLowerCase());
    } else {
      inRules = true;
      if (key === "disallow" && value === "/") {
        for (const agent of agents) if (AI_BOTS.includes(agent)) blocked.add(agent);
      }
    }
  }
  return [...blocked];
}

export function analyze({ products, home = null, robots = null }) {
  const items = (products ?? []).map((p) => ({
    title: String(p.title ?? ""),
    text: stripHtml(p.body_html),
    raw: String(p.body_html ?? ""),
    images: (p.images ?? []).length,
    type: String(p.product_type ?? "").trim(),
    tags: Array.isArray(p.tags) ? p.tags : String(p.tags ?? "").split(",").filter((t) => t.trim()),
    available: (p.variants ?? []).some((v) => v.available !== false),
    fakeDiscount: (p.variants ?? []).some((v) => Number(v.compare_at_price) >= 3 * Number(v.price) && Number(v.price) > 0),
  }));
  // Color versions sold as separate products ("Runner - Blue") may share copy.
  const baseTitle = (title) => title.split(/\s[-–|(]\s?/)[0].replace(/^(men's|women's|kids')\s+/i, "").trim().toLowerCase();
  const owners = new Map();
  for (const item of items) {
    if (item.text.length < 40) continue;
    if (!owners.has(item.text)) owners.set(item.text, new Set());
    owners.get(item.text).add(baseTitle(item.title));
  }

  const bad = (id, category, weight, ratio, label, roast) => ({ id, category, weight, score: 1 - ratio, issue: ratio > 0, label, roast });
  const checks = [];
  if (items.length) {
    const thin = share(items, (i) => i.text.length < 80);
    const supplier = share(items, (i) => SUPPLIER_MARKERS.some((m) => m.test(i.raw)));
    const dupes = share(items, (i) => (owners.get(i.text)?.size ?? 0) > 1);
    const oneImage = share(items, (i) => i.images < 2);
    const sample = share(items, (i) => /^(example|sample|test)\b/i.test(i.title));
    const soldOut = share(items, (i) => !i.available);
    const fake = share(items, (i) => i.fakeDiscount);
    const noType = share(items, (i) => !i.type);
    const noTags = share(items, (i) => !i.tags.length);
    checks.push(
      bad("thin", "content", 15, thin, `${pct(thin)} of products have almost no description`, "Your descriptions are shorter than this sentence."),
      bad("supplier", "content", 12, supplier, `${pct(supplier)} of products read like supplier copy`, "Your supplier wrote this copy, and it shows."),
      bad("dupes", "content", 3, dupes, `${pct(dupes)} of products share a description`, "Your products are twins. Copy-paste twins."),
      bad("oneImage", "catalog", 8, oneImage, `${pct(oneImage)} of products have fewer than 2 photos`, "One photo per product. Very mysterious."),
      bad("sample", "catalog", 6, Math.min(sample * 10, 1), `${pct(sample)} of products look like test items`, "Your test products are still open for business."),
      bad("soldOut", "catalog", 6, soldOut, `${pct(soldOut)} of products are sold out`, "A museum of things nobody can buy."),
      bad("fake", "catalog", 5, fake, `${pct(fake)} of products claim a discount of 67% or more`, "Everything is 70% off, forever. Nobody believes it."),
      bad("noType", "ai", 8, noType, `${pct(noType)} of products have no product type`, "AI shoppers can't tell what you sell."),
      bad("noTags", "ai", 5, noTags, `${pct(noTags)} of products have no tags`, "No tags, no clues, no chance."),
    );
  }
  if (home) {
    const title = home.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
    const has = (re) => re.test(home);
    const okTitle = title.length >= 10 && title.length <= 70;
    const miss = (v) => (v ? 0 : 1);
    checks.push(
      bad("title", "seo", 6, miss(okTitle), title ? `Homepage title is ${title.length} characters long` : "Homepage has no title", "Your homepage title needs a rewrite."),
      bad("meta", "seo", 7, miss(has(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}/i) || has(/<meta[^>]+content=["'][^"']{20,}["'][^>]+name=["']description["']/i)), "Homepage has no useful meta description", "Google has to guess what you sell."),
      bad("og", "seo", 3, miss(has(/property=["']og:image["']/i)), "Homepage has no share image", "Your links look naked when shared."),
      bad("h1", "seo", 4, miss(has(/<h1[\s>]/i)), "Homepage has no main heading", "Your homepage forgot to say hello."),
      bad("jsonld", "ai", 5, miss(has(/application\/ld\+json/i)), "Homepage has no structured data", "To a machine, your store is a blur."),
    );
  }
  if (robots !== null) {
    const blocked = blockedAiBots(robots);
    checks.push(bad("bots", "ai", 7, Math.min(blocked.length / 3, 1), `robots.txt blocks ${blocked.length} AI crawler(s)${blocked.length ? `: ${blocked.join(", ")}` : ""}`, "You locked the door on AI shoppers."));
  }
  if (!checks.length) throw new Error("No public store data to score.");

  const weight = checks.reduce((s, c) => s + c.weight, 0);
  const score = Math.round((checks.reduce((s, c) => s + c.weight * c.score, 0) / weight) * 100);
  const categories = {};
  for (const key of Object.keys(CATEGORY_NAMES)) {
    const group = checks.filter((c) => c.category === key);
    if (!group.length) continue;
    const w = group.reduce((s, c) => s + c.weight, 0);
    categories[key] = { name: CATEGORY_NAMES[key], score: Math.round((group.reduce((s, c) => s + c.weight * c.score, 0) / w) * 100) };
  }
  const issues = checks
    .filter((c) => c.issue)
    .map((c) => ({ id: c.id, category: c.category, lost: Math.round(((c.weight * (1 - c.score)) / weight) * 1000) / 10, finding: c.label, roast: c.roast }))
    .sort((a, b) => b.lost - a.lost);
  return {
    score,
    categories,
    issues,
    productsChecked: items.length,
    partial: { products: items.length === 0, home: !home, robots: robots === null },
    checksRun: checks.length,
  };
}

function normalizeDomain(input) {
  const host = String(input).trim().replace(/^https?:\/\//i, "").split(/[/?#]/)[0].toLowerCase();
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) throw new Error(`Not a store domain: ${input}`);
  return host;
}
async function get(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; StoreRoast/1.0)" }, signal: AbortSignal.timeout(15000) });
    return res.ok ? await res.text() : null;
  } catch { return null; }
}
function render(domain, r) {
  const lines = [`\n${domain}: ${r.score}/100`, ""];
  for (const c of Object.values(r.categories)) lines.push(`  ${c.name}: ${c.score}/100`);
  lines.push("");
  for (const i of r.issues.slice(0, 3)) lines.push(`  - ${i.roast}\n    ${i.finding}`);
  if (!r.issues.length) lines.push("  Nothing to roast. Annoying.");
  lines.push("", `Based on ${r.productsChecked} public products. Fix it in one click: https://www.ecomboostai.com/signup?utm_source=store_roast`, "");
  return lines.join("\n");
}
async function main(argv) {
  const json = argv.includes("--json");
  const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const file = (n) => { const p = opt(n); return p ? readFileSync(p, "utf8") : null; };
  let domain = "store", products, home, robots;
  if (opt("--products")) {
    products = JSON.parse(file("--products")).products; home = file("--home"); robots = file("--robots");
  } else {
    const target = argv.find((a) => !a.startsWith("--"));
    if (!target) throw new Error("Usage: roast.mjs <domain> [--json]");
    domain = normalizeDomain(target);
    const raw = await get(`https://${domain}/products.json?limit=250`);
    if (!raw) throw new Error(`Couldn't read the public catalog of ${domain}. It may not be a Shopify store, or it may block this request.`);
    products = JSON.parse(raw).products;
    [home, robots] = await Promise.all([get(`https://${domain}/`), get(`https://${domain}/robots.txt`)]);
  }
  const result = analyze({ products, home, robots });
  console.log(json ? JSON.stringify({ domain, ...result }, null, 2) : render(domain, result));
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exit(1); });
}
