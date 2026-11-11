'use client';

import React from 'react';
import { Link } from '@/lib/router';
import { ProductCardData } from '../types/ebike';
import { formatEur, eurToCrypto, cryptoPrice } from '../utils/format';
import { Battery, Zap, Truck, Scale, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useTr } from '@/i18n/locale';

interface ProductCardProps {
  product: ProductCardData;
  /** true for the first cards on a page: loaded eagerly so the largest image is not lazy-loaded */
  priority?: boolean;
  /** heading level of the card title; lists under an h1 use 'h2' so no level is skipped */
  headingLevel?: 'h2' | 'h3';
}

/** 480px-wide variant of a catalogue image (made by scripts/data/make-images.mjs) */
export const thumbOf = (src: string) => src.replace(/\.webp$/, '-sm.webp');

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false, headingLevel = 'h3' }) => {
  const Heading = headingLevel;
  const tr = useTr();

  const { quickAddToCart, toggleCompare, isCompared } = useShop();
  const compared = isCompared(product.id);

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 ${
        // cards below the first ones are laid out only when they scroll into view (cheaper first paint on long lists)
        priority ? '' : '[content-visibility:auto] [contain-intrinsic-size:auto_440px]'
      }`}
    >
      {/* Top action row inside card */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Availability / Tag as clean text */}
        <div className="pointer-events-auto">
          {product.tags.includes('Bestseller') ? (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              {tr("Bestseller")}
            </span>
          ) : product.tags.includes('Aanbieding') ? (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
              {tr("Aanbieding")}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{tr(product.leverbaarheid)}</span>
            </span>
          )}
        </div>

        {/* Compare button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`pointer-events-auto p-1.5 rounded-lg border transition-colors ${
            compared
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-white shadow-xs'
          }`}
          title={compared ? 'Verwijder uit vergelijking' : 'Vergelijk deze e-bike'}
          aria-label={tr("Vergelijk model")}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image container linking to dedicated PDP */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 group-hover:bg-slate-100/60 transition-colors"
      >
        <img
          src={thumbOf(product.image)}
          srcSet={`${thumbOf(product.image)} 480w, ${product.image} 1200w`}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 92vw"
          width={480}
          height={360}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center transform group-hover:scale-102 transition-transform duration-300"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Subcategory with link */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Link
            to={`/merk/${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="font-bold text-slate-800 tracking-wide uppercase text-[11px] hover:text-blue-600"
          >
            {tr(product.brand)}
          </Link>
          <span aria-hidden="true">·</span>
          <span>{tr(product.subCategory)}</span>
        </div>

        {/* Title linking to dedicated PDP */}
        <Heading className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-2">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-blue-600 transition-colors"
            title={product.title}
          >
            {tr(product.title)}
          </Link>
        </Heading>

        {/* Key Specs unboxed metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-4 py-2 border-y border-slate-100">
          <div className="flex items-center gap-1" title={tr("Motormerk en koppel")}>
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-medium">{tr(product.motormerk)}</span>
            {(product.motorTorqueNm ?? 0) > 0 && <span className="text-slate-500">({tr(product.motorTorqueNm)}{tr("Nm)")}</span>}
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1" title={tr("Accucapaciteit")}>
            <Battery className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{tr(product.accucapaciteit)}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600">{product.doelgroep?.split(' ')[0]}</span>
        </div>

        {/* Trustpilot snippet & Price */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            {product.reviewCount ? (<div className="flex items-center gap-1"><span className="text-[#00b67a] font-bold">★ {product.rating?.toFixed(1)}</span><span className="text-slate-500">({product.reviewCount})</span></div>) : (<span />)}
            <span className="text-[11px] text-slate-500 font-mono">
              ≈ {eurToCrypto(cryptoPrice(product.price), 'BTC')} {tr("BTC")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {formatEur(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-500 line-through tabular-nums">
                    {formatEur(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block -mt-0.5">
                {tr("incl. 21% BTW · Rijklaar leverbaar")}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                quickAddToCart(product);
              }}
              className="p-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
              title={tr("Voeg toe aan winkelwagen")}
              aria-label={tr("Snel toevoegen")}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
