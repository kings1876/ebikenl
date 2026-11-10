import { fetchText, jsonLd, meta } from './lib.mjs';
for (const url of process.argv.slice(2)) {
  try {
    const html = await fetchText(url);
    const ld = jsonLd(html); const types = ld.map(o=>[].concat(o['@type']).join('/'));
    const imgs = [...new Set([...html.matchAll(/(?:src|data-src|srcset|content)=["']([^"' ]+\.(?:jpe?g|png|webp)[^"' ]*)/gi)].map(m=>m[1]))];
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g,' ').replace(/\s+/g,' ');
    console.log('\n##', url, '\n html', html.length, '| ld', types.join(',') || '-', '| og:title', meta(html,'og:title').slice(0,60), '| imgs', imgs.length, '| spa?', html.length<3000);
    console.log(' price-ish:', (text.match(/€\s?[\d.,]{3,9}|[\d.,]{3,9}\s?€/g)||[]).slice(0,4).join(' ; ') || '-', '| Wh:', (text.match(/\d{3,4}\s?Wh/gi)||[]).slice(0,3).join(','), '| Nm:', (text.match(/\d{2,3}\s?Nm/gi)||[]).slice(0,2).join(','));
    console.log(' text:', text.slice(0,220));
  } catch (e) { console.log('\n##', url, 'ERR', e.message.slice(0,80)); }
}
