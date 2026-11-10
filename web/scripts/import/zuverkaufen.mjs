// Read model facts from e-bikes-zuverkaufen.ch (a Swiss comparison site; robots.txt allows /e-bikes/).
// We keep only facts (model, brand, motor, battery, weight, sizes, CHF list price, brand-hosted photo URLs).
// Descriptions are NOT copied; build-catalog.mjs writes its own text from the facts.
import path from 'node:path';
import fs from 'node:fs';
import { isAllowed, politeFetch, sitemapUrls, decodeEntities, writeJson } from './lib.mjs';

const RAW = process.env.RAW;
const HOST = 'https://e-bikes-zuverkaufen.ch';
const CACHE = path.join(RAW, 'zuverkaufen-pages');
fs.mkdirSync(CACHE, { recursive: true });

const urls = (await sitemapUrls(`${HOST}/sitemap.xml`))
  .filter((u) => /\/e-bikes\/[^/]+\/[^/]+\/?$/.test(new URL(u).pathname) && !/\/(fr|it)\//.test(u));
console.log('candidate pages', urls.length);

const LABELS = ['Motor & Antrieb', 'Akkukapazität', 'Geschwindigkeitsbegrenzung', 'Schaltung', 'Bremsanlage', 'Federgabel / Dämpfung', 'Rahmenmaterial & Form', 'Lieferbare Rahmengrössen', 'Gewicht', 'Beleuchtung & Display'];

const textOf = (html) => decodeEntities(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function parse(url, html) {
  const blocks = [...html.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/g)].flatMap((m) => { try { const j = JSON.parse(m[1]); return Array.isArray(j) ? j : [j]; } catch { return []; } });
  const prod = blocks.find((b) => b['@type'] === 'Product');
  if (!prod) return null;
  const t = textOf(html);
  const start = t.indexOf('Alle Technischen Daten');
  const end = t.indexOf('Über das ', start);
  const sect = start >= 0 ? t.slice(start + 'Alle Technischen Daten'.length, end > 0 ? end : start + 1500) : '';
  const raw = {};
  LABELS.forEach((l, i) => {
    const at = sect.indexOf(l);
    if (at < 0) return;
    let to = sect.length;
    for (const o of LABELS) { const k = sect.indexOf(o, at + l.length); if (k > 0 && k < to) to = k; }
    raw[l] = sect.slice(at + l.length, to).trim();
  });
  const nm = /Drehmoment\s+(\d{2,3})\s?Nm/i.exec(t);
  const year = /Modelljahr\s+(\d{4})/.exec(t);
  const price = prod.offers?.price;
  return {
    url,
    seg: new URL(url).pathname.split('/').filter(Boolean),
    name: prod.name,
    brand: prod.brand?.name,
    priceChf: price ? +price : null,
    approx: new RegExp('ca\\.\\s*CHF\\s*' + String(price).replace(/(\d)(?=(\d{3})+$)/g, "$1['’]?")).test(t),
    year: year ? +year[1] : null,
    torqueNm: nm ? +nm[1] : null,
    raw,
    images: [...new Set((prod.image || []).map(String))],
  };
}

const out = [];
for (const u of urls) {
  const f = path.join(CACHE, new URL(u).pathname.split('/').filter(Boolean).slice(1).join('__') + '.html');
  let html;
  if (fs.existsSync(f)) html = fs.readFileSync(f, 'utf8');
  else {
    if (!(await isAllowed(u))) continue;
    const res = await politeFetch(u, { accept: 'text/html' });
    if (!res.ok) { console.log('skip', res.status, u); continue; }
    html = await res.text();
    fs.writeFileSync(f, html);
  }
  const rec = parse(u, html);
  if (rec) out.push(rec);
}
writeJson(path.join(RAW, 'zuverkaufen-raw.json'), out);
const by = {};
out.forEach((r) => (by[r.brand] = (by[r.brand] || 0) + 1));
console.log('models', out.length, by);
