// Shared helpers for the catalogue importer: polite fetching that honours robots.txt.
import fs from 'node:fs';
import path from 'node:path';

export const UA = 'Mozilla/5.0 (compatible; EbikeTekoopCatalogBot/1.0; +https://e-bike-tekoop.nl)';
export const DELAY_MS = 700; // per-host politeness delay

const robotsCache = new Map();
const lastHit = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Parse robots.txt into allow/disallow rules for `*` (and our own UA, which wins if present). */
function parseRobots(text) {
  const groups = [];
  let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line);
    if (!m) continue;
    const k = m[1].toLowerCase();
    const v = m[2].trim();
    if (k === 'user-agent') {
      if (!cur || cur.rules.length) {
        cur = { agents: [], rules: [] };
        groups.push(cur);
      }
      cur.agents.push(v.toLowerCase());
    } else if ((k === 'allow' || k === 'disallow') && cur) {
      cur.rules.push({ type: k, path: v });
    }
  }
  const mine = groups.find((g) => g.agents.some((a) => a !== '*' && 'ebiketekoopcatalogbot'.includes(a.replace(/[^a-z]/g, ''))));
  const star = groups.find((g) => g.agents.includes('*'));
  return (mine || star || { rules: [] }).rules;
}

function ruleMatches(rulePath, urlPath) {
  if (!rulePath) return false;
  const re = new RegExp('^' + rulePath.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
  return re.test(urlPath);
}

export async function getRobots(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let entry = { rules: [], sitemaps: [], status: 0 };
  try {
    const res = await fetch(origin + '/robots.txt', { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    entry.status = res.status;
    if (res.ok) {
      const text = await res.text();
      entry.rules = parseRobots(text);
      entry.sitemaps = [...text.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    }
  } catch (e) {
    entry.error = String(e);
  }
  robotsCache.set(origin, entry);
  return entry;
}

/** Longest matching rule wins; Allow beats Disallow on ties (RFC 9309). */
export async function isAllowed(url) {
  const u = new URL(url);
  const { rules, status } = await getRobots(u.origin);
  if (status >= 500) return false; // be conservative when robots can't be read
  let best = null;
  for (const r of rules) {
    if (!ruleMatches(r.path, u.pathname + u.search)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.type === 'allow')) best = r;
  }
  return !best || best.type === 'allow' || best.path === '';
}

export async function politeFetch(url, opts = {}) {
  if (!(await isAllowed(url))) {
    const err = new Error('blocked by robots.txt: ' + url);
    err.robots = true;
    throw err;
  }
  const host = new URL(url).host;
  const wait = Math.max(0, (lastHit.get(host) || 0) + DELAY_MS - Date.now());
  if (wait) await sleep(wait);
  lastHit.set(host, Date.now());
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: opts.accept || 'text/html,application/xhtml+xml,application/xml,*/*', 'accept-language': 'nl-NL,nl;q=0.9,en;q=0.5' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  return res;
}

export async function fetchText(url, opts) {
  const res = await politeFetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

/** Extract all <loc> URLs from a sitemap or sitemap index (supports .gz). */
export async function sitemapUrls(url, depth = 0) {
  const res = await politeFetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  let buf = Buffer.from(await res.arrayBuffer());
  if (url.endsWith('.gz') || (buf[0] === 0x1f && buf[1] === 0x8b)) buf = (await import('node:zlib')).gunzipSync(buf);
  const xml = buf.toString('utf8');
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  if (/<sitemapindex/i.test(xml) && depth < 2) {
    const out = [];
    for (const l of locs) out.push(...(await sitemapUrls(l, depth + 1)));
    return out;
  }
  return locs;
}

/** Return every JSON-LD object found in an HTML document (flattened, @graph expanded). */
export function jsonLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1].trim());
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk);
        if (n && typeof n === 'object') {
          out.push(n);
          if (n['@graph']) walk(n['@graph']);
        }
      };
      walk(data);
    } catch {
      /* ignore malformed block */
    }
  }
  return out;
}

export const meta = (html, prop) => {
  const m = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']*)["']`, 'i').exec(html) || new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${prop}["']`, 'i').exec(html);
  return m ? decodeEntities(m[1]) : '';
};

export const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

export const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
export const writeJson = (p, d) => (ensureDir(path.dirname(p)), fs.writeFileSync(p, JSON.stringify(d, null, 1)));
