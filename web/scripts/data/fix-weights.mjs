// One-off repair: re-derives gewichtKg from the stored spec text. The importer used to cut "21.487 kg" down to "487"
// and "33.05 kg" to "5", which put weights like 487 kg on product pages. Safe to re-run (idempotent).
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(import.meta.dirname, '..', '..', 'src', 'data', 'catalog.json');
const raw = fs.readFileSync(file, 'utf8');
const crlf = raw.includes('\r\n');
const catalogue = JSON.parse(raw);

let fixed = 0;
for (const p of catalogue) {
  const m = /(\d{1,3}(?:[.,]\d{1,3})?)\s?kg/i.exec((p.specs && p.specs.Gewicht) || '');
  if (!m) continue;
  const kg = Math.round(parseFloat(m[1].replace(',', '.')) * 10) / 10;
  if (p.gewichtKg !== kg) {
    fixed++;
    p.gewichtKg = kg;
    p.gewichtKlasse = kg < 20 ? 'Onder 20 kg' : kg <= 25 ? '20-25 kg' : 'Meer dan 25 kg';
  }
}

let out = JSON.stringify(catalogue, null, 1);
if (crlf) out = out.replace(/\n/g, '\r\n');
if (raw.endsWith('\n')) out += crlf ? '\r\n' : '\n';
fs.writeFileSync(file, out);

const bad = catalogue.filter((x) => x.gewichtKg != null && (x.gewichtKg > 45 || x.gewichtKg < 7));
console.log(`weights corrected: ${fixed}; still implausible: ${bad.length}`, bad.map((x) => `${x.slug} ${x.gewichtKg}`));
