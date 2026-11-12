'use client';

// Short, factual text block: how ordering works. Used on thin pages (brand pages, contact, e-bike finder).
// A client component so its markup is not repeated in the framework payload (see ProductFaq).
import { useTr } from '@/i18n/locale';
import type { Locale } from '@/i18n/config';
import { ORDER_STEPS as STEPS, ORDER_TITLE as TITLE } from '@/lib/orderSteps';

export function InfoBlock({ locale }: { locale?: Locale }) {
  void locale;
  const tr = useTr();
  return (
    <section aria-labelledby="order-info-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 id="order-info-heading" className="font-display text-xl font-extrabold tracking-tight text-slate-900">{tr(TITLE)}</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {STEPS.map((s) => (
            <li key={s}>{tr(s)}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
