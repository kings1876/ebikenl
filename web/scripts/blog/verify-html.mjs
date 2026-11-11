// Checks the rendered blog pages of a running build. Usage: node scripts/blog/verify-html.mjs http://localhost:3150
import fs from 'node:fs';
import path from 'node:path';

const origin = (process.argv[2] || 'http://localhost:3150').replace(/\/$/, '');
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIR = path.join(ROOT, 'content', 'blog');
const slugs = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const status = new Map();
let failed = 0;

async function ok(url) {
  if (status.has(url)) return status.get(url);
  const r = await fetch(url, { redirect: 'manual' }).then((x) => x.status).catch(() => 0);
  status.set(url, r);
  return r;
}

async function check(urlPath, expect) {
  const res = await fetch(origin + urlPath);
  const html = await res.text();
  const errs = [];
  if (res.status !== 200) errs.push(`status ${res.status}`);
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  if (title.length < 50 || title.length > 60) errs.push(`title ${title.length} chars: ${title}`);
  if (desc.length < 120 || desc.length > 160) errs.push(`description ${desc.length} chars`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) errs.push(`${h1s} h1 tags`);
  if (!new RegExp(`<link rel="canonical" href="https://e-bike-tekoop.nl${urlPath}"`).test(html)) errs.push('canonical');
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) if (!html.includes(`property="${tag}"`)) errs.push(`missing ${tag}`);
  for (const tag of ['twitter:card', 'twitter:image']) if (!html.includes(`name="${tag}"`)) errs.push(`missing ${tag}`);
  if (/name="robots" content="[^"]*noindex/.test(html)) errs.push('noindex!');
  if (/hrefLang|hreflang="en"/.test(html.replace(/<nav[\s\S]*?<\/nav>/g, '').split('</header>')[1] || '') && false) errs.push('en alternate');

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1]); } catch { errs.push('invalid JSON-LD'); return null; }
  }).filter(Boolean);
  const types = ld.map((x) => x['@type']);
  if (!types.includes('BreadcrumbList')) errs.push('no BreadcrumbList');
  const bc = ld.find((x) => x['@type'] === 'BreadcrumbList');
  if (bc && expect.crumbs && bc.itemListElement.length !== expect.crumbs) errs.push(`breadcrumb has ${bc.itemListElement.length} items`);
  if (bc) for (const it of bc.itemListElement) if (!it.name || !it.position) errs.push('breadcrumb item incomplete');
  if (expect.article) {
    const a = ld.find((x) => x['@type'] === 'Article');
    if (!a) errs.push('no Article');
    else for (const k of ['headline', 'description', 'image', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage']) if (!a[k]) errs.push(`Article.${k} missing`);
    if (a && a.headline.length > 110) errs.push('Article.headline over 110 chars');
  }

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt="[^"]/.test(t) && !/\balt=""/.test(t));
  if (noAlt.length) errs.push(`${noAlt.length} images without alt attribute`);
  const noDims = imgs.filter((t) => !/\bwidth="\d+"/.test(t) || !/\bheight="\d+"/.test(t));
  if (noDims.length) errs.push(`${noDims.length} images without width/height`);

  const main = (html.match(/<article[\s\S]*<\/article>/) || [html])[0];
  const hrefs = [...new Set([...html.matchAll(/<a [^>]*href="([^"#]+)(?:#[^"]*)?"/g)].map((m) => decode(m[1])))];
  for (const h of hrefs.filter((x) => x.startsWith('/'))) {
    const s = await ok(origin + h);
    if (s !== 200 && s !== 308 && s !== 307) errs.push(`broken internal link ${h} (${s})`);
  }
  const ext = [...main.matchAll(/<a [^>]*href="(https?:[^"]+)"[^>]*>/g)].map((m) => m[0]);
  const badRel = ext.filter((t) => !/rel="[^"]*noopener/.test(t));
  if (badRel.length) errs.push(`${badRel.length} external links without rel=noopener`);
  if (expect.article && ext.length < 2) errs.push(`${ext.length} external links in the article`);

  const words = main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  if (expect.article && words < 1400) errs.push(`only ${words} words rendered`);
  if (expect.article) {
    // conversion blocks: order cards, mid-article call to action, quote form
    if (!html.includes('id="bestellen"')) errs.push('no order section (#bestellen)');
    if (!html.includes('id="offerte"')) errs.push('no quote form (#offerte)');
    const orderButtons = (html.match(/Direct bestellen/g) || []).length;
    if (orderButtons < 4) errs.push(`only ${orderButtons} "Direct bestellen" buttons`);
    if (!html.includes('Weet je al welk model je wilt')) errs.push('no mid-article call to action');
    if (!/<input[^>]*type="email"[^>]*required/.test(html) && !/<input[^>]*required[^>]*type="email"/.test(html)) errs.push('quote form has no required email field');
    if (/Op voorraad|Direct leverbaar|Rijklaar leverbaar|Gratis bezorging/i.test(main)) errs.push('stock or delivery claim in the article area');
  }
  if (errs.length) failed++;
  console.log(`${errs.length ? 'FAIL' : 'PASS'} ${urlPath} title:${title.length} desc:${desc.length} words:${words} ld:${types.join('+')} links:${hrefs.length}`);
  for (const e of errs) console.log(`     - ${e}`);
}

await check('/blog', { crumbs: 2 });
for (const s of slugs) await check(`/blog/${s}`, { article: true, crumbs: 3 });

const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const llms = await (await fetch(origin + '/llms.txt')).text();
for (const s of ['blog', ...slugs.map((x) => `blog/${x}`)]) {
  if (!new RegExp(`<loc>https://e-bike-tekoop.nl/${s}</loc>`).test(sitemap)) { console.log(`FAIL sitemap misses /${s}`); failed++; }
  if (!llms.includes(`/${s}`)) { console.log(`FAIL llms.txt misses /${s}`); failed++; }
}
const redirect = await fetch(origin + '/en/blog', { redirect: 'manual' });
if (redirect.status !== 307 || !redirect.headers.get('location')?.endsWith('/blog')) { console.log('FAIL /en/blog redirect'); failed++; }

console.log(`\n${slugs.length + 1} pages, ${failed ? failed + ' with problems' : 'all checks passed'}`);
process.exit(failed ? 1 : 0);
