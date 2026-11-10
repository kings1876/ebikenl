'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from '@/lib/router';
import { PRODUCTS, ALL_BRANDS, TRUSTPILOT_OVERALL_SCORE } from '../data/ebikes';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { TrustpilotWidget } from '../components/TrustpilotWidget';
import { FilterState } from '../types/ebike';
import {
  Compass,
  ArrowRight,
  CreditCard,
  Building,
  Coins,
  ShieldCheck,
  Truck,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'E-BIKE-TEKOOP.NL - Nieuwe Elektrische Fietsen van A-Merken';
    window.scrollTo(0, 0);
  }, []);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const initialFilters: FilterState = {
    search: '',
    category: 'Alle',
    subCategory: 'Alle',
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

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(query) &&
          !p.brand.toLowerCase().includes(query) &&
          !p.model.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (filters.category !== 'Alle' && p.category !== filters.category) return false;
      if (filters.subCategory !== 'Alle' && p.subCategory !== filters.subCategory) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.doelgroep.length > 0 && !filters.doelgroep.includes(p.doelgroep)) return false;
      if (filters.motorpositie.length > 0 && !filters.motorpositie.includes(p.motorpositie)) return false;
      if (filters.motormerk.length > 0 && !filters.motormerk.includes(p.motormerk)) return false;
      if (filters.accucapaciteit.length > 0 && !filters.accucapaciteit.includes(p.accucapaciteit)) return false;
      if (filters.tags.length > 0) {
        if (!p.tags.some((t) => filters.tags.includes(t))) return false;
      }
      if (p.price > filters.maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'prijs-laag-hoog') return a.price - b.price;
      if (filters.sortBy === 'prijs-hoog-laag') return b.price - a.price;
      if (filters.sortBy === 'beoordeling') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      {/* Storefront Hero with Single Dominant Focal Anchor */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline & Direct route to collection */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#00b67a] text-white px-2 py-0.5 rounded-[2px] text-xs font-bold">
                  <span>★</span>
                  <span>4.8</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Uitstekend op Trustpilot · {TRUSTPILOT_OVERALL_SCORE.totalReviews} reviews
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.1] font-display">
                Nieuwe E-Bikes van A-Merken.{' '}
                <span className="text-blue-600 block mt-1">100% Rijklaar Geleverd.</span>
              </h1>

              <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                De officiële online speciaalzaak van Nederland. Exclusieve nieuwe elektrische fietsen
                van Gazelle, Batavus, Cube, Stromer en Riese & Müller direct via de distributeur.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/categorie/elektrische-fietsen"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Bekijk alle e-bikes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/keuzehulp"
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 border border-slate-200"
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>E-bike Keuzehulp (1 min)</span>
                </Link>
              </div>

              {/* Payment methods trust bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Betaalopties:</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-pink-600" />
                  <span>iDEAL</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-700" />
                  <span>Bankoverschrijving</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Crypto (BTC / ETH / USDT)</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-6">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
                <img
                  src="/images/ebike_hero_lifestyle_1794286792478.jpg"
                  alt="E-BIKE-TEKOOP.NL Premium Commuter E-Bike in Amsterdam"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                    Distributeur Voorraad
                  </div>
                  <div className="text-lg font-bold">
                    Gazelle, Stromer, Cube, Riese & Müller direct leverbaar
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Inclusief 100% rijklaar afstelling aan huis door gediplomeerd fietsmonteur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Theme Links with Real URLs */}
      <section className="bg-slate-100/70 border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto text-xs font-semibold text-slate-700">
          <span className="text-slate-400 shrink-0 uppercase tracking-wider text-[11px]">
            Populaire Thema's:
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/bosch-middenmotor"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              Bosch Middenmotor
            </Link>
            <Link
              to="/elektrische-damesfiets"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              Elektrische Damesfiets (Lage Instap)
            </Link>
            <Link
              to="/e-bike-onder-2000"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              E-bike onder €2.000
            </Link>
            <Link
              to="/fietsplan-e-bikes"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              Fietsplan & WKR (tot 40% voordeel)
            </Link>
            <Link
              to="/speed-pedelecs"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              Speed Pedelecs (45 km/u)
            </Link>
          </div>
        </div>
      </section>

      {/* 24 Brands Quick Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider">
              Onze 24 A-Merken via Distributeur:
            </span>
            <Link to="/taxonomie" className="text-blue-600 hover:underline font-semibold flex items-center gap-1">
              <span>Bekijk alle merken</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold text-slate-700">
            {ALL_BRANDS.slice(0, 12).map((brand) => (
              <Link
                key={brand}
                to={`/merk/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 whitespace-nowrap transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Faceted Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Actueel Aanbod Elektrische Fietsen
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toont {filteredProducts.length} modellen conform geselecteerde filters
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Sorteer op:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as any })
                }
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="populariteit">Meest populair</option>
                <option value="prijs-laag-hoog">Prijs laag → hoog</option>
                <option value="prijs-hoog-laag">Prijs hoog → laag</option>
                <option value="nieuw">Nieuwste modellen</option>
                <option value="beoordeling">Hoogste TrustScore</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(initialFilters)}
              totalProductsCount={filteredProducts.length}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden col-span-12 mb-6">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() => setFilters(initialFilters)}
                totalProductsCount={filteredProducts.length}
              />
            </div>
          )}

          {/* Product Grid */}
          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot Social Proof Widget Section */}
      <TrustpilotWidget variant="full" />
    </div>
  );
};
