import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { ServiceHome } from '@/components/ServiceView';
import { SERVICE_FAQ, SERVICE_PAGES } from '@/data/service';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd } from '@/lib/jsonld';

// Dutch only (like the blog): no English alternates.
export const metadata: Metadata = {
  ...pageMeta('nl', '/klantenservice', {
    title: 'Klantenservice: bestellen, betalen, bezorgen en retourneren',
    description: 'Antwoorden op je vragen over bestellen, betalen, bezorgen, retourneren en garantie bij EBIKE TE KOOP, plus de algemene voorwaarden en de privacyverklaring.',
  }),
  alternates: { canonical: '/klantenservice' },
};

const TOPICS =SERVICE_PAGES.map(({ slug, label, description }) => ({ slug, label, description }));

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd('nl', [{ name: 'Klantenservice', path: '/klantenservice' }])} />
      <ServiceHome faq={SERVICE_FAQ} topics={TOPICS} />
    </>
  );
}
