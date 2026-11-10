import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/ebike';
import { formatEur, eurToCrypto } from '../utils/format';
import { Battery, Zap, Truck, Scale, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { quickAddToCart, toggleCompare, isCompared } = useShop();
  const compared = isCompared(product.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200">
      {/* Top action row inside card */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Availability / Tag as clean text */}
        <div className="pointer-events-auto">
          {product.tags.includes('Bestseller') ? (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              Bestseller
            </span>
          ) : product.tags.includes('Aanbieding') ? (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
              Aanbieding
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{product.leverbaarheid}</span>
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
          aria-label="Vergelijk model"
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
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center transform group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
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
            {product.brand}
          </Link>
          <span aria-hidden="true">·</span>
          <span>{product.subCategory}</span>
        </div>

        {/* Title linking to dedicated PDP */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-2">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-blue-600 transition-colors"
            title={product.title}
          >
            {product.title}
          </Link>
        </h3>

        {/* Key Specs unboxed metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-4 py-2 border-y border-slate-100">
          <div className="flex items-center gap-1" title="Motormerk en koppel">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-medium">{product.motormerk}</span>
            {product.motorTorqueNm > 0 && <span className="text-slate-400">({product.motorTorqueNm}Nm)</span>}
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1" title="Accucapaciteit">
            <Battery className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{product.accucapaciteit}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600">{product.doelgroep.split(' ')[0]}</span>
        </div>

        {/* Trustpilot snippet & Price */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-[#00b67a] font-bold">★ 4.8</span>
              <span className="text-slate-400">({product.reviewCount || 24})</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              ≈ {eurToCrypto(product.price, 'BTC')} BTC
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {formatEur(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    {formatEur(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                incl. 21% BTW · Rijklaar leverbaar
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                quickAddToCart(product);
              }}
              className="p-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
              title="Voeg toe aan winkelwagen"
              aria-label="Snel toevoegen"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
