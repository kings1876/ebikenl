import type { Metadata } from 'next';
import { ContactPage } from '@/views/ContactPage';
import { pageMeta } from '@/lib/seo';
import { InfoBlock } from '@/components/InfoBlock';
import { ContactFaq } from '@/components/ContactFaq';

export const metadata: Metadata = pageMeta('en', '/contact', {
  title: 'Contact',
  description: 'Vragen over een e-bike of je bestelling? Neem contact op met EBIKE TE KOOP via het formulier of mail naar verkoop@ebike-te-koop.nl.',
});

export default function Page() {
  return (
    <>
      <ContactPage />
      <ContactFaq locale="en" />
      <InfoBlock locale="en" />
    </>
  );
}
