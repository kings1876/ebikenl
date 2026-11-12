'use client';

import { ListingGuide } from '@/components/ListingGuide';
import type { ListingStats } from '@/lib/listingStats';
import React, { useEffect } from 'react';
import { Link } from '@/lib/router';
import { TRUSTPILOT_OVERALL_SCORE } from '../data/ebikes';
import type { ProductCardData } from '../types/ebike';
import { ProductCard } from '../components/ProductCard';
import { TrustpilotWidget } from '../components/TrustpilotWidget';
import {
  Compass,
  ArrowRight,
  Building,
  Coins,
  ShieldCheck,
  Truck,
  ChevronRight
} from '@/components/icons';
import { useTr } from '@/i18n/locale';
import { subHref } from '../lib/seoCopy';

const BIKE_TYPES = [
  { sub: 'Stadsfietsen', blurb: 'Comfortabel en betrouwbaar voor woon-werkverkeer en dagelijks gebruik.' },
  { sub: 'Trekkingfietsen', blurb: 'Sportief en vol uitrusting voor lange tochten en vakanties.' },
  { sub: 'Elektrische mountainbikes', blurb: 'Kracht en grip voor bos, heuvels en technische paden.' },
  { sub: 'Speed pedelecs', blurb: 'Tot 45 km/u voor lange forenzen-afstanden. Kenteken vereist.' },
  { sub: 'Vouwfietsen', blurb: 'Compact mee in trein, auto of camper.' },
  { sub: 'Bakfietsen', blurb: 'Ruimte voor kinderen, boodschappen en bagage.' },
  { sub: 'Gravel & racefietsen', blurb: 'Snelle, lichte e-bikes voor sportieve rijders.' },
  { sub: 'Kinder- & jongerenfietsen', blurb: 'Veilige elektrische fietsen voor jongeren.' }
];

export const HomePage: React.FC<{ featuredProducts: ProductCardData[]; stats: ListingStats }> = ({ featuredProducts, stats }) => {
  const tr = useTr();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                  {tr("Uitstekend op Trustpilot ·")} {tr(TRUSTPILOT_OVERALL_SCORE.totalReviews)} {tr("reviews")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.1] font-display">
                {tr("Elektrische fiets kopen:")}{' '}
                <span className="text-blue-600 block mt-1">{tr("nieuwe e-bikes van bekende merken")}</span>
              </h1>

              <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                {tr("Nieuwe elektrische fietsen van onder meer Cube, Giant, Scott, Specialized en Kalkhoff. Vergelijk modellen, specificaties en adviesprijzen op één plek.")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/categorie/elektrische-fietsen"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>{tr("Bekijk alle e-bikes")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/keuzehulp"
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 border border-slate-200"
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>{tr("E-bike Keuzehulp (1 min)")}</span>
                </Link>
              </div>

              {/* Payment methods trust bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{tr("Betaalopties:")}</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-700" />
                  <span>{tr("Bankoverschrijving")}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{tr("Crypto (BTC / USDT / ETH, -10%)")}</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-6">
              <div className="flex flex-col lg:aspect-16/10 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white group">
                <div className="aspect-4/3 lg:aspect-auto min-h-0 lg:flex-1 bg-white">
                  <img
                    src="/images/hero-product-800.webp"
                    srcSet="/images/hero-product-800.webp 800w, /images/hero-product-1200.webp 1200w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    width={1200}
                    height={900}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    alt={tr("Cube Kathmandu Hybrid Deluxe EXC 800 elektrische fiets")}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div className="bg-slate-900 px-6 py-4 text-white">
                  <div className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                    {tr("Nieuw in het assortiment")}
                  </div>
                  <div className="text-lg font-bold">
                    {tr("Cube, Giant, Scott, Specialized en Kalkhoff")}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {tr("Vergelijk specificaties en adviesprijzen per model")}
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
          <span className="text-slate-600 shrink-0 uppercase tracking-wider text-[11px]">
            {tr("Populaire Thema's:")}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/bosch-middenmotor"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              {tr("Bosch Middenmotor")}
            </Link>
            <Link
              to="/elektrische-damesfiets"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              {tr("Elektrische Damesfiets (Lage Instap)")}
            </Link>
            <Link
              to="/e-bike-onder-2000"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              {tr("E-bike onder €2.000")}
            </Link>
            <Link
              to="/fietsplan-e-bikes"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              {tr("Fietsplan & WKR")}
            </Link>
            <Link
              to="/speed-pedelecs"
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-200 shrink-0 transition-colors"
            >
              {tr("Speed Pedelecs (45 km/u)")}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            {tr("Shop per categorie")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr("Van stadsfiets tot speed pedelec: kies het type e-bike dat bij je past.")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BIKE_TYPES.map((t) => (
            <Link
              key={t.sub}
              to={subHref(t.sub)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="font-bold text-slate-900 font-display group-hover:text-blue-600">{tr(t.sub)}</div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tr(t.blurb)}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                {tr("Bekijk")} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured bikes */}
      {featuredProducts.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              {tr("Populaire e-bikes")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{tr("Een selectie uit ons assortiment")}</p>
          </div>
          <Link
            to="/categorie/elektrische-fietsen"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{tr("Alle e-bikes")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      )}

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <div className="font-bold text-slate-900 font-display">{tr("Alleen nieuwe e-bikes")}</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {tr("Uitsluitend nieuwe e-bikes van bekende merken, met de fabrieksgarantie van de fabrikant.")}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <div className="font-bold text-slate-900 font-display">{tr("100% rijklaar geleverd")}</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {tr("Thuisbezorgd en afgesteld op jouw lengte, of in de fabrieksdoos voor zelfmontage.")}
            </p>
          </div>
          <Link
            to="/keuzehulp"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 space-y-2 transition-colors"
          >
            <Compass className="w-6 h-6" />
            <div className="font-bold font-display">{tr("Weet je niet welke e-bike?")}</div>
            <p className="text-xs text-white leading-relaxed">
              {tr("Beantwoord een paar vragen en vind in 1 minuut jouw ideale fiets.")}
            </p>
          </Link>
        </div>
      </section>

      <ListingGuide name={tr('Ons assortiment')} stats={stats} />

      {/* Trustpilot Social Proof Widget Section */}
      <TrustpilotWidget variant="full" />
    </div>
  );
};
