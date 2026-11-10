import { politeFetch } from './lib.mjs';
const hosts = process.argv.slice(2);
for (const h of hosts) {
  try {
    const res = await politeFetch(`https://${h}/products.json?limit=3`, { accept: 'application/json' });
    const t = await res.text(); let j; try { j = JSON.parse(t); } catch {}
    console.log(h.padEnd(26), res.status, j?.products ? `SHOPIFY products.json ok (${j.products.length}) e.g. ${j.products[0]?.title} | imgs ${j.products[0]?.images?.length} | variants ${j.products[0]?.variants?.length} | barcode ${j.products[0]?.variants?.[0]?.barcode ?? 'n/a'}` : 'not shopify-json');
  } catch (e) { console.log(h.padEnd(26), 'ERR', String(e.message).slice(0, 60)); }
}
