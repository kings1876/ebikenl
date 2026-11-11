import Link from 'next/link';
import { CARD_PRODUCTS } from '@/data/slim';
import { ProductCard } from '@/components/ProductCard';

/** Real catalogue cards (live prices and specs) for the models a post talks about. */
export function ProductPicks({ slugs, category, categoryLabel }: { slugs: string[]; category: string; categoryLabel: string }) {
  const products = slugs.map((s) => CARD_PRODUCTS.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (!products.length) return null;
  return (
    <section aria-labelledby="picks-heading" className="my-12 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
      <h2 id="picks-heading" className="font-display text-2xl font-extrabold text-slate-900">Modellen uit dit artikel</h2>
      <p className="mt-2 text-sm text-slate-600">Specificaties en adviesprijzen komen uit onze catalogus. Bij sommige merken is de prijs een indicatieve omrekening; dat staat op de productpagina.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} headingLevel="h3" />
        ))}
      </div>
      <p className="mt-6 text-center">
        <Link href={category} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">
          Bekijk alle {categoryLabel}
        </Link>
      </p>
    </section>
  );
}
