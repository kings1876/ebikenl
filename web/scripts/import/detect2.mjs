// Try the public Shopify product feed on several hosts and market prefixes.
import { politeFetch } from './lib.mjs';
for (const h of process.argv.slice(2)) {
  for (const prefix of ['', 'nl-nl/', 'nl/']) {
    try {
      const res = await politeFetch(`https://${h}/${prefix}products.json?limit=250`, { accept: 'application/json' });
      const t = await res.text(); let j; try { j = JSON.parse(t); } catch {}
      if (j?.products) {
        const types = {}; j.products.forEach((p) => (types[p.product_type || '-'] = (types[p.product_type || '-'] || 0) + 1));
        console.log(h.padEnd(24), prefix.padEnd(6), 'SHOPIFY', j.products.length, 'priced', j.products.filter((p) => +p.variants?.[0]?.price > 0).length, JSON.stringify(types).slice(0, 110));
        break;
      }
    } catch (e) { /* try next prefix */ }
  }
}
console.log('done');
