'use client';

// Client half of ModelIndex: the same markup, but props are a compact list instead of a server-rendered tree,
// so the page's framework payload does not carry a second copy of every link and class name.
import Link from 'next/link';
import { StaticHtml } from '@/components/StaticHtml';
import { withLocale } from '@/i18n/config';
import { useLocale, useTr } from '@/i18n/locale';

export type ModelIndexItem = { slug: string; label: string; price: number; group: string };

export function ModelIndexList({ items, translateGroups, title }: { items: ModelIndexItem[]; translateGroups: boolean; title: string }) {
  const locale = useLocale();
  const tr = useTr();
  const eur = (n: number) => `€${n.toLocaleString(locale === 'en' ? 'en-GB' : 'nl-NL')}`;
  const groups = new Map<string, ModelIndexItem[]>();
  for (const it of items) groups.set(it.group, [...(groups.get(it.group) ?? []), it]);
  return (
    <section aria-labelledby="model-index-heading" className="below mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 id="model-index-heading" className="font-display text-xl font-extrabold tracking-tight text-slate-900">
        {tr('Alle modellen')}: {title} ({items.length})
      </h2>
      <p className="mt-1 text-sm text-slate-600">{tr("Elk model met zijn adviesprijs. Specificaties en foto's vind je op de productpagina.")}</p>
      <StaticHtml className="mt-5 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {[...groups.entries()].map(([group, list]) => (
          <div key={group} className="mb-6 break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900">{translateGroups ? tr(group) : group}</h3>
            <ul className="mt-2 space-y-1 text-sm [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-900">
              {list.map((p) => (
                <li key={p.slug}>
                  <Link prefetch={false} href={withLocale(`/product/${p.slug}`, locale)}>
                    {p.label}
                  </Link>
                  {' '}· {eur(p.price)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </StaticHtml>
    </section>
  );
}
