// Batch 1: landing-page title/description lengths + English dictionary entries for every new string added in this batch.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(import.meta.dirname, '..', '..', 'src');
// [old Dutch (in ebikes.ts), new Dutch, new English]
const landing = [
  ['Elektrische fiets met lage instap | Damesfiets | E-BIKE-TEKOOP.NL', 'Elektrische fiets met lage instap | E-BIKE-TEKOOP.NL', 'Low step-through electric bike | E-BIKE-TEKOOP.NL'],
  ['Elektrische fiets onder €2.000 | Betaalbare e-bikes | E-BIKE-TEKOOP.NL', 'Elektrische fiets onder €2.000 | E-BIKE-TEKOOP.NL', 'Electric bike under €2,000 | E-BIKE-TEKOOP.NL'],
  ['Nieuwe elektrische fietsen tot €2.000 van onder meer Tenways, Cube en Sushi Bikes. Bekijk modellen en adviesprijzen.', 'Nieuwe elektrische fietsen tot €2.000 van onder meer Tenways, Cube en Sushi Bikes. Vergelijk motor, accu en adviesprijs per model.', 'New electric bikes up to €2,000 from Tenways, Cube, Sushi Bikes and more. Compare motor, battery and list price per model.'],
  ['E-bike via fietsplan van je werkgever | E-BIKE-TEKOOP.NL', 'E-bike via fietsplan van je werkgever | E-BIKE-TEKOOP.NL', "E-bike through your employer's bike plan | E-BIKE-TEKOOP.NL"],
  ['Een nieuwe elektrische fiets kopen via het fietsplan van je werkgever? Bekijk het aanbod en vergelijk modellen en adviesprijzen.', 'Een nieuwe elektrische fiets kopen via het fietsplan van je werkgever? Bekijk het aanbod en vergelijk modellen, motoren en adviesprijzen.', "Buying a new electric bike through your employer's bike plan? See the range and compare models, motors and list prices."],
  ['Speed pedelec kopen | Snelle e-bikes tot 45 km/u | E-BIKE-TEKOOP.NL', 'Speed pedelec kopen: e-bike tot 45 km/u | E-BIKE-TEKOOP.NL', 'Buy a speed pedelec, up to 45 km/h | E-BIKE-TEKOOP.NL'],
  ['Speed pedelecs met motorondersteuning tot 45 km/u, onder meer van Stromer en Cube. Bekijk modellen en specificaties.', 'Speed pedelecs met motorondersteuning tot 45 km/u, onder meer van Stromer en Cube. Vergelijk motor, accu en adviesprijs per model.', 'Speed pedelecs with motor assistance up to 45 km/h, from Stromer and Cube among others. Compare motor, battery and list price per model.'],
];
const p = path.join(SRC, 'data', 'ebikes.ts');
let s = fs.readFileSync(p, 'utf8');
for (const [o, n] of landing) { if (!s.includes(`'${o}'`)) throw new Error('missing in ebikes.ts: ' + o.slice(0, 50)); s = s.split(`'${o}'`).join(`'${n}'`); }
fs.writeFileSync(p, s);

// new English strings (Dutch source text -> English)
const en = {
  'Elektrische fiets kopen: nieuwe e-bikes': 'Buy an electric bike: new e-bikes',
  'Subcategorieën': 'Subcategories',
  'foto': 'photo',
  'Bekijk alle {brand} e-bikes op één plek: vergelijk modellen, specificaties en adviesprijzen. Nieuw, met de fabrieksgarantie van de fabrikant.': "See all {brand} e-bikes in one place: compare models, specifications and list prices. New, with the manufacturer's warranty.",
  'Elektrische stadsfiets kopen': 'Buy an electric city bike',
  'Elektrische stadsfietsen voor woon-werkverkeer en dagelijks gebruik, vaak met lage instap en middenmotor. Vergelijk modellen en adviesprijzen.': 'Electric city bikes for commuting and everyday use, often with a low step-through and mid-drive motor. Compare models and list prices.',
  'Een elektrische stadsfiets is gemaakt voor dagelijks gebruik: naar je werk, de winkel of de trein. Veel modellen hebben een lage instap, een middenmotor en ruime accu. Vergelijk hieronder stads e-bikes op motor, accucapaciteit en adviesprijs.': 'An electric city bike is made for everyday use: to work, to the shops or to the train. Many models have a low step-through, a mid-drive motor and a large battery. Compare city e-bikes below by motor, battery capacity and list price.',
  'Elektrische trekkingfiets kopen': 'Buy an electric trekking bike',
  'Elektrische trekkingfietsen voor lange ritten en stoere tochten, met middenmotor en grote accu. Vergelijk modellen, specificaties en adviesprijzen.': 'Electric trekking bikes for long rides and rugged tours, with a mid-drive motor and large battery. Compare models, specifications and list prices.',
  'Een elektrische trekkingfiets combineert comfort met bereik. Met een stevig frame, een grote accu en vaak een middenmotor ben je zowel op de weg als op fietspaden klaar voor langere ritten. Vergelijk trekking e-bikes op accucapaciteit, motor en gewicht.': 'An electric trekking bike combines comfort with range. With a sturdy frame, a large battery and often a mid-drive motor, you are ready for longer rides on roads and cycle paths. Compare trekking e-bikes by battery capacity, motor and weight.',
  'E-MTB kopen: elektrische mountainbike': 'Buy an e-MTB: electric mountain bike',
  'Elektrische mountainbikes (e-MTB) met sterke middenmotor en grote accu, van hardtail tot fully. Vergelijk modellen, specificaties en adviesprijzen.': 'Electric mountain bikes (e-MTB) with a strong mid-drive motor and large battery, from hardtail to full suspension. Compare models, specifications and list prices.',
  'E-MTB kopen: elektrische mountainbikes': 'Buy an e-MTB: electric mountain bikes',
  'Met een e-MTB rijd je verder en steiler. Deze elektrische mountainbikes hebben een sterke middenmotor, een grote accu en vering voor ruw terrein, van hardtail tot fully. Vergelijk e-mountainbikes op motor, accu, gewicht en adviesprijs.': 'With an e-MTB you ride further and steeper. These electric mountain bikes have a strong mid-drive motor, a large battery and suspension for rough terrain, from hardtail to full suspension. Compare e-mountain bikes by motor, battery, weight and list price.',
  'Elektrische racefiets en gravel e-bike': 'Electric road bike and gravel e-bike',
  'Elektrische racefietsen en gravel e-bikes met lichte motor voor sportieve ritten. Vergelijk modellen, gewicht, accu en adviesprijzen.': 'Electric road bikes and gravel e-bikes with a light motor for sporty rides. Compare models, weight, battery and list prices.',
  'Elektrische racefiets en gravel e-bike kopen': 'Buy an electric road bike or gravel e-bike',
  'Een elektrische racefiets of gravel e-bike geeft sportieve ondersteuning zonder het gewicht van een stadsfiets. De motoren zijn compact, de accu is vaak geïntegreerd in het frame. Vergelijk modellen op gewicht, accucapaciteit en adviesprijs.': 'An electric road bike or gravel e-bike gives sporty assistance without the weight of a city bike. The motors are compact and the battery is often built into the frame. Compare models by weight, battery capacity and list price.',
  'Elektrische vouwfiets kopen': 'Buy an electric folding bike',
  'Opvouwbare elektrische fietsen, licht en compact voor trein, auto en kleine woningen. Vergelijk elektrische vouwfietsen op gewicht en prijs.': 'Foldable electric bikes, light and compact for the train, the car and small homes. Compare electric folding bikes by weight and price.',
  'Een opvouwbare elektrische fiets neem je eenvoudig mee in de trein of de auto en past in een kleine woning. Let bij het kiezen op gewicht, wielmaat en accucapaciteit. Vergelijk hieronder elektrische vouwfietsen.': 'A foldable electric bike is easy to take on the train or in the car and fits in a small home. When choosing, look at weight, wheel size and battery capacity. Compare electric folding bikes below.',
  'Elektrische bakfiets kopen': 'Buy an electric cargo bike',
  'Elektrische bakfietsen en longtails voor kinderen, boodschappen en vervoer. Vergelijk modellen op motor, accu, laadvermogen en adviesprijs.': 'Electric cargo bikes and longtails for children, groceries and transport. Compare models by motor, battery, load capacity and list price.',
  'Een elektrische bakfiets of longtail vervoert kinderen, boodschappen en bagage zonder dat je er moe van wordt. De motor helpt bij het optrekken en bij tegenwind. Vergelijk bakfietsen op motor, accucapaciteit en maximaal laadvermogen.': 'An electric cargo bike or longtail carries children, groceries and luggage without wearing you out. The motor helps when pulling away and against the wind. Compare cargo bikes by motor, battery capacity and maximum load.',
  'Elektrische fiets voor kinderen': 'Electric bike for children',
  'Elektrische fietsen voor kinderen en jongeren, in kleinere maten. Vergelijk modellen, accu en adviesprijzen en vind een passende e-bike.': 'Electric bikes for children and teenagers, in smaller sizes. Compare models, battery and list prices and find a suitable e-bike.',
  'Elektrische fiets voor kinderen en jongeren': 'Electric bike for children and teenagers',
  'Een elektrische fiets voor kinderen en jongeren heeft een lager frame en kleinere wielen. Let op de toegestane leeftijd, de motorondersteuning en het gewicht. Vergelijk de beschikbare modellen hieronder.': 'An electric bike for children and teenagers has a lower frame and smaller wheels. Check the permitted age, the motor assistance and the weight. Compare the available models below.',
  'Vergelijk nieuwe elektrische fietsen: stads-, trekking-, mountain-, vouw- en bakfietsen, met middenmotor of lichte motor. Filter op merk, motor, accucapaciteit en prijs en bekijk per model de specificaties en adviesprijs.': 'Compare new electric bikes: city, trekking, mountain, folding and cargo bikes, with mid-drive or light motors. Filter by brand, motor, battery capacity and price and see the specifications and list price per model.',
};

const enPath = path.join(SRC, 'i18n', 'en.json');
const dict = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const map = new Map(landing.map(([o, n, e]) => [o, [n, e]]));
const out = {};
for (const [k, v] of Object.entries(dict)) { if (map.has(k)) { const [n, e] = map.get(k); out[n] = e; } else out[k] = v; }
for (const [, [n, e]] of map) out[n] = e;
for (const [k, v] of Object.entries(en)) out[k] = v;
fs.writeFileSync(enPath, JSON.stringify(out, null, 2) + '\n');
console.log('ok');
