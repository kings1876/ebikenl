'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { Battery, ShoppingBag, Zap } from '@/components/icons';
import { useShop } from '@/context/ShopContext';
import { formatEur } from '@/utils/format';
import type { ProductCardData } from '@/types/ebike';
import { QUOTE_EVENT } from './QuoteForm';

export interface Pick {
  product: ProductCardData;
  /** Price is a converted (indicative) price, not the manufacturer's euro list price. */
  indicative: boolean;
}

const thumb = (src: string) => src.replace(/\.webp$/, '-sm.webp');

function PickCard({ pick }: { pick: Pick }) {
  const { product, indicative } = pick;
  const { addToCart, setIsCartDrawerOpen } = useShop();
  const navigate = useNavigate();
  const sizes = product.framematen ?? [];
  const colors = product.kleuren ?? [];
  const [size, setSize] = useState(sizes[0] ?? '');
  const [color, setColor] = useState(colors[0] ?? '');
  const [added, setAdded] = useState(false);

  const add = () => addToCart(product, size || 'Eenheidsmaat', color || '-');

  const select = 'mt-1 w-full min-h-10 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900';

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Link to={`/product/${product.slug}`} className="block aspect-[4/3] bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(product.image)} alt={product.title} width={480} height={360} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{product.brand} · {product.subCategory}</div>
          <h3 className="mt-1 text-sm font-bold leading-snug text-slate-900">
            <Link to={`/product/${product.slug}`} className="hover:text-blue-700">{product.title}</Link>
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            {product.motormerk && (
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />{product.motormerk}{(product.motorTorqueNm ?? 0) > 0 ? ` (${product.motorTorqueNm} Nm)` : ''}</span>
            )}
            {product.accucapaciteit && (
              <span className="flex items-center gap-1"><Battery className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />{product.accucapaciteit}</span>
            )}
          </div>
        </div>

        <div>
          <div className="text-lg font-extrabold tabular-nums text-slate-900">{formatEur(product.price)}</div>
          <div className="text-[11px] text-slate-600">incl. 21% btw{indicative ? ' · indicatieve prijs, we bevestigen de definitieve prijs' : ''}</div>
        </div>

        {(sizes.length > 1 || colors.length > 1) && (
          <div className="grid grid-cols-2 gap-2">
            {sizes.length > 1 && (
              <label className="text-[11px] font-semibold text-slate-700">
                Maat
                <select value={size} onChange={(e) => setSize(e.target.value)} className={select}>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            )}
            {colors.length > 1 && (
              <label className="text-[11px] font-semibold text-slate-700">
                Kleur
                <select value={color} onChange={(e) => setColor(e.target.value)} className={select}>
                  {colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        <div className="mt-auto grid gap-2">
          <button
            type="button"
            onClick={() => {
              add();
              navigate('/afrekenen');
              setIsCartDrawerOpen(false);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Direct bestellen
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                add();
                setAdded(true);
                window.setTimeout(() => setAdded(false), 2500);
              }}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 hover:bg-slate-50"
              aria-live="polite"
            >
              {added ? 'Toegevoegd ✓' : 'In winkelwagen'}
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent(QUOTE_EVENT, { detail: { slug: product.slug } }))}
              className="min-h-11 rounded-xl border border-blue-300 bg-blue-50 px-3 text-xs font-bold text-blue-800 hover:bg-blue-100"
            >
              Gratis offerte
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PickGrid({ picks }: { picks: Pick[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {picks.map((p) => (
        <PickCard key={p.product.id} pick={p} />
      ))}
    </div>
  );
}
