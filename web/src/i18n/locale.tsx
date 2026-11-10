'use client';

import { createContext, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from './config';
import { translate } from './translate';

const LocaleContext = createContext<Locale>('nl');

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/** Returns tr(): Dutch source text in, text for the active locale out. Non-strings pass through. */
export function useTr() {
  const locale = useLocale();
  return useCallback(<T,>(value: T) => translate(locale, value) as T | string, [locale]);
}
