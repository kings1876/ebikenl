import type { ReactNode } from 'react';
import { RootLayoutBase, rootMetadata } from '@/components/RootLayoutBase';
import { EnLocaleProvider } from '@/i18n/EnLocaleProvider';

export const metadata = rootMetadata('en');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayoutBase locale="en" Provider={EnLocaleProvider}>{children}</RootLayoutBase>;
}
