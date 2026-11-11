// Responsive image variants (no runtime optimiser needed, so no image-optimisation quota on the host):
//  - public/images/catalog/<name>-sm.webp  (480x360) for cards and gallery thumbnails
//  - public/images/hero-lifestyle-{800,1280}.webp from the original hero photo
// Re-run after build-catalog.mjs. Existing variants are kept unless --force is passed.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.resolve(import.meta.dirname, '..', '..', 'public', 'images');
const CATALOG = path.join(PUBLIC, 'catalog');
const force = process.argv.includes('--force');

let made = 0;
for (const f of fs.readdirSync(CATALOG).filter((n) => /\.webp$/.test(n) && !/-sm\.webp$/.test(n))) {
  const out = path.join(CATALOG, f.replace(/\.webp$/, '-sm.webp'));
  if (!force && fs.existsSync(out)) continue;
  await sharp(path.join(CATALOG, f)).resize(480, 360, { fit: 'inside' }).webp({ quality: 72 }).toFile(out);
  made++;
}
console.log('catalog thumbnails written:', made);

const heroSrc = path.resolve(import.meta.dirname, '..', '..', 'assets', 'originals', 'ebike_hero_lifestyle_1794286792478.jpg');
if (fs.existsSync(heroSrc)) {
  for (const w of [800, 1280]) {
    await sharp(heroSrc).resize({ width: w }).webp({ quality: 74 }).toFile(path.join(PUBLIC, `hero-lifestyle-${w}.webp`));
  }
  const meta = await sharp(heroSrc).metadata();
  console.log('hero source', meta.width, 'x', meta.height);
}
