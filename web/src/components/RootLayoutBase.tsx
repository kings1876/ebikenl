import type { ComponentType, ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SiteShell } from '@/components/SiteShell';
import type { Locale } from '@/i18n/config';
import { SITE_URL, tx } from '@/lib/seo';
import { POPULAR_BRANDS } from '@/data/catalog';
import '@/app/globals.css';

const jakarta = Plus_Jakarta_Sans({ variable: '--font-jakarta', subsets: ['latin'] });
// One typeface for body and headings: a second font file is one more request on every page's critical path.

export function rootMetadata(locale: Locale) {
  return {
    title: {
      default: tx(locale, 'Elektrische fiets kopen | E-bikes van Cube, Giant, Scott'),
      template: '%s | E-BIKE-TEKOOP.NL',
    },
    description: tx(
      locale,
      'Vergelijk nieuwe elektrische fietsen van Cube, Giant, Scott, Specialized en Kalkhoff. Bekijk modellen, specificaties en adviesprijzen op één plek.',
    ),
    applicationName: 'E-BIKE-TEKOOP.NL',
    metadataBase: new URL(SITE_URL),
    openGraph: {
      locale: locale === 'en' ? 'en_US' : 'nl_NL',
      type: 'website' as const,
      siteName: 'E-BIKE-TEKOOP.NL',
    },
  };
}

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'E-BIKE-TEKOOP.NL',
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
};

// The provider is passed in by each locale's layout so the English dictionary only ever reaches /en pages.
export function RootLayoutBase({ locale, Provider, children }: { locale: Locale; Provider: ComponentType<{ children: ReactNode }>; children: ReactNode }) {
  return (
    <html lang={locale} className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
        <Provider>
          <SiteShell popularBrands={POPULAR_BRANDS}>{children}</SiteShell>
        </Provider>
      </body>
    </html>
  );
}
