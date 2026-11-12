// Server side: the first page of products for a listing, plus how many there are in total.
// Listing views render this on the server; the full catalogue arrives later through useCatalog().
import { CARD_PRODUCTS } from '@/data/slim';
import { SEO_LANDING_PAGES } from '@/data/ebikes';
import { PAGE_SIZE, byPopularity } from '@/lib/listing';
import { matchesLanding } from '@/lib/landingMatch';
import type { ProductCardData, SubCategory } from '@/types/ebike';

export type ListingSeed = { products: ProductCardData[]; total: number };

const seed = (list: ProductCardData[]): ListingSeed => ({ products: list.slice(0, PAGE_SIZE), total: list.length });

export const categorySeed = (category: string, subCategory?: SubCategory): ListingSeed =>
  seed(CARD_PRODUCTS.filter((p) => p.category === category && (!subCategory || p.subCategory === subCategory)).sort(byPopularity));

export const landingSeed = (slug: string): ListingSeed => {
  const landing = SEO_LANDING_PAGES.find((l) => l.slug === slug) ?? SEO_LANDING_PAGES[0];
  return seed(CARD_PRODUCTS.filter((p) => matchesLanding(p, landing)));
};

/** Brand pages are small (at most ~70 models) and their intro text uses every model, so they get the whole brand. */
export const brandProducts = (brand: string): ProductCardData[] => CARD_PRODUCTS.filter((p) => p.brand === brand);
