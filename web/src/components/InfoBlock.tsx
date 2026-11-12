// Short, factual server-rendered text block: how ordering works. Used on thin pages (brand pages, contact, e-bike finder).
import { tx } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

const TITLE = 'Zo bestel je bij E-BIKE-TEKOOP.NL';
const STEPS = [
  'Kies je model, leg het in de winkelwagen en rond de bestelling af. Je hoeft geen account aan te maken.',
  'Je betaalt per bankoverschrijving of met crypto (BTC, USDT of ETH) met 10% korting. De betaalgegevens ontvang je per e-mail.',
  'De levertijd bevestigen we per e-mail, zodat je precies weet waar je aan toe bent.',
  'Alle e-bikes zijn nieuw en worden geleverd met de fabrieksgarantie van de fabrikant.',
  'Twijfel je tussen modellen? Gebruik de keuzehulp of zet e-bikes naast elkaar op de vergelijkpagina.',
  'Na je bestelling ontvang je een bevestiging per e-mail met je ordernummer.',
  'Meer weten over accu, motor of framemaat? Lees onze koopgidsen op de blogpagina.',
  'Wil je een e-bike via je werkgever aanvragen? Bekijk dan de pagina Fietsplan (WKR).',
  'Een vraag over framemaat, accu, motor of levering vooraf? Mail naar verkoop@e-bike-tekoop.nl en we helpen je verder.',
];

export function InfoBlock({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="order-info-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 id="order-info-heading" className="font-display text-xl font-extrabold tracking-tight text-slate-900">{tx(locale, TITLE)}</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {STEPS.map((s) => (
            <li key={s}>{tx(locale, s)}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
