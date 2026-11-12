'use client';

import React from 'react';
import { MessageSquareQuote, ShoppingBag } from '@/components/icons';
import { QUOTE_EVENT } from './QuoteForm';

/** Mid-article call to action: jump to the order cards or to the free quote form. */
export function BlogCta({ compact = false }: { compact?: boolean }) {
  const toOrder = () => document.getElementById('bestellen')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <aside aria-label="Bestellen of offerte aanvragen" className={`rounded-2xl border border-blue-200 bg-blue-50 ${compact ? 'p-4' : 'my-10 p-5 sm:p-6'}`}>
      <p className="font-display text-lg font-extrabold text-slate-900">Weet je al welk model je wilt?</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">Bestel direct met de juiste maat en kleur, of vraag een gratis en vrijblijvende offerte aan.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={toOrder} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Bekijk en bestel de modellen
        </button>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent(QUOTE_EVENT, { detail: {} }))} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-5 text-sm font-bold text-blue-800 hover:bg-blue-100">
          <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
          Gratis offerte aanvragen
        </button>
      </div>
    </aside>
  );
}
