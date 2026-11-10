import { fetchText, jsonLd, meta, getRobots, sitemapUrls } from './lib.mjs';
const [,, brandHost, regex, nth='0'] = process.argv;
const r = await getRobots('https://'+brandHost); const all=[]; for (const s of r.sitemaps) all.push(...await sitemapUrls(s).catch(()=>[]));
const re = new RegExp(regex); const hits = all.filter(u=>re.test(u)); console.log(brandHost,'matches',hits.length, hits.slice(0,3));
if (!hits.length) process.exit();
const url = hits[+nth]; const html = await fetchText(url);
const ld = jsonLd(html).filter(o=>/Product/.test([].concat(o['@type']).join()));
console.log('URL',url,'html',html.length,'ldProducts',ld.length);
if (ld[0]) { const p=ld[0]; console.log({name:p.name,sku:p.sku,gtin:p.gtin13||p.gtin||p.gtin14,brand:p.brand?.name||p.brand,images:[].concat(p.image||[]).length,price:p.offers?.price||p.offers?.[0]?.price,cur:p.offers?.priceCurrency||p.offers?.[0]?.priceCurrency,desc:(p.description||'').slice(0,80)}); }
console.log('og:image',meta(html,'og:image').slice(0,100),'| title',meta(html,'og:title'));
console.log('img count in html', (html.match(/<img /g)||[]).length, '| __NEXT_DATA__', /__NEXT_DATA__/.test(html), '| nuxt', /__NUXT__/.test(html));
