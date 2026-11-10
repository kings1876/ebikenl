// Giant Nederland e-bikes: category list -> model families -> model pages (price, specs, gallery).
import fs from 'node:fs';
import path from 'node:path';
import { fetchText, getRobots, sitemapUrls, writeJson, decodeEntities } from './lib.mjs';

const RAW = process.env.RAW;
// Giant and Liv share one platform: node giant.mjs [origin] [Brand] [outfile]
const ORIGIN = process.argv[2] || 'https://www.giant-bicycles.com';
const BRAND = process.argv[3] || 'Giant';
const OUT = process.argv[4] || 'giant';
const CACHE = path.join(RAW, OUT);
fs.mkdirSync(CACHE, { recursive: true });

async function cached(url) {
  const f = path.join(CACHE, Buffer.from(url).toString('base64url').slice(-90) + '.html');
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const html = await fetchText(url);
  fs.writeFileSync(f, html);
  return html;
}

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '|').replace(/\|\s*(\|\s*)+/g, '|').replace(/\s+/g, ' ');

const robots = await getRobots(ORIGIN);
const all = [];
for (const s of robots.sitemaps) for (const u of await sitemapUrls(s).catch(() => [])) all.push(u);
const hostRe = new URL(ORIGIN).host.replace(/\./g, '\\.');
const categories = [...new Set(all.filter((u) => new RegExp(hostRe + '/nl/fietsen/e-bikes/[a-z-]+$').test(u)))];
console.log('e-bike category pages', categories.length, categories.map((c) => c.split('/').pop()).join(', '));

const families = new Map(); // path -> category label
for (const cat of categories) {
  const html = await cached(cat);
  const label = cat.split('/').pop();
  for (const m of html.matchAll(/href=["']?(\/nl\/bikes-[a-z0-9-]+)/g)) if (!families.has(m[1])) families.set(m[1], label);
}
console.log('families', families.size);

const models = new Map(); // path -> {family, category, intro}
for (const [fpath, category] of families) {
  const html = await cached(ORIGIN + fpath);
  const intro = decodeEntities((strip(html).match(/Skip to compare section\|([^|]{40,600})\|/) || [])[1] || '');
  // model links look like href="/nl/entour-eplus-0-dd-2027" or ...?partnumber=123 (quoted or not)
  for (const m of html.matchAll(/href=["']?(\/nl\/[a-z0-9-]+-20\d\d)(?=["' >?&])/g)) if (!models.has(m[1])) models.set(m[1], { family: fpath, category, intro });
}
console.log('model pages', models.size);

const out = [];
for (const [mpath, ctx] of models) {
  try {
    const html = await cached(ORIGIN + mpath);
    const text = strip(html);
    const name = decodeEntities(((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    const priceM = /currentprice[^>]*>\s*€\s*([\d.]+,\d{2})/.exec(html);
    const price = priceM ? parseFloat(priceM[1].replace(/\./g, '').replace(',', '.')) : null;
    const specStart = text.indexOf('Specificaties|');
    const specText = specStart >= 0 ? text.slice(specStart + 14, text.indexOf('|Download PDF', specStart) > 0 ? text.indexOf('|Download PDF', specStart) : specStart + 4000) : '';
    const parts = specText.split('|').map((s) => decodeEntities(s.trim()));
    const specs = {};
    for (let i = 0; i + 1 < parts.length; i += 2) if (parts[i] && parts[i].length < 40) specs[parts[i]] = parts[i + 1];
    const familyWord = name.split(' ')[0].toLowerCase();
    const galleryEnd = specStart > 0 ? html.indexOf('Specificaties') : html.length;
    const seen = new Map();
    for (const m of html.slice(0, galleryEnd > 0 ? galleryEnd : html.length).matchAll(/https:\/\/images2\.giant-bicycles\.com\/[^/\s"']+\/([a-z0-9]+)\/([A-Za-z0-9_.\-%]+\.(?:png|jpe?g|webp))/gi)) {
      if (!m[2].toLowerCase().includes(familyWord)) continue; // keep only this bike's own photos
      if (!seen.has(m[1])) seen.set(m[1], `https://images2.giant-bicycles.com/b_white%2Cc_pad%2Cq_85%2Cw_1600/${m[1]}/${m[2]}`);
    }
    out.push({ brand: BRAND, url: ORIGIN + mpath, name, category: ctx.category, intro: ctx.intro, price, priceSource: new URL(ORIGIN).host.replace('www.', '') + '/nl (adviesprijs)', specs, images: [...seen.values()] });
  } catch (e) {
    console.log('fail', mpath, e.message.slice(0, 60));
  }
}
writeJson(path.join(RAW, OUT + '.json'), out);
const priced = out.filter((o) => o.price).length;
console.log(BRAND, 'models', out.length, 'with price', priced, 'with >=3 images', out.filter((o) => o.images.length >= 3).length, 'avg imgs', (out.reduce((a, o) => a + o.images.length, 0) / (out.length || 1)).toFixed(1));
