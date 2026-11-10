// Pull a WooCommerce shop's public Store API product list (the site's own public endpoint), paginated.
import path from 'node:path';
import { politeFetch, writeJson } from './lib.mjs';
const [, , host] = process.argv;
const all = [];
for (let page = 1; page < 30; page++) {
  const res = await politeFetch(`https://${host}/wp-json/wc/store/v1/products?per_page=100&page=${page}`, { accept: 'application/json' });
  if (!res.ok) { console.log('stop', res.status); break; }
  const j = await res.json();
  if (!Array.isArray(j) || !j.length) break;
  all.push(...j);
  if (j.length < 100) break;
}
writeJson(path.join(process.env.RAW, `woo-${host}.json`), all);
const cats = {}; all.forEach((p) => p.categories?.forEach((c) => (cats[c.name] = (cats[c.name] || 0) + 1)));
console.log(host, 'TOTAL', all.length, 'minor', all[0]?.prices?.currency_minor_unit, 'cur', all[0]?.prices?.currency_code, 'cats', JSON.stringify(cats).slice(0, 400));
