import React, { useState } from 'react';
import { SEO_LANDING_PAGES, LandingPageDef, PRODUCTS } from '../data/ebikes';
import { Product } from '../types/ebike';
import { ProductCard } from './ProductCard';
import { Sparkles, CheckCircle, ArrowLeft, Tag, Layers, ShieldCheck } from 'lucide-react';

interface LandingPagesViewProps {
  initialSlug?: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  comparedIds: string[];
  onBackToCatalog: () => void;
}

export const LandingPagesView: React.FC<LandingPagesViewProps> = ({
  initialSlug = 'bosch-middenmotor',
  onSelectProduct,
  onQuickAdd,
  onToggleCompare,
  comparedIds,
  onBackToCatalog
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);

  const currentLanding: LandingPageDef =
    SEO_LANDING_PAGES.find((l) => l.slug === selectedSlug) || SEO_LANDING_PAGES[0];

  // Filter products based on landing page rules
  const matchingProducts = PRODUCTS.filter((p) => {
    if (currentLanding.priceMax && p.price > currentLanding.priceMax) {
      return false;
    }
    if (currentLanding.matchFilter.motormerk && p.motormerk !== currentLanding.matchFilter.motormerk) {
      return false;
    }
    if (currentLanding.matchFilter.motorpositie && p.motorpositie !== currentLanding.matchFilter.motorpositie) {
      return false;
    }
    if (currentLanding.matchFilter.doelgroep && p.doelgroep !== currentLanding.matchFilter.doelgroep) {
      return false;
    }
    if (currentLanding.matchFilter.maximaleSnelheid && p.maximaleSnelheid !== currentLanding.matchFilter.maximaleSnelheid) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Selector Navigation for SEO landing pages */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar alle e-bikes</span>
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {SEO_LANDING_PAGES.map((page) => (
            <button
              key={page.slug}
              onClick={() => setSelectedSlug(page.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSlug === page.slug
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner for this SEO Landing Page */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>SEO Landingspagina · Indexeerbaar (DoFollow)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
            {currentLanding.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            {currentLanding.subtitle}
          </p>

          {/* Highlight Points */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
            {currentLanding.highlightPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Meta Box indicator */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>&lt;title&gt;{currentLanding.metaTitle}&lt;/title&gt;</span>
          <span className="text-emerald-400">Canonical: https://e-bike-tekoop.nl/{currentLanding.slug}</span>
        </div>
      </div>

      {/* Products Grid for this landing page */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Geselecteerde Modellen ({matchingProducts.length})
          </h2>
          <span className="text-xs text-slate-500">
            100% Nieuw met fabrieksgarantie via distributeur
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
