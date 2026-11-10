// Build seo/KEYWORD-PLAN.md from keywords-nl-kd25.csv and extra-signals.json (run classify.mjs first).
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname, '..', '..', '..', 'seo');
const parseLine = (l) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || []).map((x) => x.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
const rows = fs.readFileSync(path.join(DIR, 'keywords-nl-kd25.csv'), 'utf8').split('\n').slice(1).filter(Boolean).map(parseLine)
  .map(([kw, vol, kd, cpc, intent, tier, cluster, target, brand]) => ({ kw, vol: +vol, kd: +kd, cpc: +cpc, intent, tier, cluster, target, brand }));
const extra = JSON.parse(fs.readFileSync(path.join(DIR, 'extra-signals.json'), 'utf8'));
const A = rows.filter((r) => r.tier.startsWith('A'));
const fmt = (n) => n.toLocaleString('nl-NL');
const line = (r) => `| ${r.kw} | ${fmt(r.vol)} | ${r.kd} | ${r.intent || '–'} |`;

const byTarget = {};
for (const r of A) (byTarget[r.target] ||= []).push(r);
const TITLES = {
  '/categorie/elektrische-fietsen': ['Elektrische fiets kopen | Nieuwe e-bikes van Cube, Giant, Scott & meer', 'Vergelijk nieuwe elektrische fietsen: stads-, trekking-, mountain-, vouw- en bakfietsen. Bekijk modellen, specificaties en adviesprijzen op één plek.'],
  '/bosch-middenmotor': ['Elektrische fiets met middenmotor (Bosch) | E-BIKE-TEKOOP.NL', 'E-bikes met Bosch middenmotor: krachtig, stil en betrouwbaar. Bekijk alle modellen met specificaties.'],
  '/elektrische-damesfiets': ['Elektrische damesfiets met lage instap | E-BIKE-TEKOOP.NL', 'Elektrische damesfietsen met lage instap, van stads- tot trekkingmodel. Vergelijk modellen en adviesprijzen.'],
  '/e-bike-onder-2000': ['Elektrische fiets onder €2.000 | Betaalbare e-bikes', 'Nieuwe elektrische fietsen tot €2.000. Bekijk de modellen en adviesprijzen.'],
  '/speed-pedelecs': ['Speed pedelec kopen | Snelle e-bikes tot 45 km/u', 'Speed pedelecs met motorondersteuning tot 45 km/u. Bekijk de modellen en specificaties.'],
};

const md = [];
md.push('# Zoekwoordenplan e-bike-tekoop.nl (NL, KD < 26)\n');
md.push(`Bron: Semrush Keyword Magic Tool, database NL (maandvolumes, KD = Semrush Keyword Difficulty). Opgehaald op ${new Date().toISOString().slice(0, 10)}.\n`);
md.push('## Samenvatting\n');
md.push(`- **${fmt(rows.length)} zoekwoorden** met KD < 26 die bij het assortiment passen, in \`keywords-nl-kd25.csv\`.`);
md.push(`  - **Laag A, passend: ${fmt(A.length)}** (totaal ${fmt(A.reduce((s, r) => s + r.vol, 0))} zoekopdrachten per maand). Merken die we leveren, of algemene termen voor wat we verkopen.`);
md.push(`  - **Laag B, controleren: ${fmt(rows.length - A.length)}**. Bevat een woord dat we niet automatisch konden plaatsen (andere merken, onderdelen, niche). Handmatig nalopen voor je ze gebruikt.`);
md.push(`- Volume ≥ 100 per maand: ${fmt(rows.filter((r) => r.vol >= 100).length)} zoekwoorden.`);
md.push('- Verwijderd: merken die we niet leveren, accessoires en onderdelen (die verkopen we niet), verhuur en lease, tweedehands, reparatie en plaatsnamen.\n');

md.push('## Top 40 zoekwoorden (laag A)\n');
md.push('| Zoekwoord | Volume | KD | Intentie |\n|---|---:|---:|---|');
A.slice(0, 40).forEach((r) => md.push(line(r)));

md.push('\n## Zoekwoorden per pagina\n');
md.push('Elke pagina krijgt één hoofdzoekwoord in titel en H1, de rest verwerk je in de tekst. Voorgestelde titels en beschrijvingen zijn een eerste opzet.\n');
const targets = Object.entries(byTarget).filter(([t]) => !t.startsWith('/merk/')).sort((a, b) => b[1].reduce((s, r) => s + r.vol, 0) - a[1].reduce((s, r) => s + r.vol, 0));
for (const [t, rs] of targets) {
  md.push(`### ${t}\n`);
  md.push(`${rs.length} zoekwoorden, samen ${fmt(rs.reduce((s, r) => s + r.vol, 0))} per maand.`);
  if (TITLES[t]) md.push(`\n- Titel: ${TITLES[t][0]}\n- Beschrijving: ${TITLES[t][1]}`);
  md.push('\n| Zoekwoord | Volume | KD | Intentie |\n|---|---:|---:|---|');
  rs.slice(0, 10).forEach((r) => md.push(line(r)));
  md.push('');
}

md.push('### Merkpagina\'s (/merk/…)\n');
const brands = {};
for (const r of A.filter((x) => x.brand)) { const b = (brands[r.brand] ||= { n: 0, v: 0, top: r }); b.n++; b.v += r.vol; }
md.push('| Merk | Pagina | Zoekwoorden | Volume totaal | Hoofdzoekwoord |\n|---|---|---:|---:|---|');
for (const [b, v] of Object.entries(brands).sort((x, y) => y[1].v - x[1].v)) md.push(`| ${b} | /merk/${b.toLowerCase().replace(/[^a-z0-9]+/g, '-')} | ${v.n} | ${fmt(v.v)} | ${v.top.kw} (${fmt(v.top.vol)}) |`);

md.push('\n## Vraag naar merken die we niet leveren\n');
md.push('Veel zoekvolume gaat naar merken die nu niet in het assortiment zitten. Dit is de reden om een distributeur te vragen deze merken erbij te nemen.\n');
const nc = {};
for (const r of extra.notCarried) { const m = /\b(sparta|gazelle|koga|qwic|vogue|altec|popal|flyer|rih|cortina|union|stella|veloretti|babboe|urban arrow|brompton|vanmoof|cowboy|pegasus|fischer|prophete|rixe|oxford)\b/.exec(r.kw); if (m) nc[m[1]] = (nc[m[1]] || 0) + r.vol; }
md.push('| Merk | Volume (som van de beste zoekwoorden, KD < 26) |\n|---|---:|');
Object.entries(nc).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([b, v]) => md.push(`| ${b} | ${fmt(v)} |`));

md.push('\n## Informatieve zoekwoorden (nog geen pagina)\n');
md.push('Deze vragen komen vaak voor en hebben lage concurrentie. Ze passen bij losse artikelen of een veelgestelde-vragen-blok, bijvoorbeeld over helmplicht, verzekering of de keuze van een e-bike.\n');
md.push('| Zoekwoord | Volume | KD |\n|---|---:|---:|');
extra.info.slice(0, 20).forEach((r) => md.push(`| ${r.kw} | ${fmt(r.vol)} | ${r.kd} |`));

md.push('\n## Zo gebruik je het\n');
md.push('1. Pas titels en beschrijvingen van de pagina\'s hierboven aan en zet het hoofdzoekwoord in de H1.');
md.push('2. Schrijf per merk- en landingspagina een korte, eigen introductietekst met de belangrijkste zoekwoorden uit laag A.');
md.push('3. Loop laag B na en neem alleen over wat bij het assortiment past.');
md.push('4. Volgens Semrush is KD < 26 relatief haalbaar. Het is geen garantie op positie; nieuwe sites hebben tijd en links nodig.');
fs.writeFileSync(path.join(DIR, 'KEYWORD-PLAN.md'), md.join('\n') + '\n');
console.log('written', md.length, 'lines');
