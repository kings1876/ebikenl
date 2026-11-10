'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from '@/lib/router';
import { PRODUCTS, ALL_BRANDS } from '../data/ebikes';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, Truck, ArrowLeft } from 'lucide-react';

export const BrandPage: React.FC = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();

  // Find matching brand from ALL_BRANDS
  const matchedBrand = useMemo(() => {
    return ALL_BRANDS.find(
      (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-') === brandSlug?.toLowerCase()
    );
  }, [brandSlug]);

  useEffect(() => {
    if (matchedBrand) {
      document.title = `${matchedBrand} Elektrische Fietsen Kopen | Dealer E-BIKE-TEKOOP.NL`;
      window.scrollTo(0, 0);
    }
  }, [matchedBrand]);

  if (!matchedBrand) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Merk niet gevonden</h1>
        <p className="text-slate-600 mb-6">Het gezochte e-bike merk is niet opgenomen in ons distributeursassortiment.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar homepage</span>
        </Link>
      </div>
    );
  }

  const brandProducts = PRODUCTS.filter((p) => p.brand === matchedBrand);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Merken', path: '/taxonomie' },
          { label: matchedBrand }
        ]}
      />

      {/* Brand Hero Header */}
      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-2xl border border-slate-800 space-y-4">
        <div className="text-xs uppercase font-bold text-blue-400 tracking-wider">
          Officiële Distributiepartner
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
          {matchedBrand} Elektrische Fietsen
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Bekijk het actuele aanbod nieuwe {matchedBrand} e-bikes met officiële fabrieksgarantie.
          Elke fiets wordt 100% rijklaar afgemonteerd en gratis thuisbezorgd door onze eigen vakkundige monteurs.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tot 10 jaar {matchedBrand} framegarantie</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-white">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>100% Rijklaar bezorgd aan huis</span>
          </span>
          <span>·</span>
          <span>Betaling via iDEAL, SEPA & Crypto</span>
        </div>
      </div>

      {/* Brand Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {matchedBrand} Modellen op Voorraad ({brandProducts.length})
          </h2>
          <span className="text-xs text-slate-500">
            Prijzen inclusief 21% BTW en rijklaarmaken
          </span>
        </div>

        {brandProducts.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-700 font-semibold">
              Momenteel worden nieuwe {matchedBrand} modellen ingeladen vanuit de centrale distributeur database.
            </p>
            <p className="text-xs text-slate-500">
              Neem contact op met onze klantenservice (085 - 200 78 90) voor specifieke modelaanvragen.
            </p>
            <Link
              to="/categorie/elektrische-fietsen"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Bekijk alle e-bikes op voorraad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Other Brands Quick Links */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Bekijk ook andere A-merken in onze collectie:
        </h3>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {ALL_BRANDS.filter((b) => b !== matchedBrand).map((b) => (
            <Link
              key={b}
              to={`/merk/${b.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-700 transition-colors"
            >
              {b}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
