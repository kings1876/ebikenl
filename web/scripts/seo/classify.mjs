// Classify Semrush keywords (NL, KD < 26) against what the shop actually sells and map them to a target page.
// Input: JSON files of {kw,intent,vol,kd,cpc,sf,results} rows. Output: CSV + cluster summary (JSON).
import fs from 'node:fs';
import path from 'node:path';

const IN = process.argv[2];
const OUT = process.argv[3];
const catalog = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '..', '..', 'src', 'data', 'catalog.json'), 'utf8'));
const carried = [...new Set(catalog.map((p) => p.brand))];

const rows = new Map();
for (const f of fs.readdirSync(IN).filter((f) => f.startsWith('seed_'))) {
  for (const r of JSON.parse(fs.readFileSync(path.join(IN, f), 'utf8'))) if (!rows.has(r.kw)) rows.set(r.kw, r);
}

const slug = (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const brandAlias = { 'Riese & Müller': ['riese', 'müller', 'muller'], 'Sushi Bikes': ['sushi'] };
const carriedMatch = (kw) => carried.find((b) => (brandAlias[b] || [b.toLowerCase()]).some((a) => new RegExp(`(^|[^a-z])${a}([^a-z]|$)`).test(kw)));
// brands people search for that the shop does not sell: never target these
const NOT_CARRIED = /\b(sparta|gazelle|koga|qwic|vogue|altec|popal|flyer|rih|batavus-?x|cortina|union|stella|amslod|veloretti|babboe|urban arrow|brompton|vanmoof|cowboy|lidl|aldi|decathlon|action|hema|blokker|bol|coolblue|fietsenwinkel|mifa|prophete|fischer|rixe|sunrace|ebike|knaap|union|montego|pegasus|oxford|multicycle|fuell|fatbike|swapfiets|swap)\b/;
// intents or products the shop does not serve
const OFF = /\b(huren|verhuur|lease|leasen|leasing|tweedehands|tweede hand|gebruikt|marktplaats|occasion|reparatie|repareren|storing|foutcode|conversie|conversiekit|ombouw|ombouwset|omvormen|accu|oplader|fietsendrager|drager|fietstas|fietstassen|kinderzitje|zitje|helm|slot|verzekering|belasting|subsidie|kopen op afbetaling|afbetaling|gratis|friesland|groningen|drenthe|amsterdam|rotterdam|utrecht|den haag|eindhoven|breda|tilburg|nijmegen|apeldoorn|zwolle|limburg|brabant|belgi|duitsland|test|review|ervaring|vergelijk|onderdelen|banden|remmen|ketting|verlichting|spatbord|stuur|zadel|pedalen|ruilen|inruilen|verkopen|driewieler|wieler|wielen|gashendel|display|helmplicht|termijnen|betalen|fietsmand|mand|fietsstoel|fietsstoeltje|stoeltje|achterzitje|kinderzit|kinderzitjes|opladen|ombouwen|vervangen|batterij|verzekeren|bandenspanning|trein|terugtraprem|hond|wat betekent|wat is|hoe werkt|hoe lang|hoeveel|kilometer per uur|snelheid regelen|opvoeren|tunen|chip)\b/;

const CLUSTERS = [
  ['Merkpagina (geleverd merk)', null],
  ['Speed pedelec / 45 km/u', /speed pedelec|snelle e-?bike|snelle elektrische|45 km|s-pedelec|snelle fiets/],
  ['Bakfiets / cargo', /bakfiets|cargo|longtail/],
  ['Vouwfiets', /vouw|opvouw|faltrad|klapfiets/],
  ['Mountainbike / MTB', /mountainbike|mtb|fully|hardtail|all mountain|e-?mtb/],
  ['Gravel / racefiets', /gravel|racefiets|racer|race/],
  ['Trekkingfiets', /trekking|toerfiets|tour|toer/],
  ['Dames / lage instap', /dames|lage instap|laag instap|instap|damesfiets/],
  ['Heren', /heren|herenfiets/],
  ['Kinderen / jeugd', /kinder|jeugd|jongens|meisjes|tiener/],
  ['Middenmotor / Bosch', /middenmotor|bosch|shimano|yamaha|motor/],
  ['Goedkoop / budget', /goedkope|goedkoop|voordelig|betaalbaar|budget|onder \d|tot \d|aanbieding|actie|sale/],
  ['Lichtgewicht / compact', /lichtgewicht|licht |lichte|compact|kleine|klein|opvouw/],
  ['Algemeen / "beste" / koopintentie', /beste|kopen|koop|top ?\d|e-?bikes?$|elektrische fietsen?$|elektrische fiets|e-?bike|ebike/],
];
const TARGET = {
  'Speed pedelec / 45 km/u': '/speed-pedelecs',
  'Bakfiets / cargo': '/categorie/elektrische-fietsen?sub=Bakfietsen',
  'Vouwfiets': '/categorie/elektrische-fietsen?sub=Vouwfietsen',
  'Mountainbike / MTB': '/categorie/elektrische-fietsen?sub=Elektrische mountainbikes',
  'Gravel / racefiets': '/categorie/elektrische-fietsen?sub=Gravel & racefietsen',
  'Trekkingfiets': '/categorie/elektrische-fietsen?sub=Trekkingfietsen',
  'Dames / lage instap': '/elektrische-damesfiets',
  'Heren': '/categorie/elektrische-fietsen',
  'Kinderen / jeugd': '/categorie/elektrische-fietsen?sub=Kinder- & jongerenfietsen',
  'Middenmotor / Bosch': '/bosch-middenmotor',
  'Goedkoop / budget': '/e-bike-onder-2000',
  'Lichtgewicht / compact': '/categorie/elektrische-fietsen',
  'Algemeen / "beste" / koopintentie': '/categorie/elektrische-fietsen',
};

// Words that describe the bikes we sell. A keyword with any other word in it is probably a brand we do not carry, a part, or an unrelated intent.
const GENERIC = new Set('e bike bikes ebike ebikes elektrische elektrisch elektrisch-e fiets fietsen elektrofiets pedelec met voor de het een en of te in op zonder vanaf van naar'.split(' '));
const ALLOW = new Set('beste top kopen koop online nieuw nieuwe goedkope goedkoop voordelig voordelige aanbieding sale betaalbare lichte lichtgewicht kleine compact compacte stevige sportieve comfortabele moderne stijlvolle mooie snelle sterke dames heren kinderen kinder jongens meisjes tiener jeugd lage laag instap hoge middenmotor voorwielmotor achterwielmotor motor bosch shimano yamaha mountainbike mountainbikes mtb gravel race racefiets racefietsen trekking toer toerfiets vouw vouwfiets opvouwbare opvouwbaar bakfiets bakfietsen cargo speed pedelec riemaandrijving riem hydraulische schijfremmen schijfrem naafschakeling versnellingen ouderen senioren zware mensen grote groot lange maat euro onder tot dubbele enkele stad stads stadsfiets trekkingfiets heren damesfiets herenfiets stadsfietsen trekkingfietsen all-road allroad nederland nederlandse nieuwe 2025 2026 2027 accu wh km nm sportief mini klein goedkoopste lichtste stoere hippe roze zwart wit inch kind kinderfiets longtail outlet merken best getest welke past bij mij gewicht actieradius watt km/h h e-mtb mtbs'.split(' '));
const isGenericOnly = (kw) => kw.split(/[\s-]+/).filter(Boolean).every((t) => GENERIC.has(t) || ALLOW.has(t) || /^\d+$/.test(t));

const out = [];
const dropped = { notCarried: 0, offTopic: 0, lowVolume: 0 };
const notCarriedRows = [];
const infoRows = [];
for (const r of rows.values()) {
  if (r.kd >= 26) continue;
  const kw = r.kw.toLowerCase();
  const brand = carriedMatch(kw);
  if (!brand && NOT_CARRIED.test(kw)) { dropped.notCarried++; notCarriedRows.push(r); continue; }
  if (OFF.test(kw)) { dropped.offTopic++; if (/(test|review|ervaring|vergelijk|beste|hoe |wat |welke|helmplicht|verzeker|subsidie|kosten)/.test(kw)) infoRows.push(r); continue; }
  if (!/(e-?bike|ebike|elektrisch|fiets|pedelec|bakfiets|mountainbike|mtb|gravel|racefiets)/.test(kw) && !brand) { dropped.offTopic++; continue; }
  let cluster, target;
  if (brand) { cluster = 'Merkpagina (geleverd merk)'; target = `/merk/${slug(brand)}`; }
  else {
    const hit = CLUSTERS.slice(1).find(([, re]) => re.test(kw));
    if (!hit) { dropped.offTopic++; continue; }
    [cluster] = hit; target = TARGET[cluster];
    if (!isGenericOnly(kw)) { cluster = 'Reserve: onbekend woord (merk/onderdeel/niche)'; target = '/categorie/elektrische-fietsen'; }
  }
  out.push({ ...r, brand: brand || '', cluster, target });
}
out.sort((a, b) => b.vol - a.vol);

const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
fs.writeFileSync(path.join(OUT, 'keywords-nl-kd25.csv'), ['keyword,volume,kd,cpc_usd,intent,tier,cluster,target_page,brand', ...out.map((r) => [esc(r.kw), r.vol, r.kd, r.cpc, r.intent, r.cluster.startsWith('Reserve') ? 'B (controleer)' : 'A (passend)', esc(r.cluster), esc(r.target), esc(r.brand)].join(','))].join('\n'));

const summary = {};
for (const r of out) {
  const s = (summary[r.cluster] ||= { keywords: 0, volume: 0, target: r.target, top: [] });
  s.keywords++; s.volume += r.vol; if (s.top.length < 8) s.top.push(`${r.kw} (${r.vol}, KD${r.kd})`);
}
fs.writeFileSync(path.join(OUT, 'cluster-summary.json'), JSON.stringify({ total: out.length, pool: rows.size, dropped, summary, vol100: out.filter((r) => r.vol >= 100).length, vol50: out.filter((r) => r.vol >= 50).length }, null, 2));
fs.writeFileSync(path.join(OUT, 'extra-signals.json'), JSON.stringify({ notCarried: notCarriedRows.sort((a, b) => b.vol - a.vol).slice(0, 60), info: infoRows.sort((a, b) => b.vol - a.vol).slice(0, 60) }, null, 1));
console.log('pool', rows.size, 'kept', out.length, dropped, 'vol>=100', out.filter((r) => r.vol >= 100).length, 'vol>=50', out.filter((r) => r.vol >= 50).length);
for (const [k, v] of Object.entries(summary).sort((a, b) => b[1].volume - a[1].volume)) console.log(String(v.keywords).padStart(5), String(v.volume).padStart(7), k, '→', v.target);
