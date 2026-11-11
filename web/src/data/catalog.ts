// Full catalogue. Server-only: import this from routes, sitemap and SEO helpers, never from a client component.
import catalogData from './catalog.json';
import type { Product } from '../types/ebike';
import { deriveFrom } from './derive';

// Imported from the manufacturers' own product pages (see scripts/import). Never edit by hand.
export const PRODUCTS: Product[] = catalogData as unknown as Product[];
export const { BRANDS_WITH_PRODUCTS, POPULAR_BRANDS, ACTIVE_CATEGORY_SLUGS, ACTIVE_TAXONOMY_CATEGORIES } = deriveFrom(PRODUCTS);
