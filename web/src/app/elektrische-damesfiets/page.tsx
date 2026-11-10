import type { Metadata } from 'next';
import { SEO_LANDING_PAGES } from '@/data/ebikes';
import { LandingPage } from '@/views/LandingPage';

const SLUG = 'elektrische-damesfiets';

export function generateMetadata(): Metadata {
  const l = SEO_LANDING_PAGES.find((x) => x.slug === SLUG);
  return l
    ? { title: { absolute: l.metaTitle }, description: l.metaDescription, alternates: { canonical: `/${SLUG}` } }
    : {};
}

export default function Page() {
  return <LandingPage customSlug={SLUG} />;
}
