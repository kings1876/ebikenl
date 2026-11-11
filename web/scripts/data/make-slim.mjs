// Build src/data/catalog-slim.json: only the fields listing, filter, cart and compare views need.
// The full catalogue (descriptions, specs, galleries) stays server-side so it is not shipped in every page's JavaScript.
import fs from 'node:fs';
import path from 'node:path';

const DATA = path.resolve(import.meta.dirname, '..', '..', 'src', 'data');
const KEYS = ['id', 'slug', 'title', 'brand', 'model', 'category', 'subCategory', 'price', 'originalPrice', 'image', 'tags', 'rating', 'reviewCount',
  'doelgroep', 'motorpositie', 'motormerk', 'motorModel', 'motorTorqueNm', 'accucapaciteit', 'accuWhNumber', 'actieradius', 'aandrijving', 'remtype',
  'versnellingDetail', 'wielmaat', 'gewichtKg', 'maximaleSnelheid', 'opvouwbaar', 'leverbaarheid', 'maxGebruikersgewicht', 'warranty', 'framematen', 'kleuren', 'en15194Certified'];

const full = JSON.parse(fs.readFileSync(path.join(DATA, 'catalog.json'), 'utf8'));
const slim = full.map((p) => Object.fromEntries(KEYS.filter((k) => p[k] !== undefined).map((k) => [k, p[k]])));
fs.writeFileSync(path.join(DATA, 'catalog-slim.json'), JSON.stringify(slim));
console.log(`catalog-slim.json: ${slim.length} products, ${(JSON.stringify(slim).length / 1024).toFixed(0)} KB (full: ${(JSON.stringify(full).length / 1024).toFixed(0)} KB)`);
