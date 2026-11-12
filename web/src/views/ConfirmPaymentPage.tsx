'use client';

import React, { useState } from 'react';
import { CheckCircle } from '@/components/icons';
import { useLocale, useTr } from '@/i18n/locale';
import { useQueryParam } from '@/lib/useQueryParam';

export const ConfirmPaymentPage: React.FC = () => {
  const tr = useTr();
  const locale = useLocale();
  const id = useQueryParam('id');
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) return setError(tr('Het bestand is groter dan 4 MB. Kies een kleinere schermafbeelding.') as string);
    setBusy(true);
    setError('');
    const form = new FormData();
    form.set('id', id);
    form.set('note', note);
    form.set('file', file);
    try {
      const res = await fetch('/api/order/confirm-payment', { method: 'POST', body: form });
      if (res.ok) setDone(true);
      else if (res.status === 404) setError(tr('We kunnen deze bestelling niet vinden. Gebruik de link uit onze e-mail met betaalgegevens.') as string);
      else setError(tr('Uploaden is niet gelukt. Probeer het later opnieuw of mail ons de schermafbeelding.') as string);
    } catch {
      setError(tr('Uploaden is niet gelukt. Probeer het later opnieuw of mail ons de schermafbeelding.') as string);
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl space-y-3 px-4 py-12 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="font-display text-2xl font-extrabold text-slate-900">{tr('Bedankt, we hebben je bevestiging ontvangen')}</h1>
        <p className="text-sm text-slate-600">{tr('We controleren je betaling en bevestigen je bestelling per e-mail.')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">{tr('Betaalbevestiging uploaden')}</h1>
        {id && (
          <p className="mt-1 text-sm text-slate-600">
            {tr('Bestelling')} <span className="font-mono font-bold text-slate-900">{id}</span>
          </p>
        )}
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block text-sm text-slate-700">
          {tr('Schermafbeelding van je betaling (JPG, PNG, WebP of HEIC, max 4 MB)')}
          <input
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/heic"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:font-bold"
          />
        </label>
        <label className="block text-sm text-slate-700">
          {tr('Opmerking (optioneel)')}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={1000} className="mt-2 w-full rounded-lg border border-slate-200 p-2.5 text-sm" />
        </label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy || !file || !id} className="min-h-11 w-full rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-slate-400">
          {busy ? tr('Uploaden…') : tr('Bevestiging versturen')}
        </button>
      </form>
      <p className="text-xs text-slate-500" lang={locale}>{tr('Je schermafbeelding wordt alleen naar onze verkoopafdeling gemaild.')}</p>
    </div>
  );
};
