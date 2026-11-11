import type { MetadataRoute } from 'next';
import { CATEGORY_SLUG_TO_MAIN } from '@/data/ebikes';
import { ACTIVE_CATEGORY_SLUGS, ACTIVE_TAXONOMY_CATEGORIES, BRANDS_WITH_PRODUCTS, PRODUCTS } from '@/data/catalog';
import { SITE_URL, LANDING_SLUGS, brandSlug } from '@/lib/seo';
import { SUB_COPY, subSlug } from '@/lib/seoCopy';
import { withLocale } from '@/i18n/config';

const SITE = SITE_URL;

// Content changes when the catalogue is refreshed, so the newest retrieval date is the honest <lastmod>.
const dates = PRODUCTS.map((p) => p.source?.retrieved).filter(Boolean) as string[];
const LATEST = new Date(dates.sort().at(-1) ?? Date.now());

type Entry = { path: string; images?: string[]; lastModified?: Date };

export default function sitemap(): MetadataRoute.Sitemap {
  const subPaths = ACTIVE_TAXONOMY_CATEGORIES.flatMap((cat) => {
    const catSlug = Object.keys(CATEGORY_SLUG_TO_MAIN).find((k) => CATEGORY_SLUG_TO_MAIN[k] === cat.main)!;
    return cat.subs.filter((sub) => SUB_COPY[sub]).map((sub) => `/categorie/${catSlug}/${subSlug(sub)}`);
  });

  const entries: Entry[] = [
    '/',
    '/keuzehulp',
    '/contact',
    ...ACTIVE_CATEGORY_SLUGS.map((s) => `/categorie/${s}`),
    ...subPaths,
    ...BRANDS_WITH_PRODUCTS.map((b) => `/merk/${brandSlug(b)}`),
    ...LANDING_SLUGS.map((s) => `/${s}`),
  ].map((path) => ({ path, lastModified: LATEST }));

  for (const p of PRODUCTS) {
    entries.push({
      path: `/product/${p.slug}`,
      lastModified: p.source?.retrieved ? new Date(p.source.retrieved) : LATEST,
      images: p.galleryImages.map((src) => `${SITE}${src}`),
    });
  }

  return entries.flatMap(({ path, images, lastModified }) =>
    (['nl', 'en'] as const).map((locale) => ({
      url: `${SITE}${withLocale(path, locale)}`,
      lastModified,
      ...(images ? { images } : {}),
      alternates: {
        languages: {
          'nl-NL': `${SITE}${path}`,
          en: `${SITE}${withLocale(path, 'en')}`,
        },
      },
    })),
  );
}
