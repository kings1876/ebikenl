import type { Metadata } from 'next';
import { SEO_LANDING_PAGES } from '@/data/ebikes';
import { LandingPage } from '@/views/LandingPage';
import { pageMeta } from '@/lib/seo';

const SLUG = 'e-bike-onder-2000';

export function generateMetadata(): Metadata {
  const l = SEO_LANDING_PAGES.find((x) => x.slug === SLUG);
  if (!l) return {};
  return pageMeta('en', `/${SLUG}`, {
    title: l.metaTitle,
    absoluteTitle: true,
    description: l.metaDescription,
  });
}

export default function Page() {
  return <LandingPage customSlug={SLUG} />;
}
