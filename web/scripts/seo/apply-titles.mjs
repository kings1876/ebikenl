// One-off: apply keyword-based titles/descriptions (see seo/KEYWORD-PLAN.md) to the source files and the English dictionary.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(import.meta.dirname, '..', '..', 'src');
// [old Dutch, new Dutch, new English]
const pairs = [
  ['E-BIKE-TEKOOP.NL | Nieuwe elektrische fietsen van A-merken', 'Elektrische fiets kopen | Nieuwe e-bikes van Cube, Giant, Scott', 'Buy an electric bike | New e-bikes from Cube, Giant, Scott'],
  ['Nieuwe elektrische fietsen van A-merken met fabrieksgarantie en snelle levering. Betaal met iDEAL, bankoverschrijving of crypto.', 'Vergelijk nieuwe elektrische fietsen van Cube, Giant, Scott, Specialized en Kalkhoff. Bekijk modellen, specificaties en adviesprijzen op één plek.', 'Compare new electric bikes from Cube, Giant, Scott, Specialized and Kalkhoff. See models, specifications and list prices in one place.'],
  ['Elektrische fietsen kopen', 'Elektrische fiets kopen: nieuwe e-bikes vergelijken', 'Buy an electric bike: compare new e-bikes'],
  ['Nieuwe elektrische fietsen van A-merken: stads-, trekking-, mountain-, vouw- en bakfietsen met fabrieksgarantie.', 'Beste elektrische fietsen op een rij: stads-, trekking-, mountain-, vouw- en bakfietsen, ook met middenmotor. Vergelijk modellen en adviesprijzen.', 'The best electric bikes at a glance: city, trekking, mountain, folding and cargo bikes, including mid-motor models. Compare models and list prices.'],
  ['{brand} elektrische fietsen kopen', '{brand} elektrische fiets kopen', 'Buy a {brand} electric bike'],
  ['Nieuwe {brand} e-bikes met fabrieksgarantie en snelle levering.', 'Bekijk alle {brand} e-bikes: modellen, specificaties en adviesprijzen. Nieuw en met fabrieksgarantie.', 'See all {brand} e-bikes: models, specifications and list prices. New, with manufacturer warranty.'],
  ['Bosch Middenmotor E-bike Kopen | E-BIKE-TEKOOP.NL', 'Elektrische fiets met middenmotor (Bosch) | E-BIKE-TEKOOP.NL', 'Electric bike with mid-drive motor (Bosch) | E-BIKE-TEKOOP.NL'],
  ['Bekijk ons ruime assortiment elektrische fietsen met Bosch Performance, Cargo en Active Line middenmotor. Direct uit voorraad leverbaar met fabrieksgarantie.', 'E-bikes met Bosch middenmotor van onder meer Cube, Kalkhoff, Scott en Winora. Vergelijk motor, accu en adviesprijs per model.', 'E-bikes with a Bosch mid-drive motor from Cube, Kalkhoff, Scott, Winora and more. Compare motor, battery and list price per model.'],
  ['Elektrische Damesfiets Kopen | Lage Instap | E-BIKE-TEKOOP.NL', 'Elektrische fiets met lage instap | Damesfiets | E-BIKE-TEKOOP.NL', 'Electric bike with low step-through | Women\'s bike | E-BIKE-TEKOOP.NL'],
  ['Vind de ideale elektrische damesfiets met lage instap van topmerken als Gazelle, Batavus en Koga. 100% rijklaar bezorgd aan huis.', 'Elektrische damesfietsen met lage instap van onder meer Cube, Winora, Batavus en Specialized. Vergelijk modellen en adviesprijzen.', 'Electric women\'s bikes with a low step-through from Cube, Winora, Batavus, Specialized and more. Compare models and list prices.'],
  ['Elektrische Fiets onder €2000 | Aanbiedingen | E-BIKE-TEKOOP.NL', 'Elektrische fiets onder €2.000 | Betaalbare e-bikes | E-BIKE-TEKOOP.NL', 'Electric bike under €2,000 | Affordable e-bikes | E-BIKE-TEKOOP.NL'],
  ['Betaalbare nieuwe A-merk e-bikes onder €2.000 met volle fabrieksgarantie. Betaal eenvoudig met iDEAL, bankoverschrijving of crypto.', 'Nieuwe elektrische fietsen tot €2.000 van onder meer Tenways, Cube en Sushi Bikes. Bekijk modellen en adviesprijzen.', 'New electric bikes up to €2,000 from Tenways, Cube, Sushi Bikes and more. See models and list prices.'],
  ['E-bike via Fietsplan Kopen | Tot 40% Belastingvoordeel | E-BIKE-TEKOOP.NL', 'E-bike via fietsplan van je werkgever | E-BIKE-TEKOOP.NL', 'E-bike through your employer\'s bike plan | E-BIKE-TEKOOP.NL'],
  ['Koop een nieuwe elektrische fiets met belastingvoordeel via je werkgever. E-BIKE-TEKOOP.NL levert officiële WKR-facturen en FiscFree / Hellorider ondersteuning.', 'Een nieuwe elektrische fiets kopen via het fietsplan van je werkgever? Bekijk het aanbod en vergelijk modellen en adviesprijzen.', 'Buying a new electric bike through your employer\'s bike plan? See the range and compare models and list prices.'],
  ['Speed Pedelecs 45 km/u | Stromer & Riese Müller | E-BIKE-TEKOOP.NL', 'Speed pedelec kopen | Snelle e-bikes tot 45 km/u | E-BIKE-TEKOOP.NL', 'Buy a speed pedelec | Fast e-bikes up to 45 km/h | E-BIKE-TEKOOP.NL'],
  ['Ervaar ultieme snelheid met onze 45 km/u speed pedelecs van Stromer en Riese & Müller. Inclusief kentekenregistratie en RDW-keuring.', 'Speed pedelecs met motorondersteuning tot 45 km/u, onder meer van Stromer en Cube. Bekijk modellen en specificaties.', 'Speed pedelecs with motor assistance up to 45 km/h, from Stromer and Cube among others. See models and specifications.'],
];

const files = ['app/(nl)/page.tsx', 'app/en/page.tsx', 'lib/seo.ts', 'data/ebikes.ts', 'app/(nl)/merk/[brandSlug]/page.tsx', 'app/en/merk/[brandSlug]/page.tsx'];
const unused = new Set(pairs.map((p) => p[0]));
for (const f of files) {
  const p = path.join(SRC, f);
  let s = fs.readFileSync(p, 'utf8');
  for (const [o, n] of pairs) {
    for (const q of ["'", '"']) {
      const from = q + o + q;
      if (s.includes(from)) { s = s.split(from).join(q + n.replace(new RegExp(q, 'g'), '\\' + q) + q); unused.delete(o); }
    }
  }
  if (f.includes('merk')) s = s.replace("tx('nl', s).replace('{brand}', brand)", "tx('nl', s).replace(/\\{brand\\}/g, brand)").replace("tx('en', s).replace('{brand}', brand)", "tx('en', s).replace(/\\{brand\\}/g, brand)");
  fs.writeFileSync(p, s);
}
if (unused.size) console.log('not found in sources:', [...unused].map((x) => x.slice(0, 40)));

const enPath = path.join(SRC, 'i18n', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const map = new Map(pairs.map(([o, n, e]) => [o, [n, e]]));
const out = {};
for (const [k, v] of Object.entries(en)) { if (map.has(k)) { const [n, e] = map.get(k); out[n] = e; } else out[k] = v; }
for (const [, [n, e]] of map) if (!(n in out)) out[n] = e;
fs.writeFileSync(enPath, JSON.stringify(out, null, 2) + '\n');
console.log('done');
