// Tell Bing and the other IndexNow search engines which URLs are new or changed.
//   node scripts/seo/indexnow.mjs                 submit every URL in the live sitemap
//   node scripts/seo/indexnow.mjs /product/x /blog/y   submit just those paths
// The key below is public by design: it has to be readable at https://<host>/<key>.txt, which is how the engines
// check that you own the site (the file lives in public/).
const KEY = process.env.INDEXNOW_KEY ?? '866c86396ec4b54ba0229ca20cc1442b';
const HOST = process.env.INDEXNOW_HOST ?? 'ebike-te-koop.nl';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function urlsFromSitemap() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urls = args.length ? args.map((p) => (p.startsWith('http') ? p : `${ORIGIN}${p.startsWith('/') ? p : '/' + p}`)) : await urlsFromSitemap();
if (!urls.length) throw new Error('no URLs to submit');

// IndexNow takes up to 10,000 URLs per request.
for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: batch }),
  });
  console.log(`submitted ${batch.length} URLs -> HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 400) console.log(await res.text());
}
