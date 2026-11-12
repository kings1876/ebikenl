import { SITE_URL } from '@/lib/seo';
import type { MetadataRoute } from 'next';

const SITE = SITE_URL;

// Cart, checkout and compare pages stay crawlable but carry noindex (Google prefers that to a robots block, which cannot show the noindex).
// Developer, order-token, admin and API paths stay blocked.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/taxonomie', '/bestelling-bevestigd', '/en/taxonomie', '/en/bestelling-bevestigd', '/admin', '/order/', '/en/order/', '/api/'] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
