// Build src/data/catalog-facets.json: one row per distinct brand / category / subcategory with a product count.
// Client components only need to know which brands and categories hold products (filters, menus), not the products themselves,
// so they read this ~5 KB file instead of the 250 KB slim catalogue.
//   node scripts/data/make-facets.mjs   (run again whenever catalog.json changes)
import fs from 'node:fs';
import path from 'node:path';

const DATA = path.resolve(import.meta.dirname, '..', '..', 'src', 'data');
const full = JSON.parse(fs.readFileSync(path.join(DATA, 'catalog.json'), 'utf8'));
const counts = new Map();
for (const p of full) {
  const key = JSON.stringify([p.brand, p.category, p.subCategory]);
  counts.set(key, (counts.get(key) ?? 0) + 1);
}
const rows = [...counts].map(([key, n]) => {
  const [brand, category, subCategory] = JSON.parse(key);
  return { brand, category, subCategory, n };
});
fs.writeFileSync(path.join(DATA, 'catalog-facets.json'), JSON.stringify(rows));
console.log(`catalog-facets.json: ${rows.length} rows from ${full.length} products`);
