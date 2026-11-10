// Discovery across European e-bike makers: robots, Shopify feed, WooCommerce Store API (both are the sites' own public endpoints).
import path from 'node:path';
import { getRobots, isAllowed, politeFetch, writeJson } from './lib.mjs';

const HOSTS = (process.argv[2] || '').split(',').filter(Boolean);
const out = [];

async function tryJson(url) {
  try {
    const res = await politeFetch(url, { accept: 'application/json' });
    if (!res.ok) return null;
    const t = await res.text();
    return JSON.parse(t);
  } catch {
    return null;
  }
}

for (const host of HOSTS) {
  const origin = `https://${host}`;
  const row = { host };
  try {
    const robots = await getRobots(origin);
    row.robots = robots.status || robots.error?.slice(0, 20);
    if (!(await isAllowed(origin + '/'))) { row.result = 'robots disallow'; out.push(row); console.log(host.padEnd(28), row.result); continue; }
    // Shopify
    for (const prefix of ['', 'nl/', 'nl-nl/', 'en/']) {
      const j = await tryJson(`${origin}/${prefix}products.json?limit=250`);
      if (j?.products) {
        const eb = j.products.filter((p) => /e-?bike|electric|elektr|pedelec|hybrid|e-?mtb|\bE\+|\bEP\d/i.test([p.product_type, p.title, p.tags?.join(' ')].join(' ')));
        row.shopify = { prefix, total: j.products.length, ebikeish: eb.length, priced: eb.filter((p) => +p.variants?.[0]?.price > 0).length, currency: j.products[0]?.variants?.[0]?.price };
        break;
      }
    }
    // WooCommerce Store API
    const w = await tryJson(`${origin}/wp-json/wc/store/v1/products?per_page=5`);
    if (Array.isArray(w) && w.length) row.woo = { sample: w[0].name, price: w[0].prices?.price, currency: w[0].prices?.currency_code };
    row.result = row.shopify ? `SHOPIFY ${JSON.stringify(row.shopify)}` : row.woo ? `WOO ${JSON.stringify(row.woo)}` : 'no public feed';
  } catch (e) {
    row.result = 'ERR ' + String(e.message).slice(0, 50);
  }
  out.push(row);
  console.log(host.padEnd(28), row.result);
}
writeJson(path.join(process.env.RAW, `discover-${Date.now()}.json`), out);
