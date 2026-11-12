import type { ReactNode } from 'react';
import { RootLayoutBase, rootMetadata } from '@/components/RootLayoutBase';
import { NlLocaleProvider } from '@/i18n/NlLocaleProvider';

export const metadata = rootMetadata('nl');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayoutBase locale="nl" Provider={NlLocaleProvider}>{children}</RootLayoutBase>;
}
