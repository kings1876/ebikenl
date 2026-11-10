// Show the JSON-LD product data on a page (trimmed). Usage: node ld.mjs <url>
import { fetchText, jsonLd } from './lib.mjs';
const html = await fetchText(process.argv[2]);
for (const o of jsonLd(html)) {
  const t = [].concat(o['@type']).join('/');
  if (!/Product|ItemList|Offer/.test(t)) continue;
  console.log(t, JSON.stringify(o).slice(0, 1800));
}
