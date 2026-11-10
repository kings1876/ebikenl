// Turn the facts read from e-bikes-zuverkaufen.ch into the common record shape used by build-catalog.mjs.
// Prices: Swiss list price in CHF, converted to EUR with the ECB reference rate (recorded per product).
import fs from 'node:fs';
import path from 'node:path';
import { writeJson } from './lib.mjs';

const RAW = process.env.RAW;
const FX = { date: '2026-11-10', chfPerEur: 0.9203 }; // ECB euro foreign exchange reference rate, 10 Nov 2026
const SKIP_BRANDS = new Set(['Giant', 'Haibike']); // already imported straight from the manufacturers
const CATEGORY = {
  'e-citybikes': 'Stadsfietsen',
  'e-trekkingbikes': 'Trekkingfietsen',
  'e-mountainbikes': 'Elektrische mountainbikes',
  'e-rennvelos-gravel': 'Gravel & racefietsen',
  'e-lastenvelos': 'Bakfietsen',
  'schnelle-e-bikes': 'Speed pedelecs',
  'e-faltvelos': 'Vouwfietsen',
  'e-bikes-jugend': 'Kinder- & jongerenfietsen',
};

const clean = (s) => {
  const v = (s || '').replace(/\s+/g, ' ').trim();
  return !v || /^(-|–|nicht angegeben)$/i.test(v) ? '' : v;
};
const dedupeBrand = (s, brand) => s.replace(new RegExp(`^(${brand}\\s+)+`, 'i'), '');
const nl = (s) =>
  s
    .replace(/Scheiben?bremsen?|Scheibe|Scheiben/gi, 'schijfrem')
    .replace(/hydraulisch/gi, 'hydraulische')
    .replace(/Nabenschaltung/gi, 'naafschakeling')
    .replace(/Gang\b|-fach\b/gi, '-speed');

const raw = JSON.parse(fs.readFileSync(path.join(RAW, 'zuverkaufen-raw.json'), 'utf8'));
const out = [];
for (const r of raw) {
  if (SKIP_BRANDS.has(r.brand) || !r.priceChf || r.images.length < 2) continue;
  const category = CATEGORY[r.seg[1]];
  if (!category) continue;
  const name = dedupeBrand(r.name, r.brand).trim();
  const specs = {};
  let motor = clean(r.raw['Motor & Antrieb']).replace(/\(\s*-?\s*\)/g, '').trim();
  motor = dedupeBrand(motor, r.brand);
  motor = motor.replace(/\(\s*(\d{2,3})\s?Nm\s*\)\s*$/i, ', $1 Nm').replace(/\s+,/g, ',').trim();
  if (!/\d\s?Nm/i.test(motor) && r.torqueNm) motor += `, ${r.torqueNm} Nm`;
  if (motor) specs.Motor = motor;
  const wh = clean(r.raw['Akkukapazität']);
  if (/\d/.test(wh)) specs.Accu = wh;
  const gears = clean(r.raw['Schaltung']);
  if (gears) specs.Versnelling = nl(gears);
  const brakes = clean(r.raw['Bremsanlage']);
  if (brakes) specs.Remmen = nl(brakes);
  const kg = clean(r.raw['Gewicht']);
  if (/\d/.test(kg)) specs.Gewicht = kg;
  const sizes = clean(r.raw['Lieferbare Rahmengrössen']);
  if (sizes) specs.Maten = sizes;
  const [mat, shape] = clean(r.raw['Rahmenmaterial & Form']).split('·').map((s) => clean(s));
  if (mat) specs.Frame = mat.replace(/Aluminium/i, 'Aluminium').replace(/Carbon/i, 'Carbon');
  const fork = clean(r.raw['Federgabel / Dämpfung']);
  if (fork) specs.Voorvork = fork;
  const doel = /diamant/i.test(shape || '') ? 'Heren (diamant)' : /tiefein|wave|city/i.test(shape || '') ? 'Dames (lage instap)' : /trapez/i.test(shape || '') ? 'Unisex (middeninstap)' : undefined;
  const eur = Math.round((r.priceChf / FX.chfPerEur) / 10) * 10;
  out.push({
    brand: r.brand,
    url: r.url,
    name,
    category,
    shape: doel,
    price: eur,
    priceChf: r.priceChf,
    fx: FX,
    priceSource: 'Zwitserse adviesprijs (CHF) omgerekend met de ECB-koers',
    priceNote: `Indicatieve prijs: Zwitserse adviesprijs CHF ${r.priceChf.toLocaleString('nl-NL')} omgerekend naar euro (ECB-koers ${FX.chfPerEur} CHF per EUR, ${FX.date}). De Nederlandse adviesprijs kan afwijken; wij bevestigen de definitieve prijs voor je bestelt.`,
    maxSpeed: r.seg[1] === 'schnelle-e-bikes' ? '45 km/u' : '25 km/u',
    specs,
    images: r.images,
    handle: r.seg[2].replace(new RegExp(`^${r.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-`), ''),
    year: r.year,
  });
}
writeJson(path.join(RAW, 'zuverkaufen.json'), out);
const by = {};
out.forEach((x) => (by[x.brand] = (by[x.brand] || 0) + 1));
console.log('records', out.length, by);
