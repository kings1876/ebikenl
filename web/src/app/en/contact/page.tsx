import type { Metadata } from 'next';
import { ContactPage } from '@/views/ContactPage';
import { pageMeta } from '@/lib/seo';
import { InfoBlock } from '@/components/InfoBlock';

export const metadata: Metadata = pageMeta('en', '/contact', {
  title: 'Contact',
  description: 'Vragen over een e-bike of je bestelling? Neem contact op met E-BIKE-TEKOOP.NL via het formulier of mail naar verkoop@e-bike-tekoop.nl.',
});

export default function Page() {
  return (
    <>
      <ContactPage />
      <InfoBlock locale="en" />
    </>
  );
}
