import type { MetadataRoute } from 'next';
import { ACTIVE_CATEGORY_SLUGS, BRANDS_WITH_PRODUCTS, PRODUCTS } from '@/data/ebikes';
import { LANDING_SLUGS, brandSlug } from '@/lib/seo';
import { withLocale } from '@/i18n/config';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://e-bike-tekoop.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/keuzehulp',
    ...ACTIVE_CATEGORY_SLUGS.map((s) => `/categorie/${s}`),
    ...BRANDS_WITH_PRODUCTS.map((b) => `/merk/${brandSlug(b)}`),
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
