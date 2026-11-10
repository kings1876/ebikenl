import React from 'react';
import { Product } from '../types/ebike';
import { formatEur } from '../utils/format';
import { X, Trash2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onClearCompare: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveFromCompare,
  onClearCompare,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              E-bike Modellen Vergelijken ({comparedProducts.length}/4)
            </h2>
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium"
              >
                Alles wissen
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto p-6 flex-1">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <p className="font-semibold text-slate-800">
                Geen fietsen geselecteerd om te vergelijken.
              </p>
              <p className="text-xs text-slate-500">
                Klik op het weegschaal-icoon bij een e-bike in de winkel om deze toe te voegen aan de vergelijker.
              </p>
            </div>
          ) : (
            <div className="min-w-[650px]">
              {/* Product Cards Row */}
              <div className="grid grid-cols-5 gap-4 pb-6 border-b border-slate-200">
                <div className="col-span-1 flex flex-col justify-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Eigenschappen
                  </span>
                </div>

                {comparedProducts.map((p) => (
                  <div key={p.id} className="col-span-1 flex flex-col relative group">
                    <button
                      onClick={() => onRemoveFromCompare(p)}
                      className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Verwijder uit vergelijking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="aspect-4/3 w-full bg-slate-50 rounded-lg p-2 mb-2 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-xs font-bold text-slate-500">{p.brand}</div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-2 h-8">
                      {p.model}
                    </div>
                    <div className="text-sm font-black text-blue-700 tabular-nums mt-1">
                      {formatEur(p.price)}
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(p);
                      }}
                      className="mt-2 py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded text-xs font-semibold transition-colors"
                    >
                      Bekijk product
                    </button>
                  </div>
                ))}
              </div>

              {/* Attributes Comparison Table */}
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { label: 'Categorie', key: (p: Product) => p.subCategory },
                  { label: 'Doelgroep / Framevorm', key: (p: Product) => p.doelgroep },
                  { label: 'Motormerk & Type', key: (p: Product) => `${p.motormerk} (${p.motorModel})` },
                  { label: 'Motorkoppel (Nm)', key: (p: Product) => `${p.motorTorqueNm} Nm` },
                  { label: 'Motorpositie', key: (p: Product) => p.motorpositie },
                  { label: 'Accucapaciteit', key: (p: Product) => `${p.accucapaciteit} (${p.accuWhNumber} Wh)` },
                  { label: 'Actieradius', key: (p: Product) => p.actieradius },
                  { label: 'Aandrijving', key: (p: Product) => p.aandrijving },
                  { label: 'Versnelling', key: (p: Product) => p.versnellingDetail },
                  { label: 'Remtype', key: (p: Product) => p.remtype },
                  { label: 'Gewicht (kg)', key: (p: Product) => `${p.gewichtKg} kg` },
                  { label: 'Max. Toelaatbaar Gewicht', key: (p: Product) => p.maxGebruikersgewicht },
                  { label: 'Fabrieksgarantie Frame', key: (p: Product) => p.warranty.frame },
                  { label: 'Fabrieksgarantie Accu', key: (p: Product) => p.warranty.battery },
                  { label: 'EN 15194 / CE Keur', key: (p: Product) => p.en15194Certified ? 'Ja, gecertificeerd' : 'Nee' },
                  { label: 'Levertijd', key: (p: Product) => p.leverbaarheid }
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 py-2.5 items-center">
                    <div className="col-span-1 font-semibold text-slate-500">
                      {row.label}
                    </div>
                    {comparedProducts.map((p) => (
                      <div key={p.id} className="col-span-1 font-medium text-slate-800">
                        {row.key(p)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
