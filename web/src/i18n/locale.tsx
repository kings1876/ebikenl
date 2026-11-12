'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from './config';

type Translate = <T>(value: T) => T | string;

/** Dutch is the source language, so the Dutch site needs no dictionary at all. */
const identity: Translate = (value) => value;

const LocaleContext = createContext<{ locale: Locale; translate: Translate }>({ locale: 'nl', translate: identity });

/** The English dictionary (hundreds of KB) is only imported by EnLocaleProvider, so Dutch pages never download it. */
export function LocaleProvider({ locale, translate = identity, children }: { locale: Locale; translate?: Translate; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, translate }}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext).locale;

/** Returns tr(): Dutch source text in, text for the active locale out. Non-strings pass through. */
export function useTr() {
  return useContext(LocaleContext).translate;
}
