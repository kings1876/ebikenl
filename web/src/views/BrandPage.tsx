'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from '@/lib/router';
import { CARD_PRODUCTS as PRODUCTS, BRANDS_WITH_PRODUCTS } from '../data/slim';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination, PAGE_SIZE } from '../components/Pagination';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { brandIntro } from '../lib/brandCopy';
import { useTr, useLocale } from '@/i18n/locale';
import { REPLY } from '@/config/reply';

export const BrandPage: React.FC = () => {
  const tr = useTr();
  const locale = useLocale();

  const { brandSlug } = useParams<{ brandSlug: string }>();

  // Find matching brand from BRANDS_WITH_PRODUCTS
  const matchedBrand = useMemo(() => {
    return BRANDS_WITH_PRODUCTS.find(
      (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-') === brandSlug?.toLowerCase()
    );
  }, [brandSlug]);

  const [page, setPage] = useState(1);
  const gridTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchedBrand) {
      window.scrollTo(0, 0);
      setPage(1);
    }
  }, [matchedBrand]);

  if (!matchedBrand) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{tr("Merk niet gevonden")}</h1>
        <p className="text-slate-600 mb-6">{tr("Het gezochte e-bike merk is niet opgenomen in ons assortiment.")}</p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tr("Terug naar homepage")}</span>
        </Link>
      </div>
    );
  }

  const brandProducts = PRODUCTS.filter((p) => p.brand === matchedBrand);
  const totalPages = Math.max(1, Math.ceil(brandProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = brandProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goToPage = (n: number) => {
    setPage(n);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Merken' },
          { label: matchedBrand }
        ]}
      />

      {/* Brand Hero Header */}
      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-2xl border border-slate-800 space-y-4">
        <div className="text-xs uppercase font-bold text-blue-400 tracking-wider">
          {tr("Merk")}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
          {tr(matchedBrand)} {tr("Elektrische Fietsen")}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {brandIntro(matchedBrand, brandProducts, locale)}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{tr("Fabrieksgarantie van de fabrikant")}</span>
          </span>
          <span>·</span>
          <span>{tr("Vergelijk specificaties en adviesprijzen per model")}</span>
        </div>
      </div>

      {/* Brand Products Grid */}
      <div ref={gridTop} className="scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {tr(matchedBrand)} {tr("Modellen (")}{tr(brandProducts.length)})
          </h2>
          <span className="text-xs text-slate-500">
            {tr("Prijzen inclusief 21% BTW")}
          </span>
        </div>

        {brandProducts.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-700 font-semibold">
              {tr("Momenteel worden nieuwe")} {tr(matchedBrand)} {tr("modellen toegevoegd.")}
            </p>
            <p className="text-xs text-slate-500">
              {tr("Mail onze klantenservice voor specifieke modelaanvragen:")} <a className="underline font-semibold" href={`mailto:${REPLY.channels.email}`}>{REPLY.channels.email}</a>
            </p>
            <Link
              to="/categorie/elektrische-fietsen"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              {tr("Bekijk alle e-bikes op voorraad")}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 2} headingLevel="h2" />
              ))}
            </div>
            <Pagination page={currentPage} totalItems={brandProducts.length} onPageChange={goToPage} />
          </>
        )}
      </div>

      {/* Other Brands Quick Links */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {tr("Bekijk ook andere A-merken in onze collectie:")}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {BRANDS_WITH_PRODUCTS.filter((b) => b !== matchedBrand).map((b) => (
            <Link
              key={b}
              to={`/merk/${b.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-700 transition-colors"
            >
              {tr(b)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
