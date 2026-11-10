'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from '@/lib/router';
import { PRODUCTS, TAXONOMY_CATEGORIES } from '../data/ebikes';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterState, MainCategory, SubCategory } from '../types/ebike';
import { SlidersHorizontal } from 'lucide-react';
import { useTr } from '@/i18n/locale';

export const CategoryPage: React.FC = () => {
  const tr = useTr();

  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategoryParam = searchParams.get('sub');

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
    maxPrice: 8000,
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

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
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
  }, [filters]);

  const categoryData = TAXONOMY_CATEGORIES.find((c) => c.main === currentCategory);

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
          {subCategoryParam ? `${tr(subCategoryParam)} (${tr(currentCategory)})` : tr(currentCategory)}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          {tr("Nieuwe modellen van officiële topmerken met fabrieksgarantie. Direct rijklaar leverbaar aan huis.")}
        </p>

        {/* Subcategory pills */}
        {categoryData && categoryData.subs.length > 0 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => {
                setSearchParams({});
                setFilters({ ...filters, subCategory: 'Alle' });
              }}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                filters.subCategory === 'Alle'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tr("Alle (")}{tr(categoryData.main)})
            </button>
            {categoryData.subs.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSearchParams({ sub });
                  setFilters({ ...filters, subCategory: sub });
                }}
                className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                  filters.subCategory === sub
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tr(sub)}
              </button>
            ))}
          </div>
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
            totalProductsCount={filteredProducts.length}
          />
        </div>

        {/* Mobile Filter toggle */}
        <div className="lg:hidden col-span-12">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{tr("Filters (")}{tr(filteredProducts.length)} {tr("resultaten)")}</span>
          </button>
          {isMobileFilterOpen && (
            <div className="mt-3">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() => setFilters(initialFilters)}
                totalProductsCount={filteredProducts.length}
              />
            </div>
          )}
        </div>

        {/* Products */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 text-xs text-slate-500">
            <span>{tr(filteredProducts.length)} {tr("producten gevonden")}</span>
            <select
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-sm text-slate-600 py-10 text-center">{tr("Geen modellen gevonden. Het assortiment wordt binnenkort aangevuld.")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
