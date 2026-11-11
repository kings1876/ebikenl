'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/lib/router';
import { CopyField } from '@/components/CopyField';
import { useLocale, useTr } from '@/i18n/locale';
import { money } from '@/lib/reply/order';
import { useQueryParam } from '@/lib/useQueryParam';
import type { PaymentField } from '@/lib/reply/types';

interface Details {
  orderNumber: string;
  amountDue: number;
  opening: string;
  closing: string;
  fields: PaymentField[];
  terms: string[];
}

export const PaymentDetailsPage: React.FC = () => {
  const tr = useTr();
  const locale = useLocale();
  const id = useQueryParam('id');
  const [fetched, setFetched] = useState<{ ref: string; details: Details | null } | null>(null);

  useEffect(() => {
    if (!id) return;
    let live = true;
    fetch(`/api/order/payment-details?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Details) => live && setFetched({ ref: id, details: d }))
      .catch(() => live && setFetched({ ref: id, details: null }));
    return () => {
      live = false;
    };
  }, [id]);

  const details = fetched?.ref === id ? fetched.details : null;
  const state: 'loading' | 'ready' | 'missing' = !id ? 'missing' : fetched?.ref !== id ? 'loading' : details ? 'ready' : 'missing';

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-10 sm:px-6">
      {state === 'loading' && <p className="text-sm text-slate-500">{tr('Betaalgegevens laden…')}</p>}

      {state === 'missing' && (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="font-display text-xl font-extrabold text-slate-900">{tr('Betaalgegevens niet gevonden')}</h1>
          <p className="text-sm text-slate-600">
            {tr('Voor dit ordernummer zijn nog geen betaalgegevens verstuurd, of de link klopt niet. Je ontvangt de betaalgegevens per e-mail zodra we je bestelling hebben bekeken.')}
          </p>
        </div>
      )}

      {state === 'ready' && details && (
        <>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">{tr('Betaalgegevens')}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {tr('Bestelling')} <span className="font-mono font-bold text-slate-900">{details.orderNumber}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{tr('Te betalen')}</div>
            <div className="text-3xl font-extrabold text-blue-700">{money(details.amountDue, locale)}</div>
          </div>

          <p className="text-sm text-slate-700">{details.opening}</p>
          <div className="space-y-2">
            {details.fields.map((f, i) => (
              <CopyField key={i} label={f.label} value={f.value} />
            ))}
          </div>
          <p className="text-sm text-slate-700">{details.closing}</p>

          <ul className="list-disc space-y-1 rounded-xl border border-blue-100 bg-blue-50 p-4 pl-8 text-xs text-slate-700">
            {details.terms.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <Link
            to={`/order/confirm-payment?id=${encodeURIComponent(id)}`}
            className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
          >
            {tr('Ik heb betaald: bevestiging uploaden')}
          </Link>
        </>
      )}
    </div>
  );
};
