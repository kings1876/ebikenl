'use client';

import { StaticHtml } from '@/components/StaticHtml';
import type { Product } from '@/types/ebike';
import { useTr } from '@/i18n/locale';
import { formatEur, formatEurWithCents, cryptoPrice } from '@/utils/format';
import { ORDER_STEPS, ORDER_TITLE } from '@/lib/orderSteps';

// Question and answer text with {placeholders}. Written once in Dutch, translated whole by tr(), filled in afterwards.
const fill = (text: unknown, vars: Record<string, string>) => String(text).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/**
 * Questions buyers ask about this model, answered from the model's own data. Plain text in the page (not behind a tab), so it is
 * there for people and search engines alike. A client component on purpose: its markup is rendered once in the HTML, instead of
 * a second time in the framework's payload as it would be for a server component.
 */
export function ProductFaq({ product }: { product: Product }) {
  const tr = useTr();
  const sizes = (product.framematen ?? []).join(', ');
  const motor = product.motormerk && product.motormerk !== ('Geen' as never) ? String(product.motormerk) : '';
  const vars = {
    // the model name without its spec list ("Stromer ST3", not "Stromer ST3, SYNO Drive II (820 W), 983 Wh")
    title: String(tr(product.title.split(', ')[0])),
    brand: String(tr(product.brand)),
    sub: String(tr(product.subCategory)),
    price: formatEur(product.price),
    crypto: formatEurWithCents(cryptoPrice(product.price)),
    sizes,
    motor,
    battery: product.accucapaciteit ? String(product.accucapaciteit) : '',
    model: product.motorModel ?? '',
    torque: product.motorTorqueNm ? String(product.motorTorqueNm) : '',
    wh: product.accuWhNumber ? String(product.accuWhNumber) : '',
    kg: product.gewichtKg ? String(product.gewichtKg) : '',
  };

  const items: { q: string; a: string | string[] }[] = [
    {
      q: 'Wat kost de {title}?',
      a: 'De adviesprijs van de {title} is {price} inclusief 21% BTW. Betaal je met crypto (BTC, USDT of ETH), dan krijg je 10% korting en betaal je {crypto}. Bezorging is gratis in heel Nederland.',
    },
    ...(sizes
      ? [
          {
            q: 'Welke framematen zijn er voor de {title}?',
            a: 'De {title} is leverbaar in de maten {sizes}. Zit je tussen twee maten in, kies dan de kleinste voor een rechtopzittende houding en de grotere voor een sportievere zit. Mail ons je lichaamslengte en we adviseren een maat.',
          },
        ]
      : []),
    {
      q: 'Waarvoor is de {title} geschikt?',
      a: [
        'De {title} van {brand} hoort bij de categorie {sub}.',
        motor && vars.battery ? 'De motor is van {motor} en de accu heeft een capaciteit van {battery}.' : '',
        'Zet de fiets op de vergelijkpagina naast andere modellen, of gebruik de keuzehulp om te zien welke e-bike bij jouw gebruik past.',
      ],
    },
    ...(motor
      ? [
          {
            q: 'Welke motor en accu heeft de {title}?',
            a: [
              vars.model ? 'De {title} heeft een {motor}-motor ({model}).' : 'De {title} heeft een {motor}-motor.',
              vars.torque ? 'De motor levert {torque} Nm koppel.' : '',
              vars.wh ? 'De accu heeft een capaciteit van {wh} Wh.' : '',
              vars.kg ? 'Het gewicht van de fiets is {kg} kg.' : '',
            ],
          },
        ]
      : []),
    {
      q: 'Hoe wordt de {title} bezorgd?',
      a: 'We leveren gratis in heel Nederland. Bij 100% rijklaar bezorgen belt de bezorger 30 minuten van tevoren, stelt hij zadel en stuur op jouw lengte af en legt hij de boordcomputer en de accu uit. Kies je de fabrieksdoos, dan is de fiets voor 90% gemonteerd en monteer je zelf het voorwiel, het stuur en de pedalen.',
    },
    {
      q: 'Welke garantie zit er op de {title}?',
      a: 'Alle e-bikes zijn nieuw en worden geleverd met de fabrieksgarantie van {brand}. De voorwaarden voor frame, accu en motor staan in de documentatie van de fabrikant. De fiets voldoet aan EN 15194 en heeft een CE-markering.',
    },
    {
      q: 'Hoe betaal ik voor de {title}?',
      a: 'Je betaalt per bankoverschrijving of met crypto (BTC, USDT of ETH). Na je bestelling ontvang je de betaalgegevens en een bevestiging met je ordernummer per e-mail. Je hoeft geen account aan te maken.',
    },
    { q: "Is de {title} nieuw?", a: "Ja. Alle e-bikes die we verkopen zijn nieuw, van bekende merken, en worden geleverd met de fabrieksgarantie van {brand}." },
    { q: "Wat zit er in de prijs van de {title}?", a: "De prijs van {price} is inclusief 21% BTW en gratis bezorging in heel Nederland. Kies je 100% rijklaar bezorgen, dan is de fiets afgesteld op jouw lengte en klaar om te rijden." },
    { q: "Kan ik de {title} vergelijken met andere e-bikes?", a: "Ja. Voeg de fiets met de vergelijkknop toe aan de vergelijking en zet hem naast andere modellen om motor, accu, gewicht en prijs te vergelijken. Twijfel je welke e-bike bij je past, gebruik dan de keuzehulp." },
    {
      q: 'Kan ik de {title} via mijn werkgever kopen?',
      a: 'Ja, via een fietsplan (WKR) vraag je de fiets aan via je werkgever. De factuur voldoet aan de eisen voor WKR, FiscFree en Hellorider. Op de pagina Fietsplan lees je hoe het werkt en wat het je scheelt.',
    },
  ];

  return (
    <StaticHtml as="section" className="faq">
      <h2 id="faq-heading">{fill(tr('Veelgestelde vragen over de {title}'), vars)}</h2>
      <dl>
        {items.map(({ q, a }) => (
          <div key={q}>
            <dt>{fill(tr(q), vars)}</dt>
            <dd>{[a].flat().filter(Boolean).map((part) => fill(tr(part), vars)).join(' ')}</dd>
          </div>
        ))}
      </dl>
      <h2>{tr(ORDER_TITLE)}</h2>
      <ol>
        {ORDER_STEPS.map((s) => (
          <li key={s}>{tr(s)}</li>
        ))}
      </ol>
    </StaticHtml>
  );
}
