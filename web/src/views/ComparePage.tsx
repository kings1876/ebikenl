'use client';

import React, { useEffect } from 'react';
import { Link } from '@/lib/router';
import { useShop } from '../context/ShopContext';
import { Product } from '../types/ebike';
import { formatEur } from '../utils/format';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Trash2, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useTr } from '@/i18n/locale';

export const ComparePage: React.FC = () => {
  const tr = useTr();

  const { comparedProducts, removeFromCompare, clearCompare, quickAddToCart } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'E-bikes Vergelijken' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {tr("E-Bikes Vergelijken (")}{tr(comparedProducts.length)}/4)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tr("Vergelijk specificaties, motor, actieradius en prijzen zij aan zij")}
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800"
          >
            {tr("Alle modellen wissen")}
          </button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <p className="text-sm font-bold text-slate-900">
            {tr("Je hebt nog geen e-bikes geselecteerd om te vergelijken.")}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {tr("Klik op het weegschaal-icoon op een productkaart om maximaal 4 fietsen naast elkaar te zetten.")}
          </p>
          <Link
            to="/categorie/elektrische-fietsen"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{tr("Bekijk aanbod e-bikes")}</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 overflow-x-auto shadow-sm">
          <div className="min-w-[700px]">
            {/* Header Cards Row */}
            <div className="grid grid-cols-5 gap-6 pb-6 border-b border-slate-200">
              <div className="col-span-1 flex flex-col justify-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {tr("Model Overzicht")}
                </span>
              </div>

              {comparedProducts.map((p) => (
                <div key={p.id} className="col-span-1 flex flex-col relative">
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    title={tr("Verwijder")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/product/${p.slug}`}
                    className="aspect-4/3 w-full bg-slate-50 rounded-xl p-3 mb-2 flex items-center justify-center hover:opacity-90"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="text-[11px] font-bold text-slate-400 uppercase">{tr(p.brand)}</div>
                  <Link
                    to={`/product/${p.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-blue-600 line-clamp-2 h-8"
                  >
                    {tr(p.model)}
                  </Link>
                  <div className="text-sm font-black text-blue-700 tabular-nums mt-1">
                    {formatEur(p.price)}
                  </div>

                  <button
                    onClick={() => quickAddToCart(p)}
                    className="mt-3 py-2 px-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{tr("Bestel")}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Spec Attributes */}
            <div className="divide-y divide-slate-100 text-xs">
              {[
                { label: 'Type / Categorie', key: (p: Product) => p.subCategory },
                { label: 'Doelgroep / Instap', key: (p: Product) => p.doelgroep },
                { label: 'Motormerk & Type', key: (p: Product) => `${p.motormerk} (${p.motorModel})` },
                { label: 'Motorkoppel', key: (p: Product) => `${p.motorTorqueNm} Nm` },
                { label: 'Accucapaciteit', key: (p: Product) => `${p.accucapaciteit} (${p.accuWhNumber} Wh)` },
                { label: 'Actieradius', key: (p: Product) => p.actieradius },
                { label: 'Aandrijving', key: (p: Product) => p.aandrijving },
                { label: 'Versnelling', key: (p: Product) => p.versnellingDetail },
                { label: 'Remtype', key: (p: Product) => p.remtype },
                { label: 'Wielmaat', key: (p: Product) => p.wielmaat },
                { label: 'Gewicht', key: (p: Product) => `${p.gewichtKg} kg` },
                { label: 'Max. gebruikersgewicht', key: (p: Product) => p.maxGebruikersgewicht },
                { label: 'Fabrieksgarantie Frame', key: (p: Product) => p.warranty.frame },
                { label: 'Fabrieksgarantie Accu', key: (p: Product) => p.warranty.battery },
                { label: 'EN 15194 Gecertificeerd', key: (p: Product) => p.en15194Certified ? 'Ja' : 'Nee' },
                { label: 'Levertijd', key: (p: Product) => p.leverbaarheid }
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-6 py-2.5 items-center">
                  <div className="col-span-1 font-semibold text-slate-500">
                    {tr(row.label)}
                  </div>
                  {comparedProducts.map((p) => (
                    <div key={p.id} className="col-span-1 font-medium text-slate-800">
                      {tr(row.key(p))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
