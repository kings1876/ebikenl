// One-off refactor helper: after splitting data/ebikes.ts, point server files at data/catalog and client views at data/slim.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(import.meta.dirname, '..', '..', 'src');
const MOVED = ['PRODUCTS', 'BRANDS_WITH_PRODUCTS', 'POPULAR_BRANDS', 'ACTIVE_CATEGORY_SLUGS', 'ACTIVE_TAXONOMY_CATEGORIES'];
const CLIENT = ['views/BrandPage.tsx', 'views/CategoryPage.tsx', 'views/HomePage.tsx', 'views/KeuzehulpPage.tsx', 'views/LandingPage.tsx', 'views/TaxonomyPage.tsx', 'components/FilterSidebar.tsx'];

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const re = /import \{([^}]*)\} from '(@\/data\/ebikes|\.\.\/data\/ebikes)';/g;

for (const abs of walk(SRC).filter((f) => /\.(ts|tsx)$/.test(f))) {
  const rel = path.relative(SRC, abs).split(path.sep).join('/');
  if (rel.startsWith('data/')) continue;
  const before = fs.readFileSync(abs, 'utf8');
  const isClient = CLIENT.includes(rel);
  const after = before.replace(re, (all, names, src) => {
    const list = names.split(',').map((x) => x.trim()).filter(Boolean);
    const moved = list.filter((n) => MOVED.includes(n));
    const kept = list.filter((n) => !MOVED.includes(n));
    if (!moved.length) return all;
    const mod = src.replace('ebikes', isClient ? 'slim' : 'catalog');
    const movedNames = isClient ? moved.map((n) => (n === 'PRODUCTS' ? 'CARD_PRODUCTS as PRODUCTS' : n)) : moved;
    const out = [];
    if (kept.length) out.push(`import { ${kept.join(', ')} } from '${src}';`);
    out.push(`import { ${movedNames.join(', ')} } from '${mod}';`);
    return out.join('\n');
  });
  if (after !== before) { fs.writeFileSync(abs, after); console.log('updated', rel, isClient ? '(slim)' : '(full)'); }
}
