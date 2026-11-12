'use client';

import type { ReactNode } from 'react';
import { LocaleProvider } from './locale';
import { translate } from './translate';

const toEnglish = <T,>(value: T) => translate('en', value) as T | string;

export function EnLocaleProvider({ children }: { children: ReactNode }) {
  return <LocaleProvider locale="en" translate={toEnglish}>{children}</LocaleProvider>;
}
