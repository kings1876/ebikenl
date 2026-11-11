// Checks every Markdown post in content/blog against the SEO checklist. Usage:
//   node scripts/blog/verify.mjs [--external] [--final]
// --external  also requests every external link (must answer 200)
// --final     enforces the whole-blog rules (post counts per type, 2+ links to other posts)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIR = path.join(ROOT, 'content', 'blog');
const args = new Set(process.argv.slice(2));
const catalogue = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'catalog.json'), 'utf8'));
const PRODUCT_SLUGS = new Set(catalogue.map((p) => p.slug));
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const LANDINGS = ['/bosch-middenmotor', '/elektrische-damesfiets', '/e-bike-onder-2000', '/fietsplan-e-bikes', '/speed-pedelecs', '/keuzehulp', '/contact'];
const BANNED = [
  /100% rijklaar/i, /gratis bezorg/i, /gratis verzend/i, /op voorraad/i, /direct leverbaar/i, /snel geleverd/i, /binnen \d+ (werk)?dagen/i,
  /gegarandeerd/i, /tot \d+% korting/i, /beste prijs/i, /goedkoopste van/i, /trustpilot/i, /beoordeeld/i, /wij hebben (het )?getest/i,
  /onze test/i, /uitgebreid getest/i, /klanten (zijn|geven)/i, /\b\d+ jaar (garantie|ervaring)/i, /nummer 1/i, /marktleider/i,
];

function parse(file) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { file, error: 'frontmatter' };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  return { file, slug: file.replace(/\.md$/, ''), fm, body: m[2].trim() };
}

function plain(body) {
  return body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\[picks\]\]/g, ' ')
    .replace(/^\s*\|?\s*:?-{2,}[\s|:-]*$/gm, ' ')
    .replace(/[#>*_`|]/g, ' ');
}
const words = (t) => t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort() : [];
const posts = files.map(parse);
const slugs = new Set(posts.map((p) => p.slug));
const externalUrls = new Map();
let failed = 0;
const rows = [];

for (const p of posts) {
  const errs = [];
  const warn = [];
  if (p.error) { errs.push(p.error); rows.push({ p, errs, warn, stats: {} }); failed++; continue; }
  const { fm, body } = p;
  const kw = (fm.keyword || '').toLowerCase();
  const kwTokens = kw.split(/\s+/).filter(Boolean);
  const text = plain(body);
  const w = words(text);
  const lower = text.toLowerCase();

  // metadata
  if (!fm.title || fm.title.length < 50 || fm.title.length > 60) errs.push(`title ${fm.title?.length} chars (50-60)`);
  if (kw && fm.title && fm.title.toLowerCase().indexOf(kw) > 12) errs.push('keyword not near the start of the title');
  if (!fm.description || fm.description.length < 120 || fm.description.length > 158) errs.push(`description ${fm.description?.length} chars (120-158)`);
  if (kw && !fm.description.toLowerCase().includes(kw)) errs.push('keyword missing in description');
  if (kw && !fm.h1.toLowerCase().includes(kw)) errs.push('keyword missing in h1');
  if (kwTokens.length && kwTokens.filter((t) => p.slug.includes(slugify(t))).length < Math.min(2, kwTokens.length)) errs.push('slug does not contain the keyword');
  if (!['transactional', 'commercial', 'informational'].includes(fm.type)) errs.push('type');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.date || '')) errs.push('date');
  if (!fs.existsSync(path.join(ROOT, 'public', fm.image || 'x'))) errs.push(`hero image missing: ${fm.image}`);
  if (!fm.imageAlt || fm.imageAlt.length < 25) errs.push('hero alt too short');
  if (kwTokens.length && !kwTokens.some((t) => t.length > 3 && (fm.imageAlt || '').toLowerCase().includes(t))) warn.push('hero alt shares no keyword word');

  // length and structure
  if (w.length < 1400) errs.push(`only ${w.length} words (min 1400)`);
  const lines = body.split('\n');
  const h2 = lines.filter((l) => /^##\s/.test(l)).map((l) => l.replace(/^##\s+/, ''));
  if (lines.some((l) => /^#\s/.test(l))) errs.push('h1 inside the body');
  let lastLevel = 1;
  for (const l of lines) { const m = l.match(/^(#{2,6})\s/); if (m) { if (m[1].length > lastLevel + 1) errs.push(`heading level skipped at "${l.slice(0, 40)}"`); lastLevel = m[1].length; } }
  if (h2.length < 6) errs.push(`only ${h2.length} h2 (min 6)`);
  const kwH2 = h2.filter((h) => kwTokens.filter((t) => h.toLowerCase().includes(t)).length >= Math.max(2, kwTokens.length - 1));
  if (kwH2.length < 2) errs.push(`keyword in ${kwH2.length} h2 (min 2)`);
  const first100 = words(text).slice(0, 100).join(' ').toLowerCase();
  if (kw && !first100.includes(kw)) errs.push('keyword not in the first 100 words');
  const occurrences = kw ? lower.split(kw).length - 1 : 0;
  const density = kw ? (occurrences * kwTokens.length) / w.length * 100 : 0;
  if (occurrences < 4) errs.push(`keyword used ${occurrences}x (min 4)`);
  if (density > 2.5) errs.push(`keyword density ${density.toFixed(2)}% (max 2.5)`);
  if (!/^##\s+(conclusie|samenvatting|kort samengevat)/im.test(body)) warn.push('no conclusion section');

  // readability
  const paragraphs = body.split(/\n\s*\n/).map((x) => x.trim()).filter((x) => x && !/^(#|!\[|>|\||[-*]\s|\d+\.\s|\[\[)/.test(x));
  const longPara = paragraphs.filter((x) => words(x).length > 110);
  if (longPara.length) errs.push(`${longPara.length} paragraph(s) over 110 words`);
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9])/).map((s) => words(s).length).filter(Boolean);
  const avg = sentences.reduce((a, b) => a + b, 0) / (sentences.length || 1);
  const longShare = sentences.filter((n) => n > 30).length / (sentences.length || 1);
  if (avg > 19) errs.push(`average sentence ${avg.toFixed(1)} words (max 19)`);
  if (longShare > 0.06) errs.push(`${(longShare * 100).toFixed(0)}% sentences over 30 words (max 6%)`);

  // links
  const links = [...body.matchAll(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => ({ text: m[1], href: m[2] }));
  const internal = links.filter((l) => l.href.startsWith('/'));
  const external = links.filter((l) => /^https?:/.test(l.href));
  const productLinks = internal.filter((l) => l.href.startsWith('/product/'));
  const postLinks = internal.filter((l) => l.href.startsWith('/blog/'));
  const catLinks = internal.filter((l) => /^\/(categorie|merk)\//.test(l.href) || LANDINGS.includes(l.href));
  for (const l of productLinks) if (!PRODUCT_SLUGS.has(l.href.replace('/product/', ''))) errs.push(`unknown product link ${l.href}`);
  for (const l of postLinks) if (!slugs.has(l.href.replace('/blog/', '').replace(/#.*$/, ''))) errs.push(`unknown post link ${l.href}`);
  if (new Set(productLinks.map((l) => l.href)).size < 3) errs.push('fewer than 3 distinct product links');
  if (catLinks.length < 2) errs.push('fewer than 2 category/brand/landing links');
  if (args.has('--final') && new Set(postLinks.map((l) => l.href)).size < 2) errs.push('fewer than 2 links to other posts');
  const domains = new Set(external.map((l) => new URL(l.href).hostname.replace(/^www\./, '')));
  if (domains.size < 2) errs.push(`only ${domains.size} external domain(s) (min 2)`);
  for (const l of external) externalUrls.set(l.href, p.slug);
  const vague = links.filter((l) => /^(klik hier|hier|lees meer|deze link|link)$/i.test(l.text.trim()));
  if (vague.length) errs.push('vague link text');

  // frontmatter products
  const prods = (fm.products || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (prods.length < 4) errs.push(`only ${prods.length} product cards in frontmatter (min 4)`);
  for (const s of prods) if (!PRODUCT_SLUGS.has(s)) errs.push(`unknown product slug ${s}`);
  if (fm.category && !fs.existsSync(path.join(ROOT, 'src', 'app', '(nl)')) ) errs.push('app dir');
  for (const r of (fm.related || '').split(',').map((s) => s.trim()).filter(Boolean)) if (!slugs.has(r)) errs.push(`unknown related post ${r}`);

  // images
  const IMG_LINE = /^!\[[^\]]*\]\([^)\s]+(?:\s+"[^"]*")?\)\s*$/;
  for (const l of lines) if (l.startsWith('![') && !IMG_LINE.test(l)) errs.push(`image line is not alone on its line: ${l.slice(0, 50)}`);
  const imgs = [...body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => ({ alt: m[1], src: m[2] }));
  if (imgs.length < 2) errs.push(`only ${imgs.length} inline images (min 2)`);
  for (const im of imgs) {
    if (im.alt.length < 25) errs.push(`inline image alt too short: ${im.src}`);
    if (!fs.existsSync(path.join(ROOT, 'public', im.src))) errs.push(`inline image missing: ${im.src}`);
  }
  if (new Set([fm.image, ...imgs.map((i) => i.src)]).size < 3) errs.push('images are not distinct (need 3 different)');

  // claims
  for (const re of BANNED) if (re.test(text)) errs.push(`banned claim: ${re}`);

  if (errs.length) failed++;
  rows.push({ p, errs, warn, stats: { words: w.length, h2: h2.length, kw: occurrences, dens: density.toFixed(2), avg: avg.toFixed(1), prod: new Set(productLinks.map((l) => l.href)).size, ext: domains.size, img: imgs.length + 1 } });
}

if (args.has('--final')) {
  const count = (t) => posts.filter((p) => p.fm?.type === t).length;
  const want = { transactional: 10, commercial: 3, informational: 5 };
  for (const [t, n] of Object.entries(want)) if (count(t) !== n) { console.log(`FAIL whole blog: ${count(t)} ${t} posts, expected ${n}`); failed++; }
  const titles = posts.map((p) => p.fm?.title);
  const descs = posts.map((p) => p.fm?.description);
  if (new Set(titles).size !== titles.length) { console.log('FAIL duplicate titles'); failed++; }
  if (new Set(descs).size !== descs.length) { console.log('FAIL duplicate descriptions'); failed++; }
  const kws = posts.map((p) => p.fm?.keyword);
  if (new Set(kws).size !== kws.length) { console.log('FAIL two posts target the same keyword'); failed++; }
}

if (args.has('--external')) {
  console.log(`\nChecking ${externalUrls.size} external links…`);
  for (const [url, slug] of externalUrls) {
    try {
      const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; link-check)' }, signal: AbortSignal.timeout(20000) });
      const same = new URL(res.url).pathname.replace(/\/$/, '') === new URL(url).pathname.replace(/\/$/, '');
      console.log(`${res.ok ? 'OK  ' : 'FAIL'} ${res.status} ${url}${same ? '' : ` -> ${res.url}`} (${slug})`);
      if (!res.ok) failed++;
    } catch (e) {
      console.log(`FAIL ERR ${url} (${slug}): ${e.message}`);
      failed++;
    }
  }
}

console.log('');
for (const { p, errs, warn, stats } of rows) {
  const s = stats.words ? `${stats.words}w h2:${stats.h2} kw:${stats.kw}(${stats.dens}%) sent:${stats.avg} prod:${stats.prod} ext:${stats.ext} img:${stats.img}` : '';
  console.log(`${errs.length ? 'FAIL' : 'PASS'} ${p.file} ${s}`);
  for (const e of errs) console.log(`     - ${e}`);
  for (const x of warn) console.log(`     ~ ${x}`);
}
console.log(`\n${posts.length} posts, ${failed ? failed + ' with problems' : 'all checks passed'}`);
process.exit(failed ? 1 : 0);
