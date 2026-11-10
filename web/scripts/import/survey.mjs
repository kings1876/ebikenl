// Which manufacturer sites may we read, and where are their product lists? (read-only survey)
import { getRobots, isAllowed, sitemapUrls } from './lib.mjs';

const SITES = {
  gazelle: 'https://www.gazelle.nl',
  batavus: 'https://www.batavus.nl',
  sparta: 'https://www.sparta.nl',
  koga: 'https://www.koga.com',
  cube: 'https://www.cube.eu',
  cortina: 'https://cortinabikes.com',
  giant: 'https://www.giant-bicycles.com',
  trek: 'https://www.trekbikes.com',
  specialized: 'https://www.specialized.com',
  rm: 'https://www.r-m.de',
  rm2: 'https://www.riese-muller.com',
  stromer: 'https://www.stromerbike.com',
  qwic: 'https://qwic.com',
  brompton: 'https://www.brompton.com',
  babboe: 'https://www.babboe.nl',
  urbanarrow: 'https://www.urbanarrow.com',
  haibike: 'https://www.haibike.com',
  cannondale: 'https://www.cannondale.com',
  scott: 'https://www.scott-sports.com',
  bergamont: 'https://www.bergamont.com',
  kalkhoff: 'https://www.kalkhoff-bikes.com',
  raleigh: 'https://www.raleigh.nl',
  veloretti: 'https://veloretti.com',
};

for (const [name, origin] of Object.entries(SITES)) {
  const r = await getRobots(origin);
  const root = await isAllowed(origin + '/').catch(() => false);
  let sm = '';
  const first = r.sitemaps[0];
  if (first && root) {
    try {
      const urls = await sitemapUrls(first);
      sm = `${urls.length} urls`;
    } catch (e) {
      sm = 'sitemap err ' + String(e.message).slice(0, 40);
    }
  }
  console.log(name.padEnd(11), 'robots', String(r.status || r.error?.slice(0, 20)).padEnd(4), 'root-allowed', root, '| sitemaps', r.sitemaps.length, sm);
}
