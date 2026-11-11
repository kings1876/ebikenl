import type { ReactNode } from 'react';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { SiteShell } from '@/components/SiteShell';
import { LocaleProvider } from '@/i18n/locale';
import type { Locale } from '@/i18n/config';
import { tx } from '@/lib/seo';
import { POPULAR_BRANDS } from '@/data/ebikes';
import '@/app/globals.css';

const jakarta = Plus_Jakarta_Sans({ variable: '--font-jakarta', subsets: ['latin'] });
const outfit = Outfit({ variable: '--font-outfit', subsets: ['latin'] });

export function rootMetadata(locale: Locale) {
  return {
    title: {
      default: tx(locale, 'Elektrische fiets kopen | Nieuwe e-bikes van Cube, Giant, Scott'),
      template: '%s | E-BIKE-TEKOOP.NL',
    },
    description: tx(
      locale,
      'Vergelijk nieuwe elektrische fietsen van Cube, Giant, Scott, Specialized en Kalkhoff. Bekijk modellen, specificaties en adviesprijzen op één plek.',
    ),
    applicationName: 'E-BIKE-TEKOOP.NL',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://e-bike-tekoop.vercel.app'),
    openGraph: {
      locale: locale === 'en' ? 'en_US' : 'nl_NL',
      type: 'website' as const,
      siteName: 'E-BIKE-TEKOOP.NL',
    },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://e-bike-tekoop.vercel.app';
const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'E-BIKE-TEKOOP.NL',
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
};

export function RootLayoutBase({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${jakarta.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
        <LocaleProvider locale={locale}>
          <SiteShell popularBrands={POPULAR_BRANDS}>{children}</SiteShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
