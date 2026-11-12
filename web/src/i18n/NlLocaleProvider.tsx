'use client';

import type { ReactNode } from 'react';
import { LocaleProvider } from './locale';

/** Dutch is the source language: no dictionary needed. */
export function NlLocaleProvider({ children }: { children: ReactNode }) {
  return <LocaleProvider locale="nl">{children}</LocaleProvider>;
}
