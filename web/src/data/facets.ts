// Which brands and categories hold products, for client components (filters, menus, brand lists).
// Built from catalog-facets.json (scripts/data/make-facets.mjs) so the browser does not need the whole product list for it.
import facetRows from './catalog-facets.json';
import { deriveFrom } from './derive';

export const { BRANDS_WITH_PRODUCTS, POPULAR_BRANDS, ACTIVE_CATEGORY_SLUGS, ACTIVE_TAXONOMY_CATEGORIES } = deriveFrom(facetRows);
