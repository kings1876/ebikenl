import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO_LANDING_PAGES, PRODUCTS, LandingPageDef } from '../data/ebikes';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CheckCircle, Tag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingPageProps {
  customSlug?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ customSlug }) => {
  const params = useParams<{ slug?: string }>();
  const activeSlug = customSlug || params.slug || 'bosch-middenmotor';

  const landing: LandingPageDef =
    SEO_LANDING_PAGES.find((l) => l.slug === activeSlug) || SEO_LANDING_PAGES[0];

  useEffect(() => {
    document.title = landing.metaTitle;
    window.scrollTo(0, 0);
  }, [landing]);

  // Filter matching products
  const matchingProducts = PRODUCTS.filter((p) => {
    if (landing.priceMax && p.price > landing.priceMax) return false;
    if (landing.matchFilter.motormerk && p.motormerk !== landing.matchFilter.motormerk) return false;
    if (landing.matchFilter.motorpositie && p.motorpositie !== landing.matchFilter.motorpositie) return false;
    if (landing.matchFilter.doelgroep && p.doelgroep !== landing.matchFilter.doelgroep) return false;
    if (landing.matchFilter.maximaleSnelheid && p.maximaleSnelheid !== landing.matchFilter.maximaleSnelheid) return false;
    return true;
  });

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
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          <span>SEO Landingspagina · Indexeerbaar (DoFollow)</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
          {landing.h1}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {landing.subtitle} {landing.metaDescription}
        </p>

        {/* Highlight points */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
          {landing.highlightPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-800/70 p-3 rounded-lg border border-slate-700/60">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* Canonical preview */}
        <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>&lt;title&gt;{landing.metaTitle}&lt;/title&gt;</span>
          <span className="text-emerald-400">Canonical: https://e-bike-tekoop.nl/{landing.slug}</span>
        </div>
      </div>

      {/* Other Curated Landing Pages Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <span className="text-slate-400 shrink-0 mr-1">Andere thema's:</span>
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
            {l.title}
          </Link>
        ))}
      </div>

      {/* Matching Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Aanbod {landing.title} ({matchingProducts.length})
          </h2>
          <span className="text-xs text-slate-500">
            100% Nieuw met fabrieksgarantie via distributeur
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
