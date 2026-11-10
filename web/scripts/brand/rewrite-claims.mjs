// One-off: replace unsupported "official distributor" claims with copy that matches the real catalogue (NL source + EN dictionary).
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(import.meta.dirname, '..', '..', 'src');
const pairs = [
  ['De officiële online speciaalzaak van Nederland. Exclusieve nieuwe elektrische fietsen van Gazelle, Batavus, Cube, Stromer en Riese & Müller direct via de distributeur.',
    'Nieuwe elektrische fietsen van onder meer Cube, Giant, Scott, Specialized en Kalkhoff. Vergelijk modellen, specificaties en adviesprijzen op één plek.',
    'New electric bikes from Cube, Giant, Scott, Specialized, Kalkhoff and more. Compare models, specifications and list prices in one place.'],
  ['Distributeur Voorraad', 'Nieuw in het assortiment', 'New in the range'],
  ['Gazelle, Stromer, Cube, Riese & Müller direct leverbaar', 'Cube, Giant, Scott, Specialized en Kalkhoff', 'Cube, Giant, Scott, Specialized and Kalkhoff'],
  ['Inclusief 100% rijklaar afstelling aan huis door gediplomeerd fietsmonteur', 'Vergelijk specificaties en adviesprijzen per model', 'Compare specifications and list prices per model'],
  ['Officiële distributiekanalen met volledige fabrieksgarantie op frame, motor en accu.', 'Uitsluitend nieuwe e-bikes van bekende merken, met de fabrieksgarantie van de fabrikant.', "Only new e-bikes from well-known brands, with the manufacturer's warranty."],
  ['De grootste online e-bike speciaalzaak van Nederland. Uitsluitend nieuwe elektrische fietsen van toonaangevende A-merken via officiële distributiekanalen.', 'Online e-bike webwinkel met uitsluitend nieuwe elektrische fietsen van bekende merken. Modellen, specificaties en adviesprijzen overzichtelijk bij elkaar.', 'Online e-bike shop with new electric bikes only, from well-known brands. Models, specifications and list prices in one place.'],
  ['Officiële Distributiepartner', 'Merk', 'Brand'],
  ['e-bikes met officiële fabrieksgarantie. Elke fiets wordt 100% rijklaar afgemonteerd en gratis thuisbezorgd door onze eigen vakkundige monteurs.', 'e-bikes. Alle modellen zijn nieuw en worden met de fabrieksgarantie van de fabrikant geleverd.', "e-bikes. All models are new and come with the manufacturer's warranty."],
  ['Het gezochte e-bike merk is niet opgenomen in ons distributeursassortiment.', 'Het gezochte e-bike merk is niet opgenomen in ons assortiment.', 'The e-bike brand you are looking for is not in our range.'],
  ['modellen ingeladen vanuit de centrale distributeur database.', 'modellen toegevoegd.', 'models are being added.'],
];

for (const f of ['views/HomePage.tsx', 'views/BrandPage.tsx', 'components/SiteShell.tsx']) {
  const p = path.join(SRC, f);
  let s = fs.readFileSync(p, 'utf8');
  for (const [o, n] of pairs) s = s.split(`"${o}"`).join(`"${n}"`);
  if (f === 'views/BrandPage.tsx') {
    s = s.replace('<span>{tr("Tot 10 jaar")} {tr(matchedBrand)} {tr("framegarantie")}</span>', '<span>{tr("Fabrieksgarantie van de fabrikant")}</span>');
  }
  fs.writeFileSync(p, s);
}
for (const f of ['app/(nl)/merk/[brandSlug]/page.tsx', 'app/en/merk/[brandSlug]/page.tsx']) {
  const p = path.join(SRC, f);
  const s = fs.readFileSync(p, 'utf8').replace('Nieuwe {brand} e-bikes via de officiële distributeur, met fabrieksgarantie en snelle levering.', 'Nieuwe {brand} e-bikes met fabrieksgarantie en snelle levering.');
  fs.writeFileSync(p, s);
}

const enPath = path.join(SRC, 'i18n', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const map = new Map(pairs.map(([o, n, e]) => [o, [n, e]]));
const out = {};
for (const [k, v] of Object.entries(en)) {
  if (map.has(k)) { const [n, e] = map.get(k); out[n] = e; } else out[k] = v;
}
for (const [o, [n, e]] of map) if (!(n in out)) out[n] = e; // keys that had no entry yet
out['Fabrieksgarantie van de fabrikant'] = "Manufacturer's warranty";
fs.writeFileSync(enPath, JSON.stringify(out, null, 2) + '\n');
console.log('done');
