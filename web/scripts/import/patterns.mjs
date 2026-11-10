import { getRobots, sitemapUrls } from './lib.mjs';
const SITES = { gazelle:'https://www.gazelle.nl', batavus:'https://www.batavus.nl', koga:'https://www.koga.com', cube:'https://www.cube.eu', cortina:'https://cortinabikes.com', stromer:'https://www.stromerbike.com', brompton:'https://www.brompton.com', babboe:'https://www.babboe.nl', haibike:'https://www.haibike.com', raleigh:'https://www.raleigh.nl', veloretti:'https://veloretti.com' };
const only = process.argv[2];
for (const [n,o] of Object.entries(SITES)) {
  if (only && n!==only) continue;
  const r = await getRobots(o); const urls = await sitemapUrls(r.sitemaps[0]).catch(()=>[]);
  const seg = {};
  for (const u of urls) { const p = new URL(u).pathname.split('/').filter(Boolean); const k='/'+p.slice(0,2).join('/')+' ('+p.length+')'; (seg[k]??=[]).push(u); }
  console.log('==',n,urls.length);
  Object.entries(seg).sort((a,b)=>b[1].length-a[1].length).slice(0,6).forEach(([k,v])=>console.log(' ',String(v.length).padStart(4),k,'e.g.',v[0].replace(o,'')));
}
