'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Mail } from 'lucide-react';

export const QUOTE_EVENT = 'blog:quote';

export interface QuoteOption {
  slug: string;
  label: string;
}

/** Free quote request. Posts to /api/contact (formName "quote"); the shop gets an email and the visitor a confirmation. */
export function QuoteForm({ source, options }: { source: string; options: QuoteOption[] }) {
  const root = useRef<HTMLElement>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', product: '', message: '', botcheck: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // "Gratis offerte" buttons elsewhere on the page pre-select a model and bring the visitor here.
  useEffect(() => {
    const onQuote = (e: Event) => {
      const slug = (e as CustomEvent<{ slug?: string }>).detail?.slug ?? '';
      setForm((f) => ({ ...f, product: slug }));
      setDone(false);
      root.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => nameField.current?.focus({ preventScroll: true }), 450);
    };
    window.addEventListener(QUOTE_EVENT, onQuote);
    return () => window.removeEventListener(QUOTE_EVENT, onQuote);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ formName: 'quote', locale: 'nl', source, ...form }),
      });
      if (res.ok) setDone(true);
      else setError('Versturen is niet gelukt. Probeer het opnieuw of mail ons direct.');
    } catch {
      setError('Versturen is niet gelukt. Probeer het opnieuw of mail ons direct.');
    }
    setBusy(false);
  };

  const input = 'mt-1 w-full min-h-11 rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600';

  return (
    <section id="offerte" ref={root} aria-labelledby="offerte-heading" className="my-12 scroll-mt-24 rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:p-8">
      <h2 id="offerte-heading" className="font-display text-2xl font-extrabold text-slate-900">Gratis offerte aanvragen</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Twijfel je tussen modellen of wil je de definitieve prijs weten? Vraag een gratis en vrijblijvende prijsopgave aan. We sturen je de offerte per e-mail.
      </p>

      {done ? (
        <div role="status" className="mt-5 space-y-2 rounded-2xl border border-emerald-200 bg-white p-6 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
          <p className="font-display text-lg font-extrabold text-slate-900">Bedankt, je aanvraag is ontvangen</p>
          <p className="text-sm text-slate-600">We hebben je een bevestiging gemaild. De offerte volgt per e-mail.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-slate-700">
            Naam *
            <input ref={nameField} required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            E-mailadres *
            <input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            Telefoonnummer (optioneel)
            <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            Voor welk model?
            <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className={input}>
              <option value="">Ik heb een algemene vraag</option>
              {options.map((o) => (
                <option key={o.slug} value={o.slug}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-700 sm:col-span-2">
            Bericht {form.product ? '(optioneel)' : '*'}
            <textarea
              rows={4}
              maxLength={2000}
              required={!form.product}
              minLength={form.product ? undefined : 5}
              placeholder="Bijvoorbeeld je lengte, waarvoor je de fiets gebruikt of welke vragen je hebt."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={input}
            />
          </label>
          {/* honeypot: hidden from people, filled in by simple bots */}
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.botcheck} onChange={(e) => setForm({ ...form, botcheck: e.target.value })} className="hidden" name="botcheck" />
          <div className="sm:col-span-2">
            {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-slate-400 sm:w-auto">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {busy ? 'Versturen…' : 'Vraag gratis offerte aan'}
            </button>
            <p className="mt-3 text-xs leading-5 text-slate-600">
              Je gegevens gebruiken we alleen om je offerte te sturen en je vraag te beantwoorden. Je bent niets verplicht.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
