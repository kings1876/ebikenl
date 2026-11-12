'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from '@/lib/router';
import { SUB_COPY, CATEGORY_INTRO, subSlug } from '../lib/seoCopy';
import { ACTIVE_TAXONOMY_CATEGORIES } from '../data/facets';
import { useCatalog } from '@/lib/useCatalog';
import type { ListingSeed } from '@/lib/listingSeed';
import { ProductCard } from '../components/ProductCard';
import dynamic from 'next/dynamic';
import { Pagination, PAGE_SIZE } from '../components/Pagination';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterState, MainCategory, SubCategory } from '../types/ebike';
import { SlidersHorizontal } from '@/components/icons';
import { useTr } from '@/i18n/locale';

// The filter panel loads after first paint: it is interactive-only, so it stays out of the page's critical JavaScript.
// The placeholder keeps its column from collapsing, so nothing else moves when it arrives.
const FilterSidebar = dynamic(() => import('../components/FilterSidebar').then((m) => m.FilterSidebar), {
  ssr: false,
  loading: () => <div className="min-h-[40rem]" aria-hidden="true" />,
});

// Subcategories are real routes (/categorie/<slug>/<sub>), so they render on the server and can be indexed.
export const CategoryPage: React.FC<{ subCategory?: SubCategory; seed: ListingSeed }> = ({ subCategory, seed }) => {
  const tr = useTr();

  const { categorySlug } = useParams<{ categorySlug: string }>();
  const subCategoryParam = subCategory ?? null;

  // Map categorySlug to MainCategory
  const currentCategory: MainCategory = useMemo(() => {
    switch (categorySlug) {
      case 'accus-en-opladers':
        return "Accu's & opladers";
      case 'accessoires':
        return 'Accessoires';
      case 'onderdelen':
        return 'Onderdelen';
      case 'service':
        return 'Service';
      case 'elektrische-fietsen':
      default:
        return 'Elektrische fietsen';
    }
  }, [categorySlug]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const initialFilters: FilterState = {
    search: '',
    category: currentCategory,
    subCategory: (subCategoryParam as SubCategory) || 'Alle',
    brands: [],
    doelgroep: [],
    motorpositie: [],
    motormerk: [],
    accucapaciteit: [],
    actieradius: [],
    framemaat: [],
    versnelling: [],
    aandrijving: [],
    remtype: [],
    wielmaat: [],
    gewichtKlasse: [],
    kleur: [],
    maximaleSnelheid: [],
    leverbaarheid: [],
    tags: [],
    maxPrice: 16000,
    minPrice: 0,
    sortBy: 'populariteit'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync category state when URL changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: currentCategory,
      subCategory: (subCategoryParam as SubCategory) || 'Alle'
    }));
    window.scrollTo(0, 0);
  }, [currentCategory, subCategoryParam]);

  // Until the full catalogue has loaded, the page shows the first page of results the server rendered.
  const catalog = useCatalog();
  const filteredProducts = useMemo(() => {
    if (!catalog) return null;
    return catalog.filter((p) => {
      if (filters.category !== 'Alle' && p.category !== filters.category) return false;
      if (filters.subCategory !== 'Alle' && p.subCategory !== filters.subCategory) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.doelgroep.length > 0 && !filters.doelgroep.includes(p.doelgroep ?? "")) return false;
      if (filters.motorpositie.length > 0 && !filters.motorpositie.includes(p.motorpositie ?? "")) return false;
      if (filters.motormerk.length > 0 && !filters.motormerk.includes(p.motormerk ?? "")) return false;
      if (filters.accucapaciteit.length > 0 && !filters.accucapaciteit.includes(p.accucapaciteit ?? "")) return false;
      if (filters.tags.length > 0) {
        if (!p.tags.some((t) => filters.tags.includes(t))) return false;
      }
      if ((p.price ?? 0) > filters.maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'prijs-laag-hoog') return (a.price ?? 0) - (b.price ?? 0);
      if (filters.sortBy === 'prijs-hoog-laag') return (b.price ?? 0) - (a.price ?? 0);
      if (filters.sortBy === 'beoordeling') return (b.rating ?? 0) - (a.rating ?? 0);
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    });
  }, [catalog, filters]);
  const total = filteredProducts ? filteredProducts.length : seed.total;

  const [page, setPage] = useState(1);
  const gridTop = useRef<HTMLDivElement>(null);
  // any change to the result set starts again at page 1
  useEffect(() => setPage(1), [filters]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts ? filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) : seed.products;
  const goToPage = (n: number) => {
    setPage(n);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categoryData = ACTIVE_TAXONOMY_CATEGORIES.find((c) => c.main === currentCategory);
  const subCopy = subCategoryParam ? SUB_COPY[subCategoryParam] : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: currentCategory, path: `/categorie/${categorySlug}` },
          ...(subCategoryParam ? [{ label: subCategoryParam }] : [])
        ]}
      />

      {/* Category Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          {tr(subCopy?.h1 ?? 'Elektrische fiets kopen: nieuwe e-bikes vergelijken')}
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          {tr(subCopy?.intro ?? CATEGORY_INTRO)}
        </p>

        {/* Subcategory pills: real links, so crawlers can follow them */}
        {categoryData && categoryData.subs.length > 0 && (
          <nav aria-label={tr("Subcategorieën")} className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs font-semibold">
            <Link
              to={`/categorie/${categorySlug}`}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                !subCategoryParam
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tr("Alle (")}{tr(categoryData.main)})
            </Link>
            {categoryData.subs.map((sub) => (
              <Link
                key={sub}
                to={sub === 'Speed pedelecs' ? '/speed-pedelecs' : `/categorie/${categorySlug}/${subSlug(sub)}`}
                className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                  subCategoryParam === sub
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tr(sub)}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={() => setFilters(initialFilters)}
            totalProductsCount={total}
          />
        </div>

        {/* Mobile Filter toggle */}
        <div className="lg:hidden col-span-12">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{tr("Filters (")}{tr(total)} {tr("resultaten)")}</span>
          </button>
          {isMobileFilterOpen && (
            <div className="mt-3">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() => setFilters(initialFilters)}
                totalProductsCount={total}
              />
            </div>
          )}
        </div>

        {/* Products */}
        <div ref={gridTop} className="col-span-12 lg:col-span-9 scroll-mt-24">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 text-xs text-slate-500">
            <span>{tr(total)} {tr("producten gevonden")}</span>
            <select
              aria-label={tr("Sorteren")}
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
            >
              <option value="populariteit">{tr("Meest populair")}</option>
              <option value="prijs-laag-hoog">{tr("Prijs laag → hoog")}</option>
              <option value="prijs-hoog-laag">{tr("Prijs hoog → laag")}</option>
              <option value="beoordeling">{tr("Hoogste reviewscore")}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {pageProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={false} headingLevel="h2" />
            ))}
          </div>
          <Pagination page={currentPage} totalItems={total} onPageChange={goToPage} />
          {total === 0 && (
            <p className="text-sm text-slate-600 py-10 text-center">{tr("Geen modellen gevonden. Het assortiment wordt binnenkort aangevuld.")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
