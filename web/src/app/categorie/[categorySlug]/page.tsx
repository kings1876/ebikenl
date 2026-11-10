import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/views/CategoryPage';

const CATEGORIES: Record<string, { title: string; description: string }> = {
  'elektrische-fietsen': {
    title: 'Elektrische fietsen kopen',
    description: 'Nieuwe elektrische fietsen van A-merken: stads-, trekking-, mountain-, vouw- en bakfietsen met fabrieksgarantie.',
  },
  'accus-en-opladers': {
    title: "E-bike accu's & opladers",
    description: "Originele accu's en opladers voor elektrische fietsen.",
  },
  accessoires: {
    title: 'E-bike accessoires & sloten',
    description: 'Sloten, helmen, tassen, verlichting en meer voor je elektrische fiets.',
  },
  onderdelen: {
    title: 'E-bike onderdelen',
    description: 'Banden, remmen, kettingen en riemen voor elektrische fietsen.',
  },
  service: {
    title: 'Montage & service',
    description: 'Montage, onderhoudspakketten en cadeaubonnen.',
  },
};

type Props = { params: Promise<{ categorySlug: string }> };

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const c = CATEGORIES[categorySlug];
  return c
    ? { title: c.title, description: c.description, alternates: { canonical: `/categorie/${categorySlug}` } }
    : {};
}

export default async function Page({ params }: Props) {
  const { categorySlug } = await params;
  if (!CATEGORIES[categorySlug]) notFound();
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}
