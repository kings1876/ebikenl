'use client';

// Short answers to the questions customers email about most. Every answer repeats what the checkout and order emails already say.
import { StaticHtml } from '@/components/StaticHtml';
import { useTr } from '@/i18n/locale';
import type { Locale } from '@/i18n/config';

const FAQ: { q: string; a: string }[] = [
  { q: 'Hoe kan ik betalen?', a: 'Je betaalt per bankoverschrijving of met crypto (BTC, USDT of ETH) met 10% korting. De betaalgegevens ontvang je na je bestelling per e-mail.' },
  { q: 'Wanneer wordt mijn e-bike geleverd?', a: 'De levertijd bevestigen we per e-mail, zodat je precies weet waar je aan toe bent.' },
  { q: 'Moet ik een account aanmaken?', a: 'Nee. Je plaatst je bestelling zonder account en ontvangt een bevestiging met je ordernummer per e-mail.' },
  { q: "Welke garantie krijg ik op een e-bike?", a: "Alle e-bikes zijn nieuw en worden geleverd met de fabrieksgarantie van de fabrikant. De voorwaarden voor frame, accu en motor staan in de documentatie van de fabrikant." },
  { q: "Kan ik een e-bike via mijn werkgever kopen?", a: "Ja, via een fietsplan (WKR) vraag je de fiets aan via je werkgever. De factuur voldoet aan de eisen voor WKR, FiscFree en Hellorider. Op de pagina Fietsplan lees je hoe het werkt." },
  { q: "Wat kost de bezorging?", a: "Bezorging is gratis in heel Nederland. Bij 100% rijklaar bezorgen belt de bezorger 30 minuten van tevoren en stelt hij zadel en stuur op jouw lengte af." },
  { q: 'Hoe kies ik de juiste framemaat?', a: 'Lees onze koopgids over framemaat of mail ons je lengte en de gewenste fiets; dan adviseren we je graag.' },
];

export function ContactFaq({ locale }: { locale?: Locale }) {
  void locale;
  const tr = useTr();
  return (
    <section aria-labelledby="contact-faq-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 id="contact-faq-heading" className="font-display text-xl font-extrabold tracking-tight text-slate-900">{tr('Veelgestelde vragen')}</h2>
      <StaticHtml as="dl" className="mt-4 grid gap-4 md:grid-cols-2">
        {FAQ.map(({ q, a }) => (
          <div key={q} className="rounded-xl border border-slate-200 bg-white p-4">
            <dt className="text-sm font-bold text-slate-900">{tr(q)}</dt>
            <dd className="mt-1 text-sm text-slate-700">{tr(a)}</dd>
          </div>
        ))}
      </StaticHtml>
    </section>
  );
}
