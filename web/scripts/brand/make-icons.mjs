// Render the brand mark to the PNG/ICO files Next serves from src/app (icon, apple-icon, favicon, opengraph-image).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const APP = path.resolve(import.meta.dirname, '..', '..', 'src', 'app');
const BLUE = '#2563eb', DARK = '#0f172a';

const mark = (size, radius = 14) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
<rect width="64" height="64" rx="${radius}" fill="${BLUE}"/>
<circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="4"/>
<path d="M35.5 19 24 34.5h7.4L28.5 45 40 29.5h-7.4z" fill="#fff"/>
</svg>`;

fs.writeFileSync(path.join(APP, 'icon.svg'), mark(64));
await sharp(Buffer.from(mark(180, 0))).png().toFile(path.join(APP, 'apple-icon.png'));

// favicon.ico wrapping a 32x32 PNG
const png32 = await sharp(Buffer.from(mark(32))).png().toBuffer();
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head[6] = 32; head[7] = 32; head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(APP, 'favicon.ico'), Buffer.concat([head, png32]));

// Open Graph card 1200x630: mark + wordmark on a light background
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f8fafc"/>
<rect x="0" y="560" width="1200" height="70" fill="${DARK}"/>
<g transform="translate(110 190) scale(3.4)">
<rect width="64" height="64" rx="14" fill="${BLUE}"/>
<circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="4"/>
<path d="M35.5 19 24 34.5h7.4L28.5 45 40 29.5h-7.4z" fill="#fff"/>
</g>
<text x="350" y="326" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="70" fill="${DARK}">E-BIKE-TEKOOP<tspan fill="${BLUE}">.NL</tspan></text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(path.join(APP, 'opengraph-image.png'));
console.log('icons written');
