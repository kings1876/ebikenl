import type { MetadataRoute } from 'next';
import { ALL_BRANDS, PRODUCTS } from '@/data/ebikes';
import { CATEGORY_META, LANDING_SLUGS, brandSlug } from '@/lib/seo';
import { withLocale } from '@/i18n/config';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://e-bike-tekoop.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/keuzehulp',
    ...Object.keys(CATEGORY_META).map((s) => `/categorie/${s}`),
    ...ALL_BRANDS.map((b) => `/merk/${brandSlug(b)}`),
    ...LANDING_SLUGS.map((s) => `/${s}`),
    ...PRODUCTS.map((p) => `/product/${p.slug}`),
  ];

  return paths.flatMap((path) =>
    (['nl', 'en'] as const).map((locale) => ({
      url: `${SITE}${withLocale(path, locale)}`,
      alternates: {
        languages: {
          'nl-NL': `${SITE}${path}`,
          en: `${SITE}${withLocale(path, 'en')}`,
        },
      },
    })),
  );
}
