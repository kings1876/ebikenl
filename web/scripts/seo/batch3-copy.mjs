// Batch 3: keyword-led headings/intro copy for landing pages, homepage and brand pages; removes claims the catalogue cannot back up.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(import.meta.dirname, '..', '..', 'src');
// [old Dutch, new Dutch, new English]
const pairs = [
  // --- Bosch / middenmotor
  ['Krachtig, betrouwbaar en stil. De nummer 1 motorkeuze in Nederland.', 'E-bikes met Bosch middenmotor: de motor zit bij de trapas, wat zorgt voor een natuurlijke trapondersteuning en een laag zwaartepunt.', 'E-bikes with a Bosch mid-drive motor: the motor sits at the cranks, giving natural pedal assistance and a low centre of gravity.'],
  ['Elektrische Fietsen met Bosch Middenmotor', 'Elektrische fiets met middenmotor (Bosch)', 'Electric bike with mid-drive motor (Bosch)'],
  ['Stille en natuurlijke trapondersteuning met 3-sensor technologie', 'Middenmotor bij de trapas: natuurlijke trapondersteuning en een laag zwaartepunt', 'Mid-drive motor at the cranks: natural pedal assistance and a low centre of gravity'],
  ['Actieradius tot 180 km met 750 Wh PowerTube accu', 'Bosch-systemen in verschillende uitvoeringen, zoals Active Line, Performance Line en Cargo Line', 'Bosch systems in several versions, such as Active Line, Performance Line and Cargo Line'],
  ['Compatibel met Bosch Smart System en eBike Flow app', 'Vergelijk accu, motorkoppel en adviesprijs per model', 'Compare battery, motor torque and list price per model'],
  // --- dames / lage instap
  ['Comfortabele lage instap, stabiel frame en veilige balans.', 'Een lage instap maakt op- en afstappen eenvoudig. Vergelijk elektrische damesfietsen op motor, accu en prijs.', 'A low step-through makes getting on and off easy. Compare electric women’s bikes by motor, battery and price.'],
  ['Elektrische Damesfiets met Lage Instap Kopen', 'Elektrische fiets met lage instap kopen', 'Buy an electric bike with a low step-through'],
  ['Moeiteloos op- en afstappen door ruime lage instap', 'Lage instap: gemakkelijk op- en afstappen', 'Low step-through: easy to get on and off'],
  ['Rechtop zittende comfortabele fietshouding', 'Rechtop zitten voor comfort in de stad en op toertochten', 'An upright position for comfort in town and on tours'],
  ['Ideaal voor boodschappen, toertochten en woon-werkverkeer', 'Vergelijk framemaat, motor en accu per model', 'Compare frame size, motor and battery per model'],
  // --- onder 2000
  ['Kwaliteit en A-merk garantie binnen een toegankelijk budget.', 'Nieuwe e-bikes tot €2.000 van onder meer Tenways, Cube en Sushi Bikes.', 'New e-bikes up to €2,000 from Tenways, Cube, Sushi Bikes and more.'],
  ['Nieuwe Elektrische Fietsen onder de €2.000,-', 'Elektrische fiets onder €2.000', 'Electric bike under €2,000'],
  ['Inclusief 2 jaar volledige fabrieksgarantie op accu en motor', 'Adviesprijzen tot €2.000, inclusief BTW', 'List prices up to €2,000, including VAT'],
  ['Prijzen inclusief 21% BTW en rijklaar afmontage', 'Vergelijk motor, accu en gewicht per model', 'Compare motor, battery and weight per model'],
  ['Gunstig te verrekenen via het zakelijk fietsplan (WKR)', 'Let bij een lage prijs op accucapaciteit en motor: die bepalen bereik en kracht', 'With a low price, look at battery capacity and motor: they determine range and power'],
  // --- fietsplan
  ['Tot 40% fiscaal voordeel via je werkgever met het Nationaal Fietsplan.', 'Veel werkgevers bieden een fietsplan. Bekijk hier de e-bikes en bepaal welk model past.', 'Many employers offer a bike plan. See the e-bikes here and decide which model suits you.'],
  ['E-bike via het Fietsplan (WKR) van je Werkgever', 'E-bike kopen via het fietsplan van je werkgever', 'Buy an e-bike through your employer’s bike plan'],
  ['Betaal vanuit je brutoloon en bespaar tot 40% op de aankoopprijs', 'Vraag je werkgever naar de voorwaarden van het fietsplan', 'Ask your employer about the terms of the bike plan'],
  ['Direct geldige WKR-factuur met uitsplitsing van accessoires en slot', 'Voorwaarden en voordeel verschillen per werkgever', 'Terms and benefits differ per employer'],
  ['Geschikt voor alle bekende leasemaatschappijen en fietsplanplatforms', 'Vergelijk modellen en adviesprijzen om je keuze te maken', 'Compare models and list prices to make your choice'],
  // --- speed pedelecs
  ['Snel, emissievrij forenzen. Het slimme alternatief voor de file.', 'Een speed pedelec ondersteunt tot 45 km/u en is bedoeld voor langere woon-werkritten.', 'A speed pedelec assists up to 45 km/h and is meant for longer commutes.'],
  ['Speed Pedelec 45 km/u Kopen | Direct met Kenteken', 'Speed pedelec kopen: e-bike tot 45 km/u', 'Buy a speed pedelec: e-bike up to 45 km/h'],
  ['RDW-geregistreerd geel bromfietskenteken door ons verzorgd', 'Ondersteuning tot 45 km/u (brommerklasse)', 'Assistance up to 45 km/h (moped class)'],
  ['Accu’s tot 1000Wh voor bereik van meer dan 100 km bij 45 km/u', 'Voor een speed pedelec gelden aparte regels: kenteken, verzekering en helmplicht', 'Separate rules apply to a speed pedelec: licence plate, insurance and a helmet requirement'],
  ['Onderhoudsvrije Gates riemaandrijving en Pinion / Enviolo naven', 'Vergelijk motor, accu en gewicht per model', 'Compare motor, battery and weight per model'],
];

const p = path.join(SRC, 'data', 'ebikes.ts');
let s = fs.readFileSync(p, 'utf8');
for (const [o, n] of pairs) {
  const hit = [`'${o}'`, `"${o}"`].find((q) => s.includes(q));
  if (!hit) throw new Error('missing in ebikes.ts: ' + o.slice(0, 60));
  const q = hit[0];
  s = s.split(hit).join(q + n.split(q).join('\\' + q) + q);
}
fs.writeFileSync(p, s);

// homepage strings (tr() keys)
const home = [
  ['Nieuwe E-Bikes van A-Merken.', 'Elektrische fiets kopen:', 'Buy an electric bike:'],
  ['100% Rijklaar Geleverd.', 'nieuwe e-bikes van bekende merken', 'new e-bikes from well-known brands'],
  ['Fietsplan & WKR (tot 40% voordeel)', 'Fietsplan & WKR', 'Bike plan & WKR'],
  ['Onze best beoordeelde modellen', 'Een selectie uit ons assortiment', 'A selection from our range'],
  ['Alleen nieuwe A-merken', 'Alleen nieuwe e-bikes', 'New e-bikes only'],
];
const hp = path.join(SRC, 'views', 'HomePage.tsx');
let h = fs.readFileSync(hp, 'utf8');
for (const [o, n] of home) { if (!h.includes(`"${o}"`)) throw new Error('missing in HomePage: ' + o); h = h.split(`"${o}"`).join(`"${n}"`); }
fs.writeFileSync(hp, h);

const extra = {
  'Modellen (': 'Models (',
  'Prijzen inclusief 21% BTW': 'Prices include 21% VAT',
  'Vergelijk specificaties en adviesprijzen per model': 'Compare specifications and list prices per model',
};
const enPath = path.join(SRC, 'i18n', 'en.json');
const dict = JSON.parse(fs.readFileSync(enPath, 'utf8'));
for (const [, n, e] of [...pairs, ...home]) dict[n] = e;
for (const [k, v] of Object.entries(extra)) dict[k] = v;
fs.writeFileSync(enPath, JSON.stringify(dict, null, 2) + '\n');
console.log('ok', pairs.length, 'landing +', home.length, 'home strings');
