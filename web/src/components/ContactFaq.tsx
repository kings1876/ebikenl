// Short answers to the questions customers email about most. Every answer repeats what the checkout and order emails already say.
import { tx } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

const FAQ: { q: string; a: string }[] = [
  { q: 'Hoe kan ik betalen?', a: 'Je betaalt per bankoverschrijving of met crypto (BTC, USDT of ETH) met 10% korting. De betaalgegevens ontvang je na je bestelling per e-mail.' },
  { q: 'Wanneer wordt mijn e-bike geleverd?', a: 'De levertijd bevestigen we per e-mail, zodat je precies weet waar je aan toe bent.' },
  { q: 'Moet ik een account aanmaken?', a: 'Nee. Je plaatst je bestelling zonder account en ontvangt een bevestiging met je ordernummer per e-mail.' },
  { q: 'Hoe kies ik de juiste framemaat?', a: 'Lees onze koopgids over framemaat of mail ons je lengte en de gewenste fiets; dan adviseren we je graag.' },
];

export function ContactFaq({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="contact-faq-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 id="contact-faq-heading" className="font-display text-xl font-extrabold tracking-tight text-slate-900">{tx(locale, 'Veelgestelde vragen')}</h2>
      <dl className="mt-4 grid gap-4 md:grid-cols-2">
        {FAQ.map(({ q, a }) => (
          <div key={q} className="rounded-xl border border-slate-200 bg-white p-4">
            <dt className="text-sm font-bold text-slate-900">{tx(locale, q)}</dt>
            <dd className="mt-1 text-sm text-slate-700">{tx(locale, a)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
