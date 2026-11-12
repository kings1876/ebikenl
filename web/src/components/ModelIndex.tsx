// Server-rendered index of every model in a category or brand. The listings above paginate with buttons, which a
// crawler cannot press; these plain links keep every product page reachable within a click or two of its listing.
import Link from 'next/link';
import { withLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { tx } from '@/lib/seo';
import type { Product } from '@/types/ebike';

const label = (p: Product) => p.title.split(', ')[0];

export function ModelIndex({ locale, products, groupBy, title }: { locale: Locale; products: Product[]; groupBy: 'brand' | 'subCategory'; title: string }) {
  if (products.length === 0) return null;
  const eur = (n: number) => `€${n.toLocaleString(locale === 'en' ? 'en-GB' : 'nl-NL')}`;
  const groups = new Map<string, Product[]>();
  for (const p of [...products].sort((a, b) => label(a).localeCompare(label(b)))) {
    const key = p[groupBy];
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const heading = tx(locale, 'Alle modellen');
  return (
    <section aria-labelledby="model-index-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 id="model-index-heading" className="font-display text-xl font-extrabold tracking-tight text-slate-900">
        {heading}: {title} ({products.length})
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {tx(locale, "Elk model met zijn adviesprijs. Specificaties en foto's vind je op de productpagina.")}
      </p>
      <div className="mt-5 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {[...groups.entries()].map(([group, items]) => (
          <div key={group} className="mb-6 break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900">{groupBy === 'subCategory' ? tx(locale, group) : group}</h3>
            <ul className="mt-2 space-y-1 text-sm [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-900">
              {items.map((p) => (
                <li key={p.slug}>
                  <Link prefetch={false} href={withLocale(`/product/${p.slug}`, locale)}>
                    {label(p)}
                  </Link>
                   · {eur(p.price)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
