import { getRobots, sitemapUrls } from './lib.mjs';
const [,, host, filter='', depth='2'] = process.argv;
const r = await getRobots('https://'+host); const all=[]; for (const s of r.sitemaps) all.push(...await sitemapUrls(s).catch(()=>[]));
const urls = all.filter(u=>!filter||new RegExp(filter).test(u)); const seg={};
for (const u of urls){const p=new URL(u).pathname.split('/').filter(Boolean);const k='/'+p.slice(0,+depth).join('/')+' ['+p.length+']';(seg[k]??=[]).push(u);}
console.log(host,'total',all.length,'filtered',urls.length);
Object.entries(seg).sort((a,b)=>b[1].length-a[1].length).slice(0,14).forEach(([k,v])=>console.log(String(v.length).padStart(5),k,v[0].replace(/^https?:\/\/[^/]+/,'')));
