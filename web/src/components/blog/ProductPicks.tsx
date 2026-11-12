import Link from 'next/link';
import { PRODUCTS } from '@/data/catalog';
import { CARD_PRODUCTS } from '@/data/slim';
import { PickGrid } from './PickGrid';
import type { Pick } from './PickGrid';

/** Order-ready cards for the models a post talks about: pick size and colour, order straight away or ask for a free quote. */
export function ProductPicks({ slugs, category, categoryLabel }: { slugs: string[]; category: string; categoryLabel: string }) {
  const picks: Pick[] = [];
  for (const slug of slugs) {
    const product = CARD_PRODUCTS.find((p) => p.slug === slug);
    const full = PRODUCTS.find((p) => p.slug === slug);
    if (product && full) picks.push({ product, indicative: Boolean(full.priceInfo?.originalCurrency) && full.priceInfo?.originalCurrency !== 'EUR' });
  }
  if (!picks.length) return null;
  return (
    <section id="bestellen" aria-labelledby="picks-heading" className="my-12 scroll-mt-24 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
      <h2 id="picks-heading" className="font-display text-2xl font-extrabold text-slate-900">Bestel direct of vraag een gratis offerte</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Kies je maat en kleur en bestel meteen, of vraag een vrijblijvende offerte aan. Na je bestelling mailen we je de betaalgegevens. Bij een indicatieve prijs bevestigen we eerst de definitieve prijs.
      </p>
      <PickGrid picks={picks} />
      <p className="mt-6 text-center">
        <Link prefetch={false} href={category} className="inline-flex min-h-11 items-center rounded-xl border border-blue-300 bg-white px-5 text-sm font-bold text-blue-800 hover:bg-blue-50">
          Bekijk alle {categoryLabel}
        </Link>
      </p>
    </section>
  );
}
