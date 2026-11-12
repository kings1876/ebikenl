// Server-rendered index of every model in a category or brand. The listings above paginate with buttons, which a
// crawler cannot press; these plain links keep every product page reachable within a click or two of its listing.
import type { Locale } from '@/i18n/config';
import { ModelIndexList } from '@/components/ModelIndexList';
import type { Product } from '@/types/ebike';

const label = (p: Product) => p.title.split(', ')[0];

export function ModelIndex({ locale, products, groupBy, title }: { locale: Locale; products: Product[]; groupBy: 'brand' | 'subCategory'; title: string }) {
  void locale; // the client list reads the locale from context
  if (products.length === 0) return null;
  const items = [...products]
    .sort((a, b) => label(a).localeCompare(label(b)))
    .map((p) => ({ slug: p.slug, label: label(p), price: p.price, group: p[groupBy] as string }));
  return <ModelIndexList items={items} translateGroups={groupBy === 'subCategory'} title={title} />;
}
