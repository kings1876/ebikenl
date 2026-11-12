'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from '@/lib/router';
import { SEO_LANDING_PAGES, LandingPageDef } from '../data/ebikes';
import { CARD_PRODUCTS as PRODUCTS } from '../data/slim';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination, PAGE_SIZE } from '../components/Pagination';
import { CheckCircle, Tag, ArrowRight, ShieldCheck, Zap } from '@/components/icons';
import { useTr } from '@/i18n/locale';

interface LandingPageProps {
  customSlug?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ customSlug }) => {
  const tr = useTr();

  const params = useParams<{ slug?: string }>();
  const activeSlug = customSlug || params.slug || 'bosch-middenmotor';

  const landing: LandingPageDef =
    SEO_LANDING_PAGES.find((l) => l.slug === activeSlug) || SEO_LANDING_PAGES[0];

  const [page, setPage] = useState(1);
  const gridTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
  }, [landing]);

  // Filter matching products
  const matchingProducts = PRODUCTS.filter((p) => {
    if (landing.priceMax && (p.price ?? 0) > landing.priceMax) return false;
    if (landing.matchFilter.motormerk && p.motormerk !== landing.matchFilter.motormerk) return false;
    if (landing.matchFilter.motorpositie && p.motorpositie !== landing.matchFilter.motorpositie) return false;
    if (landing.matchFilter.doelgroep && p.doelgroep !== landing.matchFilter.doelgroep) return false;
    if (landing.matchFilter.maximaleSnelheid && p.maximaleSnelheid !== landing.matchFilter.maximaleSnelheid) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(matchingProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = matchingProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goToPage = (n: number) => {
    setPage(n);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Collecties', path: '/' },
          { label: landing.title }
        ]}
      />

      {/* SEO Landingspagina Hero */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 space-y-4">

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
          {tr(landing.h1)}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {tr(landing.subtitle)} {tr(landing.metaDescription)}
        </p>

        {/* Highlight points */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
          {landing.highlightPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-800/70 p-3 rounded-lg border border-slate-700/60">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{tr(point)}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Other Curated Landing Pages Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <span className="text-slate-400 shrink-0 mr-1">{tr("Andere thema's:")}</span>
        {SEO_LANDING_PAGES.map((l) => (
          <Link
            key={l.slug}
            to={`/${l.slug}`}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
              l.slug === landing.slug
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tr(l.title)}
          </Link>
        ))}
      </div>

      {/* Matching Products */}
      <div ref={gridTop} className="scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {tr("Aanbod")} {tr(landing.title)} ({tr(matchingProducts.length)})
          </h2>
          <span className="text-xs text-slate-500">
            {tr("100% nieuw, met de fabrieksgarantie van de fabrikant")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} headingLevel="h2" />
          ))}
        </div>
        <Pagination page={currentPage} totalItems={matchingProducts.length} onPageChange={goToPage} />
      </div>
    </div>
  );
};
