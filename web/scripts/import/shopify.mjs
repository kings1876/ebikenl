// Pull a Shopify storefront's public product feed (/products.json) for a market, paginated.
import path from 'node:path';
import { politeFetch, writeJson } from './lib.mjs';
const [,, host, market = 'nl-nl'] = process.argv;
const RAW = process.env.RAW;
const all = [];
for (let page = 1; page < 40; page++) {
  const url = `https://${host}/${market ? market + '/' : ''}products.json?limit=250&page=${page}`;
  let res; for (let t = 0; t < 4; t++) { res = await politeFetch(url, { accept: 'application/json' }); if (res.status !== 429) break; await new Promise(r => setTimeout(r, 4000 * (t + 1))); }
  if (!res.ok) { console.log('stop', res.status, url); break; }
  const j = await res.json(); if (!j.products?.length) break; all.push(...j.products); console.log(host, 'page', page, '+', j.products.length);
}
writeJson(path.join(RAW, `shopify-${host}.json`), all);
const types = {}; all.forEach(p => types[p.product_type || '(none)'] = (types[p.product_type || '(none)'] || 0) + 1);
console.log(host, 'TOTAL', all.length, 'types', JSON.stringify(types));
const s = all[0]; if (s) console.log('sample', s.title, '| vendor', s.vendor, '| price', s.variants?.[0]?.price, '| images', s.images?.length, '| variants', s.variants?.length, '| barcode?', s.variants?.some(v=>v.barcode), '| sku', s.variants?.[0]?.sku);
