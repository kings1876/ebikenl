'use client';

import React, { useState } from 'react';
import { CheckCircle, Mail } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLocale, useTr } from '@/i18n/locale';
import { REPLY } from '@/config/reply';

export const ContactPage: React.FC = () => {
  const tr = useTr();
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', botcheck: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ formName: 'contact', locale, ...form }),
      });
      if (res.ok) setDone(true);
      else setError(tr('Versturen is niet gelukt. Mail ons direct of bel ons.') as string);
    } catch {
      setError(tr('Versturen is niet gelukt. Mail ons direct of bel ons.') as string);
    }
    setBusy(false);
  };

  const input = 'mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600';

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">{tr('Contact')}</h1>
        <p className="mt-1 text-sm text-slate-600">{tr('Vragen over een e-bike of over je bestelling? Stuur ons een bericht.')}</p>
      </div>

      <div className="grid gap-3 text-sm">
        <a href={`mailto:${REPLY.channels.email}`} className="flex min-h-14 items-center gap-3 rounded-xl bg-blue-600 p-5 text-base font-bold text-white shadow-sm hover:bg-blue-700 sm:text-lg">
          <Mail className="h-6 w-6 shrink-0" aria-hidden="true" />
          {REPLY.channels.email}
        </a>
      </div>

      {done ? (
        <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
          <h2 className="font-display text-xl font-extrabold text-slate-900">{tr('Bedankt voor je bericht')}</h2>
          <p className="text-sm text-slate-600">{tr('We reageren per e-mail.')}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-slate-600">
              {tr('Naam *')}
              <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
            </label>
            <label className="block text-xs text-slate-600">
              {tr('E-mailadres *')}
              <input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
            </label>
          </div>
          <label className="block text-xs text-slate-600">
            {tr('Telefoonnummer (optioneel)')}
            <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
          </label>
          <label className="block text-xs text-slate-600">
            {tr('Bericht *')}
            <textarea required rows={5} minLength={5} maxLength={4000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={input} />
          </label>
          {/* honeypot: hidden from people, filled in by simple bots */}
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.botcheck} onChange={(e) => setForm({ ...form, botcheck: e.target.value })} className="hidden" name="botcheck" />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="min-h-11 w-full rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-slate-400">
            {busy ? tr('Versturen…') : tr('Bericht versturen')}
          </button>
        </form>
      )}
    </div>
  );
};
