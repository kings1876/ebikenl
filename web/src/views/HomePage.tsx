'use client';

import React, { useMemo, useEffect } from 'react';
import { Link } from '@/lib/router';
import { PRODUCTS, ALL_BRANDS, TRUSTPILOT_OVERALL_SCORE } from '../data/ebikes';
import { ProductCard } from '../components/ProductCard';
import { TrustpilotWidget } from '../components/TrustpilotWidget';
import {
  Compass,
  ArrowRight,
  CreditCard,
  Building,
  Coins,
  ShieldCheck,
  Truck,
  ChevronRight
} from 'lucide-react';

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

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'E-BIKE-TEKOOP.NL - Nieuwe Elektrische Fietsen van A-Merken';
    window.scrollTo(0, 0);
  }, []);

  const featuredProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => p.category === 'Elektrische fietsen')
        .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        .slice(0, 6),
    []
  );

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
          </div>
          <div className="flex flex-wrap items-center gap-2 pb-1 text-xs font-semibold text-slate-700">
            {ALL_BRANDS.map((brand) => (
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

      {/* Shop by category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Shop per categorie
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Van stadsfiets tot speed pedelec: kies het type e-bike dat bij je past.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BIKE_TYPES.map((t) => (
            <Link
              key={t.sub}
              to={`/categorie/elektrische-fietsen?sub=${encodeURIComponent(t.sub)}`}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="font-bold text-slate-900 font-display group-hover:text-blue-600">{t.sub}</div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                Bekijk <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured bikes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Populaire e-bikes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Onze best beoordeelde modellen</p>
          </div>
          <Link
            to="/categorie/elektrische-fietsen"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Alle e-bikes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <div className="font-bold text-slate-900 font-display">Alleen nieuwe A-merken</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Officiële distributiekanalen met volledige fabrieksgarantie op frame, motor en accu.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <div className="font-bold text-slate-900 font-display">100% rijklaar geleverd</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thuisbezorgd en afgesteld op jouw lengte, of in de fabrieksdoos voor zelfmontage.
            </p>
          </div>
          <Link
            to="/keuzehulp"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 space-y-2 transition-colors"
          >
            <Compass className="w-6 h-6" />
            <div className="font-bold font-display">Weet je niet welke e-bike?</div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Beantwoord een paar vragen en vind in 1 minuut jouw ideale fiets.
            </p>
          </Link>
        </div>
      </section>

      {/* Trustpilot Social Proof Widget Section */}
      <TrustpilotWidget variant="full" />
    </div>
  );
};
