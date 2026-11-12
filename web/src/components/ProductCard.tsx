'use client';

import React from 'react';
import { Link } from '@/lib/router';
import { ProductCardData } from '../types/ebike';
import { formatEur, eurToCrypto, cryptoPrice } from '../utils/format';
import { Battery, Zap, Truck, Scale, Plus } from '@/components/icons';
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
      // cards below the first ones are laid out only when they scroll into view (cheaper first paint on long lists)
      className={priority ? 'pc group' : 'pc pc-lazy group'}
    >
      {/* Top action row inside card */}
      <div className="pc-top">
        {/* Availability / Tag as clean text */}
        <div className="pointer-events-auto">
          {product.tags.includes('Bestseller') ? (
            <span className="pc-tag pc-tag-a">
              {tr("Bestseller")}
            </span>
          ) : product.tags.includes('Aanbieding') ? (
            <span className="pc-tag pc-tag-r">
              {tr("Aanbieding")}
            </span>
          ) : (
            <span className="pc-tag pc-tag-g">
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
          className={compared ? 'pc-cmp pc-cmp-on' : 'pc-cmp pc-cmp-off'}
          aria-label={tr("Vergelijk model")}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image container linking to dedicated PDP */}
      <Link
        to={`/product/${product.slug}`}
        className="pc-imgbox"
      >
        <img
          src={thumbOf(product.image)}
          srcSet={`${thumbOf(product.image)} 480w, ${product.image} 1200w`}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 92vw"
          width={480}
          height={360}
          alt={product.title}
          className="pc-img"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
        />
      </Link>

      {/* Content */}
      <div className="pc-body">
        {/* Brand & Subcategory with link */}
        <div className="pc-brandrow">
          <Link
            to={`/merk/${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="pc-brand"
          >
            {tr(product.brand)}
          </Link>
          <span aria-hidden="true">·</span>
          <span>{tr(product.subCategory)}</span>
        </div>

        {/* Title linking to dedicated PDP */}
        <Heading className="pc-title">
          <Link
            to={`/product/${product.slug}`}
            className="pc-link"
          >
            {tr(product.title)}
          </Link>
        </Heading>

        {/* Key Specs unboxed metadata */}
        <div className="pc-specs">
          <div className="pc-spec">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-medium">{tr(product.motormerk)}</span>
            {(product.motorTorqueNm ?? 0) > 0 && <span className="text-slate-500">({tr(product.motorTorqueNm)}{tr("Nm)")}</span>}
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="pc-spec">
            <Battery className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{tr(product.accucapaciteit)}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600">{product.doelgroep?.split(' ')[0]}</span>
        </div>

        {/* Trustpilot snippet & Price */}
        <div className="pc-foot">
          <div className="pc-meta">
            {product.reviewCount ? (<div className="flex items-center gap-1"><span className="text-[#00b67a] font-bold">★ {product.rating?.toFixed(1)}</span><span className="text-slate-500">({product.reviewCount})</span></div>) : (<span />)}
            <span className="pc-btc">
              ≈ {eurToCrypto(cryptoPrice(product.price), 'BTC')} {tr("BTC")}
            </span>
          </div>

          <div className="pc-buy">
            <div>
              <div className="pc-prices">
                <span className="pc-price">
                  {formatEur(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="pc-old">
                    {formatEur(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="pc-vat">
                {tr("incl. 21% BTW · Rijklaar leverbaar")}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                quickAddToCart(product);
              }}
              className="pc-add"
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
