import type { Metadata } from 'next';
import { SEO_LANDING_PAGES } from '@/data/ebikes';
import { LandingPage } from '@/views/LandingPage';
import { landingSeed } from '@/lib/listingSeed';
import { pageMeta } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/jsonld';

const SLUG = 'speed-pedelecs';

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
  const l = SEO_LANDING_PAGES.find((x) => x.slug === SLUG);
  return (
    <>
      {l && <JsonLd data={breadcrumbLd('en', [{ name: l.title, path: `/${SLUG}` }])} />}
      <LandingPage customSlug={SLUG} seed={landingSeed(SLUG)} />
    </>
  );
}
