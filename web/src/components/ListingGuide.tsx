'use client';

import type { ReactNode } from 'react';
import type { ListingStats } from '@/lib/listingStats';
import { useLocale, useTr } from '@/i18n/locale';

// Text with {placeholders}, written once in Dutch and translated whole by tr(), as in ProductFaq.
const fill = (text: unknown, vars: Record<string, string | number>) => String(text).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

const TYPE_INFO: Record<string, string> = {
  "Stadsfietsen": "Stadsfietsen zitten comfortabel rechtop en zijn gemaakt voor woon-werkverkeer, boodschappen en korte ritten door de stad.",
  "Trekkingfietsen": "Trekkingfietsen combineren comfort met een stevig frame en bagagedragers, voor langere ritten en fietsvakanties.",
  "Elektrische mountainbikes": "Elektrische mountainbikes hebben vering, grove banden en krachtige motoren voor onverhard terrein en steile klimmen.",
  "Gravel & racefietsen": "Gravel- en racefietsen zijn licht en sportief, voor snelle ritten over asfalt en onverharde wegen.",
  "Vouwfietsen": "Vouwfietsen klap je in tot een compact formaat, handig voor in de trein, de auto of een kleine berging.",
  "Bakfietsen": "Bakfietsen vervoeren kinderen of lading en hebben een sterk frame en een krachtige motor.",
  "Speed pedelecs": "Speed pedelecs ondersteunen tot 45 km/u en zijn bedoeld voor lange woon-werkritten; ze vallen onder de regels voor bromfietsen.",
  "Kinder- & jongerenfietsen": "Kinder- en jongerenfietsen zijn lichter en kleiner gebouwd voor jongere rijders.",
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Wat is het verschil tussen een middenmotor en een naafmotor?',
    a: 'Een middenmotor zit bij de trapas en geeft een natuurlijk fietsgevoel met een goede gewichtsverdeling, vooral op hellingen. Een naafmotor zit in het voor- of achterwiel en is meestal lichter en voordeliger, maar voelt minder als een gewone fiets.',
  },
  {
    q: 'Hoe ver kom je met een e-bike?',
    a: 'Dat hangt af van de accu, de gekozen ondersteuning, je gewicht, het terrein en de wind. Een grotere accu geeft meer bereik. Kijk bij elk model naar de capaciteit in Wh en vergelijk modellen naast elkaar.',
  },
  {
    q: 'Welke framemaat past bij mij?',
    a: 'De framemaat hangt af van je lichaamslengte en je gewenste zithouding. Bij de meeste modellen zie je op de productpagina welke maten leverbaar zijn. Mail ons je lengte en we adviseren een maat.',
  },
  {
    q: 'Wat is een speed pedelec?',
    a: 'Een speed pedelec ondersteunt tot 45 km/u en geldt in Nederland als bromfiets. Je hebt een kenteken, een verzekering, een goedgekeurde helm en minimaal een AM-rijbewijs nodig.',
  },
  {
    q: "Wat betekent Wh bij een accu?",
    a: "Wh (wattuur) is de hoeveelheid energie in de accu. Hoe hoger het getal, hoe meer energie en dus hoe meer bereik bij vergelijkbaar gebruik. Een accu van 500 Wh is een gangbare keuze voor dagelijks gebruik.",
  },
  {
    q: "Wat is een lage instap?",
    a: "Een lage instap is een frame zonder hoge bovenbuis, waardoor je makkelijk op- en afstapt. Dat is handig bij korte ritten met veel stops, bij boodschappen en voor wie minder beweeglijk is.",
  },
  {
    q: "Hoe lang duurt de levering?",
    a: "De levertijd bevestigen we per e-mail na je bestelling, zodat je precies weet waar je aan toe bent. Bezorging is gratis in heel Nederland.",
  },
  {
    q: "Welke garantie krijg ik op een e-bike?",
    a: "Alle e-bikes zijn nieuw en worden geleverd met de fabrieksgarantie van de fabrikant. De voorwaarden voor frame, accu en motor staan in de documentatie van de fabrikant.",
  },
  {
    q: "Kan ik een e-bike via mijn werkgever kopen?",
    a: "Ja, via een fietsplan (WKR) vraag je de fiets aan via je werkgever. De factuur voldoet aan de eisen voor WKR, FiscFree en Hellorider. Op de pagina Fietsplan lees je hoe het werkt.",
  },
];

type GuideData = { vars: Record<string, string | number>; facts: string[]; advice: string[] };

function useGuideData(name: string, stats: ListingStats): GuideData {
  const tr = useTr();
  const locale = useLocale();
  const eur = (n: number) => `€${n.toLocaleString(locale === 'en' ? 'en-GB' : 'nl-NL')}`;
  const list = (items: [string, number][], translate = false) => items.map(([k, c]) => `${translate ? tr(k) : k} (${c})`).join(', ');
  const vars = {
    name,
    n: stats.n,
    min: eur(stats.min),
    max: eur(stats.max),
    median: eur(stats.median),
    brands: list(stats.brands),
    types: list(stats.types, true),
    motors: stats.motors.map(([k]) => k).join(', '),
    audiences: stats.audiences.map(([k]) => String(tr(k))).join(', '),
    minWh: stats.minWh,
    maxWh: stats.maxWh,
  };
  const facts = [
    stats.n === 1
      ? 'In deze selectie vind je 1 model, met een adviesprijs van {min} inclusief 21% BTW.'
      : 'In deze selectie vind je {n} modellen. De adviesprijzen lopen van {min} tot {max}; de middelste prijs is {median}, inclusief 21% BTW.',
    stats.brands.length > 1 ? 'Merken in deze selectie: {brands}.' : '',
    stats.types.length > 1 ? 'Het aanbod bestaat uit: {types}.' : '',
    stats.motors.length ? 'De motoren komen van {motors}.' : '',
    stats.maxWh ? "De accu's hebben een capaciteit van {minWh} tot {maxWh} Wh. Een grotere accu geeft meer bereik, maar maakt de fiets ook zwaarder en duurder." : '',
    stats.audiences.length > 1 ? 'Er zijn modellen voor: {audiences}.' : '',
  ].filter(Boolean);
  const advice = [
    'Kies motor en accu op basis van je route. Voor vlak terrein en korte ritten is een lichte motor met een kleinere accu genoeg. Voor heuvels, zware belading of lange ritten kies je een krachtige motor met een grotere accu. Let ook op de framemaat en de framevorm: een lage instap stapt makkelijker op en af, een diamantframe is stijver en sportiever.',
    'Vergelijk e-bikes op vier punten: de motor (merk en koppel in Nm), de accu (capaciteit in Wh), het gewicht en het frame. Meer koppel helpt bij heuvels en zware belading, een lichtere fiets rijdt en draagt makkelijker. Zet je favorieten naast elkaar op de vergelijkpagina om de verschillen te zien.',
    'Op elke productpagina vind je de volledige specificaties, de beschikbare framematen en kleuren en de manier van bezorgen. Staat je vraag er niet bij, mail dan naar verkoop@e-bike-tekoop.nl; we helpen je graag bij het kiezen van het juiste model en de juiste maat.',
    'Alle e-bikes zijn nieuw en worden gratis bezorgd in heel Nederland. Je betaalt per bankoverschrijving of met crypto (BTC, USDT of ETH) met 10% korting. Twijfel je tussen modellen? Gebruik de keuzehulp of zet e-bikes naast elkaar op de vergelijkpagina.',
  ];
  return { vars, facts, advice };
}

function Paragraphs({ items, vars }: { items: string[]; vars: GuideData['vars'] }) {
  const tr = useTr();
  return items.map((p) => (
    <p key={p} className="mt-3 leading-relaxed">
      {fill(tr(p), vars)}
    </p>
  ));
}

function TypeList({ stats }: { stats: ListingStats }) {
  const tr = useTr();
  if (stats.types.length < 2) return null;
  return (
    <ul className="mt-3 list-disc space-y-1 pl-5">
      {stats.types.map(([t]) => TYPE_INFO[t] && <li key={t}>{tr(TYPE_INFO[t])}</li>)}
    </ul>
  );
}

function FaqList() {
  const tr = useTr();
  return (
    <dl>
      {FAQ.map(({ q, a }) => (
        <div key={q}>
          <dt>{tr(q)}</dt>
          <dd>{tr(a)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The guide as one block: facts, buying advice and FAQ together. Used under listings. */
export function ListingGuide({ name, stats }: { name: string; stats: ListingStats }) {
  const tr = useTr();
  const { vars, facts, advice } = useGuideData(name, stats);
  if (stats.n === 0) return null;
  return (
    <section aria-labelledby="guide-heading">
      <div className="faq">
        <h2 id="guide-heading">{fill(tr('{name}: prijzen, motoren en keuzetips'), vars)}</h2>
        <Paragraphs items={[...facts, ...advice]} vars={vars} />
        <TypeList stats={stats} />
        <h2>{tr('Veelgestelde vragen')}</h2>
        <FaqList />
      </div>
    </section>
  );
}

// The same text in three parts, so a page can place them apart (the home page puts one between each of its sections).
// Each part is its own section with its own heading; none of them needs the others.
const Part = ({ id, children }: { id: string; children: ReactNode }) => (
  <section aria-labelledby={id} className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    <div className="faq">{children}</div>
  </section>
);

/** Part 1: the numbers (how many models, prices, brands, motors, batteries) and what each type of bike is for. */
export function GuideFacts({ name, stats }: { name: string; stats: ListingStats }) {
  const tr = useTr();
  const { vars, facts } = useGuideData(name, stats);
  if (stats.n === 0) return null;
  return (
    <Part id="guide-facts">
      <h2 id="guide-facts">{fill(tr('{name} in het kort'), vars)}</h2>
      <Paragraphs items={facts} vars={vars} />
      <TypeList stats={stats} />
    </Part>
  );
}

/** Part 2: how to choose, compare, and order. */
export function GuideAdvice({ name, stats }: { name: string; stats: ListingStats }) {
  const tr = useTr();
  const { vars, advice } = useGuideData(name, stats);
  if (stats.n === 0) return null;
  return (
    <Part id="guide-advice">
      <h2 id="guide-advice">{tr('Zo kies je de juiste e-bike')}</h2>
      <Paragraphs items={advice} vars={vars} />
    </Part>
  );
}

/** Part 3: the questions buyers ask most. */
export function GuideFaq() {
  const tr = useTr();
  return (
    <Part id="guide-faq">
      <h2 id="guide-faq">{tr('Veelgestelde vragen')}</h2>
      <FaqList />
    </Part>
  );
}
