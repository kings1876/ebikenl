// Which brands and categories actually hold products. Pure function: the full catalogue (server) and the slim one (client) share it.
import { ALL_BRANDS, TAXONOMY_CATEGORIES, CATEGORY_SLUG_TO_MAIN } from './ebikes';

/** `n` lets a row stand for several products (catalog-facets.json); a plain product counts once. */
type Item = { brand: string; category: string; subCategory: string; n?: number };

export function deriveFrom(items: Item[]) {
  const brandCount = (b: string) => items.filter((p) => p.brand === b).reduce((sum, p) => sum + (p.n ?? 1), 0);
  const BRANDS_WITH_PRODUCTS = ALL_BRANDS.filter((b) => brandCount(b) > 0);
  const POPULAR_BRANDS = [...BRANDS_WITH_PRODUCTS].sort((a, b) => brandCount(b) - brandCount(a)).slice(0, 3);
  const ACTIVE_CATEGORY_SLUGS = Object.entries(CATEGORY_SLUG_TO_MAIN)
    .filter(([, main]) => items.some((p) => p.category === main))
    .map(([slug]) => slug);
  const ACTIVE_TAXONOMY_CATEGORIES = TAXONOMY_CATEGORIES.filter((c) => items.some((p) => p.category === c.main)).map((c) => ({
    ...c,
    subs: c.subs.filter((sub) => items.some((p) => p.category === c.main && p.subCategory === sub)),
  }));
  return { BRANDS_WITH_PRODUCTS, POPULAR_BRANDS, ACTIVE_CATEGORY_SLUGS, ACTIVE_TAXONOMY_CATEGORIES };
}
