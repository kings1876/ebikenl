// Schema.org builders. Only facts the site really has: no invented ratings or reviews. Every product carries an
// Offer with the price the shop shows (for converted prices the page itself says the price is indicative).
import { SITE_URL, SITE_NAME, tx } from './seo';
import { withLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import type { Product } from '@/types/ebike';

const abs = (path: string, locale: Locale) => `${SITE_URL}${withLocale(path, locale)}`;

export function breadcrumbLd(locale: Locale, items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tx(locale, it.name),
      ...(it.path ? { item: abs(it.path, locale) } : {}),
    })),
  };
}

export function websiteLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: abs('/', locale),
    inLanguage: locale === 'en' ? 'en' : 'nl-NL',
  };
}

export function productLd(p: Product, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    url: abs(`/product/${p.slug}`, locale),
    sku: p.id,
    image: p.galleryImages.map((src) => `${SITE_URL}${src}`),
    description: tx(locale, p.description),
    brand: { '@type': 'Brand', name: p.brand },
    offers: { '@type': 'Offer', url: abs(`/product/${p.slug}`, locale), price: p.price, priceCurrency: 'EUR', itemCondition: 'https://schema.org/NewCondition' },
  };
}
