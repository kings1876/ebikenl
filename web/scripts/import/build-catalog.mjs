// Build the site catalogue from scraped brand files: normalise -> download + process images -> write data files.
// Raw downloads stay OUTSIDE the repo (RAW dir). Only processed, uniform images are written to public/.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { politeFetch, ensureDir } from './lib.mjs';

const RAW = process.env.RAW;
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUT_IMG = path.join(ROOT, 'public', 'images', 'catalog');
const MAX_IMAGES = 4; // primary + 3 gallery images keeps the repo and deploy small
const TODAY = new Date().toISOString().slice(0, 10);
ensureDir(OUT_IMG);
ensureDir(path.join(RAW, 'images'));

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' en ').replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- spec interpretation (only what the brand states; unknown stays undefined) ----------
function interpret(specs = {}, name = '') {
  const motorText = specs.Motor || specs['Motor / Accu'] || '';
  const accuText = specs.Accu || specs.Accu || specs['Accu / Motor'] || '';
  const all = Object.values(specs).join(' | ');
  const out = {};
  if (motorText) {
    out.motorModel = motorText.replace(/\s+/g, ' ');
    if (/bosch/i.test(motorText)) out.motormerk = 'Bosch';
    else if (/shimano/i.test(motorText)) out.motormerk = 'Shimano STEPS';
    else if (/yamaha/i.test(motorText)) out.motormerk = 'Yamaha';
    else if (/brose/i.test(motorText)) out.motormerk = 'Brose';
    else if (/fazua/i.test(motorText)) out.motormerk = 'Fazua';
    else if (/bafang/i.test(motorText)) out.motormerk = 'Bafang';
    else if (/syncdrive/i.test(motorText)) out.motormerk = 'Giant SyncDrive';
    else if (/^tq\b/i.test(motorText)) out.motormerk = 'TQ';
    else if (/specialized/i.test(motorText)) out.motormerk = 'Specialized';
    else if (/stromer/i.test(motorText)) out.motormerk = 'Stromer';
    else if (/avinox/i.test(motorText)) out.motormerk = 'Avinox';
    const nm = /(\d{2,3})\s?Nm/i.exec(motorText);
    if (nm) out.motorTorqueNm = +nm[1];
  }
  const whs = [...accuText.matchAll(/(\d{3,4})\s?Wh/gi)].map((m) => +m[1]);
  if (whs.length) {
    const base = /adviesprijs op basis van (\d{3,4})\s?Wh/i.exec(accuText);
    out.accuWhNumber = base ? +base[1] : whs[0];
    const w = out.accuWhNumber;
    out.accucapaciteit = w < 450 ? '400 Wh' : w < 560 ? '500 Wh' : w < 690 ? '625 Wh' : w < 900 ? '750 Wh' : '1000 Wh of meer';
  }
  if (specs.Maten) out.framematen = specs.Maten.split(/[,/]\s*/).map((s) => s.trim()).filter(Boolean);
  if (specs.Kleuren) out.kleuren = specs.Kleuren.split(/\s*(?:,|\/| en )\s*/).map((s) => s.trim()).filter(Boolean);
  const gear = [specs.Shifters, specs.Cassette, specs.Naven, specs.Versnelling].filter(Boolean).join(' ');
  if (/nuvinci|enviolo/i.test(gear)) out.versnelling = 'Stepless (Enviolo)';
  else if (/nexus|alfine|rohloff|pinion|nabe|naaf/i.test(gear)) out.versnelling = 'Naafschakeling';
  else if (/deore|slx|xt\b|xtr|cues|linkglide|altus|acera|alivio|sram|derailleur|shimano \d{1,2}-speed/i.test(gear)) out.versnelling = 'Derailleur';
  if (specs.Versnelling || specs.Shifters) out.versnellingDetail = (specs.Versnelling || specs.Shifters).replace(/\s+/g, ' ');
  const drive = [specs.Aandrijving, specs.Crankset, specs.Cassette].filter(Boolean).join(' ');
  if (/carbon drive|belt|riem|gates/i.test(drive)) out.aandrijving = 'Riem';
  else if (specs.Ketting) out.aandrijving = 'Ketting';
  const brakes = specs.Remmen || '';
  if (/hydrauli.*(schijf|disc)|(schijf|disc).*hydrauli/i.test(brakes)) out.remtype = 'Hydraulische schijfrem';
  else if (/schijf|disc/i.test(brakes)) out.remtype = 'Schijfrem';
  else if (/v-?brake/i.test(brakes)) out.remtype = 'V-brake';
  else if (/roller/i.test(brakes)) out.remtype = 'Rollerbrake';
  const wheels = [specs.Banden, specs.Velgen].filter(Boolean).join(' ');
  if (/622|700c|28"|28 inch|\b28\b/i.test(wheels)) out.wielmaat = '28 inch';
  else if (/584|27[.,]5/i.test(wheels)) out.wielmaat = '27,5 inch';
  else if (/559|\b26\b/i.test(wheels)) out.wielmaat = '26 inch';
  else if (/\b29\b/i.test(wheels)) out.wielmaat = '29 inch';
  const wkg = /(\d{1,2}[.,]?\d?)\s?kg/i.exec(specs.Gewicht || '');
  if (wkg) {
    out.gewichtKg = parseFloat(wkg[1].replace(',', '.'));
    out.gewichtKlasse = out.gewichtKg < 20 ? 'Onder 20 kg' : out.gewichtKg <= 25 ? '20-25 kg' : 'Meer dan 25 kg';
  }
  if (/speed|45\s?km/i.test(name + ' ' + all)) out.maximaleSnelheid = '45 km/u';
  else out.maximaleSnelheid = '25 km/u'; // EU pedelec class; speed pedelecs are named as such by the brands
  out.opvouwbaar = /vouw|fold/i.test(name) ? 'Ja' : 'Nee';
  return out;
}

// ---------- templated descriptions (own words from structured facts; never brand prose) ----------
function describe(rec, a) {
  const typeNl = { Stadsfietsen: 'stads-e-bike', Trekkingfietsen: 'toer-e-bike', 'Elektrische mountainbikes': 'e-mountainbike', 'Gravel & racefietsen': 'sportieve e-bike', Bakfietsen: 'e-bakfiets' }[rec.subCategory] || 'e-bike';
  const typeEn = { Stadsfietsen: 'city e-bike', Trekkingfietsen: 'touring e-bike', 'Elektrische mountainbikes': 'electric mountain bike', 'Gravel & racefietsen': 'sporty e-bike', Bakfietsen: 'cargo e-bike' }[rec.subCategory] || 'e-bike';
  const motor = a.motorModel;
  const nl = [`${rec.brand} ${rec.name} is een ${typeNl}${motor ? ` met ${motor}` : ''}${a.accuWhNumber ? (motor ? ` en een ${a.accuWhNumber} Wh accu` : ` met een ${a.accuWhNumber} Wh accu`) : ''}.`];
  const en = [`The ${rec.brand} ${rec.name} is a ${typeEn}${motor ? ` with ${motor}` : ''}${a.accuWhNumber ? (motor ? ` and a ${a.accuWhNumber} Wh battery` : ` with a ${a.accuWhNumber} Wh battery`) : ''}.`];
  if (rec.specs.Frame) { nl.push(`Frame: ${rec.specs.Frame}.`); en.push(`Frame: ${rec.specs.Frame}.`); }
  if (a.versnellingDetail) { nl.push(`Versnellingen: ${a.versnellingDetail}.`); en.push(`Gears: ${a.versnellingDetail}.`); }
  if (rec.specs.Remmen) { nl.push(`Remmen: ${rec.specs.Remmen}.`); en.push(`Brakes: ${rec.specs.Remmen}.`); }
  if (a.framematen?.length) { nl.push(`Beschikbare maten: ${a.framematen.join(', ')}.`); en.push(`Available sizes: ${a.framematen.join(', ')}.`); }
  if (rec.fx) {
    nl.push('Specificaties volgens openbare modelgegevens; de prijs is indicatief (omgerekend uit de Zwitserse adviesprijs). Wijzigingen voorbehouden.');
    en.push('Specifications follow public model data; the price is indicative (converted from the Swiss list price). Subject to change.');
  } else {
    nl.push('Specificaties en adviesprijs zijn afkomstig van de fabrikant; wijzigingen voorbehouden.');
    en.push('Specifications and recommended price come from the manufacturer and are subject to change.');
  }
  const short = (s) => s.slice(0, 2).join(' ');
  return { nl: nl.join(' '), en: en.join(' '), shortNl: short(nl), shortEn: short(en) };
}

// ---------- images ----------
async function processImage(url, outBase) {
  const rawFile = path.join(RAW, 'images', path.basename(outBase) + path.extname(new URL(url).pathname).slice(0, 5));
  let buf;
  if (fs.existsSync(rawFile)) buf = fs.readFileSync(rawFile);
  else {
    const res = await politeFetch(url, { accept: 'image/*' });
    if (!res.ok) throw new Error(`img ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(rawFile, buf);
  }
  let img = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  // trim uniform border, but keep the trim only if neither side collapses below 12% of the original
  try {
    const t = await sharp(buf, { failOn: 'none' }).rotate().trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
    if (t.info.width > meta.width * 0.12 && t.info.height > meta.height * 0.12) img = sharp(t.data);
  } catch {
    /* keep untrimmed */
  }
  const W = 1200, H = 900;
  const fitted = await img.resize(Math.round(W * 0.92), Math.round(H * 0.92), { fit: 'inside', kernel: 'lanczos3', background: '#ffffff' }).flatten({ background: '#ffffff' }).toBuffer();
  let webp;
  for (let q = 82; q >= 40; q -= 8) {
    webp = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).composite([{ input: fitted, gravity: 'centre' }]).webp({ quality: q }).toBuffer();
    if (webp.length < 110 * 1024) break;
  }
  fs.writeFileSync(outBase + '.webp', webp);
  return { width: W, height: H, bytes: webp.length, lowRes: Math.min(meta.width, meta.height) < 500 };
}

// ---------- brand adapters ----------
const adapters = {
  giant: (r) => {
    const sub = { 'elektrische-stadsfietsen': ['stadsfietsen', 'Stadsfietsen'], 'elektrische-toerfietsen': ['toerfietsen', 'Trekkingfietsen'], 'elektrische-mountainbikes': ['mountainbikes', 'Elektrische mountainbikes'], 'elektrische-racefietsen': ['racefietsen', 'Gravel & racefietsen'] }[r.category] || ['', 'Stadsfietsen'];
    return { ...r, category: sub[0], subCategory: sub[1], slugBase: new URL(r.url).pathname.split('/').pop(), currency: 'EUR' };
  },
};

// Shopify brands arrive already normalised (see normalize-shopify.mjs)
const normalised = (r) => ({ ...r, subCategory: r.category, category: '', slugBase: r.handle, currency: 'EUR' });
adapters.batavus = normalised;
adapters.haibike = normalised;
adapters.raleigh = normalised;
adapters.tenways = normalised;
adapters.ghost = normalised;
adapters.sushi = normalised;
adapters.winora = normalised;
adapters.zuverkaufen = (r) => ({ ...r, subCategory: r.category, category: '', slugBase: r.handle, currency: 'CHF' });
adapters.liv = adapters.giant; // same platform and fields as Giant
const files = fs.readdirSync(RAW).filter((f) => /^(giant|liv|batavus|haibike|raleigh|tenways|ghost|sushi|winora|zuverkaufen)\.json$/.test(f));
const catalog = [];
const en = {};
const report = { products: 0, images: 0, failedImages: 0, lowRes: [], bytes: 0 };

for (const f of files) {
  const brandKey = f.replace('.json', '');
  const recs = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
  for (const raw of recs) {
    const r = adapters[brandKey](raw);
    if (!r.price || !r.name || !r.images.length) continue; // no sourced price or no photos: not listed
    const a = interpret(r.specs, r.name);
    if (r.maxSpeed) a.maximaleSnelheid = r.maxSpeed; // stated by category, not guessed from spec words
    const slug = `${slugify(r.brand)}-${r.slugBase}`;
    const motorShort = a.motorModel ? a.motorModel.replace(/\s*,?\s*\d+\s?Nm/i, '') : '';
    const title = `${r.brand} ${r.name}${motorShort ? ', ' + motorShort : ''}${a.accuWhNumber ? ', ' + a.accuWhNumber + ' Wh' : ''}`;
    const gallery = [];
    for (let i = 0; i < Math.min(MAX_IMAGES, r.images.length); i++) {
      try {
        const base = path.join(OUT_IMG, `${slug}-${i + 1}`);
        const info = await processImage(r.images[i], base);
        gallery.push(`/images/catalog/${slug}-${i + 1}.webp`);
        report.images++; report.bytes += info.bytes;
        if (info.lowRes) report.lowRes.push(`${slug}-${i + 1}`);
      } catch (e) {
        report.failedImages++;
        console.log('image fail', slug, i, String(e.message).slice(0, 50));
      }
    }
    if (!gallery.length) continue;
    const d = describe(r, a);
    const p = {
      id: `${slugify(r.brand)}-${r.slugBase}`,
      slug, title, brand: r.brand, model: r.name,
      category: 'Elektrische fietsen', subCategory: r.subCategory,
      price: r.price,
      image: gallery[0], galleryImages: gallery,
      description: d.nl, shortDescription: d.shortNl,
      ...a,
      ...(r.shape ? { doelgroep: r.shape } : {}),
      tags: [],
      specs: r.specs,
      source: { brandUrl: r.url, retrieved: TODAY },
      priceInfo: { source: r.priceSource, retrieved: TODAY, originalAmount: r.priceChf ?? r.price, originalCurrency: r.currency, ...(r.fx ? { fxRate: r.fx.chfPerEur } : {}), note: r.priceNote || 'Adviesprijs van de fabrikant (incl. BTW).' },
      reviews: [],
    };
    catalog.push(p);
    en[d.nl] = d.en; en[d.shortNl] = d.shortEn;
    report.products++;
  }
}

fs.writeFileSync(path.join(ROOT, 'src', 'data', 'catalog.json'), JSON.stringify(catalog, null, 1));
fs.writeFileSync(path.join(ROOT, 'src', 'i18n', 'en-catalog.json'), JSON.stringify(en, null, 1));
console.log('products', report.products, '| images', report.images, '| failed', report.failedImages, '| total MB', (report.bytes / 1048576).toFixed(1), '| low-res', report.lowRes.length);
