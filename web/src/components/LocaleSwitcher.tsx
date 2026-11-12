'use client';

import NextLink from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { stripLocale, withLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { useLocale } from '@/i18n/locale';

const LABELS: Record<Locale, string> = { nl: 'NL', en: 'EN' };
const NAMES: Record<Locale, string> = { nl: 'Nederlands', en: 'English' };

function Switcher() {
  const locale = useLocale();
  const pathname = stripLocale(usePathname());
  const search = useSearchParams().toString();

  const hrefFor = (target: Locale) => {
    const path = withLocale(pathname, target);
    return search ? `${path}?${search}` : path;
  };

  return (
    <div className="flex items-center gap-1 text-[11px] font-semibold" role="group" aria-label="Taal / Language">
      {(['nl', 'en'] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-500">|</span>}
          <NextLink prefetch={false}
            href={hrefFor(l)}
            hrefLang={l}
            lang={l}
            title={NAMES[l]}
            aria-current={l === locale ? 'true' : undefined}
            className={l === locale ? 'text-white underline underline-offset-2' : 'text-slate-400 hover:text-white'}
          >
            {LABELS[l]}
          </NextLink>
        </span>
      ))}
    </div>
  );
}

export function LocaleSwitcher() {
  // useSearchParams needs a Suspense boundary for static pages.
  return (
    <Suspense fallback={<div className="w-12" aria-hidden />}>
      <Switcher />
    </Suspense>
  );
}
