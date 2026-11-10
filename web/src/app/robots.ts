import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://e-bike-tekoop.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/winkelwagen', '/afrekenen', '/vergelijken', '/taxonomie', '/bestelling-bevestigd', '/en/winkelwagen', '/en/afrekenen', '/en/vergelijken', '/en/taxonomie', '/en/bestelling-bevestigd'] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
