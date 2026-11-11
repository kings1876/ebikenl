import { SITE_URL } from '@/lib/seo';
import type { MetadataRoute } from 'next';

const SITE = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/winkelwagen', '/afrekenen', '/vergelijken', '/taxonomie', '/bestelling-bevestigd', '/en/winkelwagen', '/en/afrekenen', '/en/vergelijken', '/en/taxonomie', '/en/bestelling-bevestigd', '/admin', '/order/', '/en/order/', '/api/'] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
