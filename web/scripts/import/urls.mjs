// Dump candidate product URLs for a host from its sitemaps, filtered by regex (uses cache).
import { getRobots, sitemapUrls } from './lib.mjs';
const [,, host, re, limit='15'] = process.argv;
const r = await getRobots('https://'+host); const all=[]; for (const s of r.sitemaps) all.push(...await sitemapUrls(s).catch(e=>(console.error('sitemap fail',s,e.message),[])));
const hits = [...new Set(all.filter(u=>new RegExp(re).test(u)))];
console.log(host,'total',all.length,'matches',hits.length); hits.slice(0,+limit).forEach(u=>console.log(' ',u));
