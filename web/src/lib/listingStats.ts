// Facts about a set of products (a category, brand or landing page), used to write the guide text under a listing.
import type { ProductCardData } from '@/types/ebike';

export type ListingStats = {
  n: number;
  min: number;
  max: number;
  median: number;
  brands: [string, number][];
  types: [string, number][];
  motors: [string, number][];
  audiences: [string, number][];
  minWh: number;
  maxWh: number;
};

const tally = (values: (string | undefined)[], limit: number): [string, number][] => {
  const counts = new Map<string, number>();
  for (const v of values) if (v && v !== 'Geen') counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
};

export function listingStats(items: ProductCardData[]): ListingStats {
  const prices = items.map((p) => p.price).sort((a, b) => a - b);
  const wh = items.map((p) => p.accuWhNumber ?? 0).filter((n) => n > 0);
  return {
    n: items.length,
    min: prices[0] ?? 0,
    max: prices.at(-1) ?? 0,
    median: prices[Math.floor(prices.length / 2)] ?? 0,
    brands: tally(items.map((p) => p.brand), 8),
    types: tally(items.map((p) => p.subCategory), 8),
    motors: tally(items.map((p) => p.motormerk), 5),
    audiences: tally(items.map((p) => p.doelgroep), 4),
    minWh: wh.length ? Math.min(...wh) : 0,
    maxWh: wh.length ? Math.max(...wh) : 0,
  };
}
