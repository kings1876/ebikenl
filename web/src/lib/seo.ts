import type { Metadata } from 'next';
import { withLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { translate } from '@/i18n/translate';

type PageMetaOptions = {
  /** Dutch source title (translated for English). Use `absoluteTitle` to skip the site suffix. */
  title: string;
  absoluteTitle?: boolean;
  description?: string;
  noindex?: boolean;
  images?: string[];
};

export const tx = (locale: Locale, text: string) => translate(locale, text) as string;

export function pageMeta(locale: Locale, path: string, o: PageMetaOptions): Metadata {
  const title = tx(locale, o.title);
  return {
    title: o.absoluteTitle ? { absolute: title } : title,
    ...(o.description ? { description: tx(locale, o.description) } : {}),
    alternates: {
      canonical: withLocale(path, locale),
      languages: {
        'nl-NL': path,
        en: withLocale(path, 'en'),
        'x-default': path,
      },
    },
    openGraph: {
      locale: locale === 'en' ? 'en_US' : 'nl_NL',
      ...(o.images ? { images: o.images } : {}),
    },
    ...(o.noindex ? { robots: { index: false, follow: o.noindex === true } } : {}),
  };
}

export const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'elektrische-fietsen': {
    title: 'Elektrische fietsen kopen',
    description: 'Nieuwe elektrische fietsen van A-merken: stads-, trekking-, mountain-, vouw- en bakfietsen met fabrieksgarantie.',
  },
  'accus-en-opladers': {
    title: "E-bike accu's & opladers",
    description: "Originele accu's en opladers voor elektrische fietsen.",
  },
  accessoires: {
    title: 'E-bike accessoires & sloten',
    description: 'Sloten, helmen, tassen, verlichting en meer voor je elektrische fiets.',
  },
  onderdelen: {
    title: 'E-bike onderdelen',
    description: 'Banden, remmen, kettingen en riemen voor elektrische fietsen.',
  },
  service: {
    title: 'Montage & service',
    description: 'Montage, onderhoudspakketten en cadeaubonnen.',
  },
};

export const brandSlug = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const LANDING_SLUGS = [
  'bosch-middenmotor',
  'elektrische-damesfiets',
  'e-bike-onder-2000',
  'fietsplan-e-bikes',
  'speed-pedelecs',
] as const;
