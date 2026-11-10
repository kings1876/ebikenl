// Turn raw Shopify feeds (Batavus, Haibike, Raleigh) into the common record shape used by build-catalog.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { decodeEntities, writeJson } from './lib.mjs';

const RAW = process.env.RAW;
const load = (f) => (fs.existsSync(path.join(RAW, f)) ? JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8')) : []);
const plain = (h) => decodeEntities((h || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const SANE_MAX = 15000; // brand-feed typos like 21999 are treated as missing

/** Facts stated in the product text (any of NL/DE/EN). Only what is literally there. */
function factsFromText(text) {
  const specs = {};
  const motor = /(Bosch (?:Performance Line (?:CX|SX)?|Active Line (?:Plus)?|Cargo Line|Performance)(?: Smart System)?|Bosch (?:Active|Performance)[ \w]{0,12}|Shimano (?:STEPS )?EP\d{1,2}|Shimano STEPS[ \w-]{0,10}|Yamaha[ \w]{0,14}|Brose[ \w]{0,14}|Fazua[ \w]{0,12})/i.exec(text);
  const nm = /(\d{2,3})\s?Nm/i.exec(text);
  if (motor) specs.Motor = motor[1].trim() + (nm ? `, ${nm[1]} Nm` : '');
  const wh = [...text.matchAll(/(\d{3,4})\s?Wh/gi)].map((m) => +m[1]);
  if (wh.length) specs.Accu = [...new Set(wh)].map((w) => `${w} Wh`).join(' / ');
  if (/enviolo|nuvinci|traploos|stufenlos|stepless/i.test(text)) specs.Versnelling = 'Enviolo (traploos)';
  else if (/nexus (\d)/i.test(text)) specs.Versnelling = 'Shimano Nexus ' + /nexus (\d)/i.exec(text)[1] + '-speed';
  if (/gates|riemaandrijving|belt drive|riemenantrieb|carbon drive/i.test(text)) specs.Aandrijving = 'Riem';
  if (/hydrauli(?:sch|c|k)/i.test(text) && /schijf|disc|scheiben/i.test(text)) specs.Remmen = 'Hydraulische schijfrem';
  return specs;
}

function frameShape(options) {
  const o = options.find((x) => /frame (shape|kind)|rahmenform|framevorm/i.test(x.name));
  if (!o || o.values.length !== 1) return undefined;
  const v = o.values[0];
  if (/low|laag|tief|step|dames|women/i.test(v)) return 'Dames (lage instap)';
  if (/high|hoog|hoch|cross|diamond|heren|men/i.test(v)) return 'Heren (diamant)';
  if (/mid|middle|mitte|wave|unisex/i.test(v)) return 'Unisex (middeninstap)';
  return undefined;
}

function build({ brand, host, feed, beFeed, pick, category, priceSource, nlMarketNote }) {
  const be = new Map(beFeed.map((p) => [p.handle, p]));
  const out = [];
  for (const p of feed.filter(pick)) {
    const text = plain(p.body_html) + ' ' + p.title + ' ' + p.tags.join(' ');
    const specs = factsFromText(text);
    const sizeOpt = p.options.find((o) => /size|grösse|maat/i.test(o.name));
    const colOpt = p.options.find((o) => /colou?r|farbe|kleur/i.test(o.name));
    if (sizeOpt) specs.Maten = sizeOpt.values.join(', ');
    if (colOpt) specs.Kleuren = colOpt.values.join(', ');
    const prices = p.variants.map((v) => +v.price).filter((x) => x > 0 && x < SANE_MAX);
    let price = prices.length ? Math.min(...prices) : null;
    let priceNote = nlMarketNote;
    if (!price && be.has(p.handle)) {
      const bp = be.get(p.handle).variants.map((v) => +v.price).filter((x) => x > 0 && x < SANE_MAX);
      if (bp.length) { price = Math.min(...bp); priceNote = 'Adviesprijs Belgische markt (de NL-markt toont geen prijs)'; }
    }
    out.push({
      brand,
      url: `https://${host}/products/${p.handle}`,
      name: p.title.replace(/\s+-\s+.*$/, '').trim(),
      category: category(p),
      shape: frameShape(p.options),
      tagsRaw: p.tags,
      intro: '',
      price, priceNote, priceMissing: !price,
      priceSource,
      specs,
      images: [...new Set(p.images.map((i) => i.src.split('?')[0] + '?width=1600'))],
      handle: p.handle,
    });
  }
  return out;
}

const batavus = build({
  brand: 'Batavus', host: 'batavus.com',
  feed: load('shopify-batavus.com.json'), beFeed: load('shopify-batavus-be.json'),
  pick: (p) => p.product_type === 'ebike',
  category: (p) => (p.tags.some((t) => /cargo|family/i.test(t)) ? 'Bakfietsen' : 'Stadsfietsen'),
  priceSource: 'batavus.com (adviesprijs fabrikant)', nlMarketNote: 'Adviesprijs van de fabrikant (NL-markt).',
});
const haibike = build({
  brand: 'Haibike', host: 'haibike.com',
  feed: load('shopify-haibike.com.json'), beFeed: [],
  pick: (p) => p.product_type === 'ebike' && !p.tags.some((t) => /do not launch/i.test(t)) && p.images.length >= 2,
  category: (p) => (p.tags.some((t) => /trekking/i.test(t)) ? 'Trekkingfietsen' : 'Elektrische mountainbikes'),
  priceSource: 'haibike.com (internationale adviesprijs, EUR)', nlMarketNote: 'Internationale adviesprijs van de fabrikant in EUR.',
});
const raleigh = build({
  brand: 'Raleigh', host: 'www.raleigh.co.uk',
  feed: load('shopify-raleigh.co.uk.json'), beFeed: [],
  pick: (p) => /e-?bikes/i.test(p.product_type),
  category: () => 'Stadsfietsen',
  priceSource: 'raleigh.co.uk, NL-markt (adviesprijs fabrikant, EUR)', nlMarketNote: 'Adviesprijs van de fabrikant voor de Nederlandse markt (EUR).',
});

// one entry per model name (the feed repeats names across model years): keep the one with most photos
const dedupe = (arr) => [...arr.reduce((m, r) => (!m.has(r.name) || m.get(r.name).images.length < r.images.length ? m.set(r.name, r) : m), new Map()).values()];
haibike.splice(0, haibike.length, ...dedupe(haibike));
// Batavus: the feed repeats model names across years; keep the priced entry (then the one with most photos)
const bestPer = (arr) => [...arr.reduce((m, r) => { const cur = m.get(r.name); const better = !cur || (!!r.price > !!cur.price) || (!!r.price === !!cur.price && r.images.length > cur.images.length); return better ? m.set(r.name, r) : m; }, new Map()).values()];
batavus.splice(0, batavus.length, ...bestPer(batavus).filter((r) => r.price));

for (const [n, d] of Object.entries({ batavus, haibike, raleigh })) {
  writeJson(path.join(RAW, `${n}.json`), d);
  console.log(n.padEnd(8), 'models', d.length, '| priced', d.filter((x) => x.price).length, '| missing price', d.filter((x) => x.priceMissing).map((x) => x.name).join('; ') || '-', '| >=3 imgs', d.filter((x) => x.images.length >= 3).length);
}
