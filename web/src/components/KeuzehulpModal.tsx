'use client';

import React, { useState } from 'react';
import { Product } from '../types/ebike';
import { formatEur } from '../utils/format';
import { X, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface KeuzehulpModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const KeuzehulpModal: React.FC<KeuzehulpModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    gebruik: 'woon-werk', // 'woon-werk' | 'recreatief' | 'gezin' | 'sportief' | 'speed'
    afstand: '60-100',    // 'tot-60' | '60-100' | '100-plus'
    instap: 'laag',       // 'laag' | 'diamant' | 'vouw'
    aandrijving: 'alles'  // 'riem' | 'ketting' | 'alles'
  });

  const getRecommendations = () => {
    return products.filter((p) => {
      // Filter by speed / category
      if (answers.gebruik === 'speed' && p.maximaleSnelheid !== '45 km/u') return false;
      if (answers.gebruik === 'gezin' && p.subCategory !== 'Bakfietsen' && !p.tags.includes('Gezinsfiets')) return false;
      if (answers.gebruik === 'sportief' && p.subCategory !== 'Elektrische mountainbikes' && !p.tags.includes('Sportief')) return false;

      // Filter by instap
      if (answers.instap === 'laag' && !p.doelgroep.includes('lage instap')) return false;
      if (answers.instap === 'diamant' && !p.doelgroep.includes('diamant')) return false;
      if (answers.instap === 'vouw' && p.opvouwbaar !== 'Ja') return false;

      // Filter by aandrijving
      if (answers.aandrijving === 'riem' && p.aandrijving !== 'Riem') return false;

      return true;
    });
  };

  const recommendations = getRecommendations();
  const topMatch = recommendations[0] || products[0];

  const resetQuiz = () => {
    setStep(1);
    setAnswers({
      gebruik: 'woon-werk',
      afstand: '60-100',
      instap: 'laag',
      aandrijving: 'alles'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              E-bike Keuzehulp (Vind jouw ideale fiets in 4 stappen)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Steps */}
        <div className="p-6">
          {/* Step 1: Gebruik */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Stap 1 van 4: Gebruiksdoel
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Waar ga je de e-bike voornamelijk voor gebruiken?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'woon-werk', label: 'Woon-werkverkeer', desc: 'Dagelijks naar kantoor, snel en comfortabel' },
                  { id: 'recreatief', label: 'Recreatief & Toertochten', desc: 'Lange ontspannen ritten in het weekend en op vakantie' },
                  { id: 'gezin', label: 'Gezinsfiets & Boodschappen', desc: 'Ruimte voor kinderzitjes of een veilige bakfiets' },
                  { id: 'sportief', label: 'Sportief & Trails (e-MTB)', desc: 'Krachtige motor voor heuvels en bospaden' },
                  { id: 'speed', label: 'Speed Pedelec (tot 45 km/u)', desc: 'Snelle woon-werkafstanden boven de 20 kilometer' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, gebruik: opt.id })}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      answers.gebruik === opt.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Instap & Framevorm */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Stap 2 van 4: Framevorm
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Welk type framevorm past bij jouw wensen?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'laag', label: 'Lage Instap (Dames)', desc: 'Moeiteloos en veilig op- en afstappen, maximale stabiliteit' },
                  { id: 'diamant', label: 'Heren (Hoge Buis)', desc: 'Klassiek sportief diamantframe met hoge stijfheid' },
                  { id: 'vouw', label: 'Vouwfiets', desc: 'Compact op te vouwen, ideaal voor openbaar vervoer en boot' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, instap: opt.id })}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      answers.instap === opt.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Actieradius */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Stap 3 van 4: Accucapaciteit
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Hoeveel kilometer wil je gemiddeld rijden op één lading?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'tot-60', label: 'Tot 60 km (400-500 Wh)', desc: 'Korte ritten en stadsverkeer' },
                  { id: '60-100', label: '60 tot 100 km (500-625 Wh)', desc: 'Meest gekozen, zorgeloos toeren' },
                  { id: '100-plus', label: '100 tot 150+ km (750-1000 Wh)', desc: 'Voor echte langeafstandsfietser' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, afstand: opt.id })}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      answers.afstand === opt.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Aandrijving */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Stap 4 van 4: Aandrijving
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Heb je een voorkeur voor riemaandrijving of ketting?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'riem', label: 'Belt Drive (Riemaandrijving)', desc: 'Onderhoudsvrij, stil, geen kettingvet en gaat 3x langer mee' },
                  { id: 'ketting', label: 'Traditionele Ketting', desc: 'Bewezen techniek, voordeliger in aanschaf' },
                  { id: 'alles', label: 'Geen specifieke voorkeur', desc: 'Toon beide opties' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, aandrijving: opt.id })}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      answers.aandrijving === opt.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Result View */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Jouw Perfecte E-bike Match
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Op basis van je antwoorden raden onze fietsspecialisten dit model aan:
                </p>
              </div>

              {/* Product Match Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-40 h-32 bg-white rounded-xl border border-slate-200 p-2 shrink-0 flex items-center justify-center">
                  <img
                    src={topMatch.image}
                    alt={topMatch.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    Beste Keuze: {topMatch.brand}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    {topMatch.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {topMatch.shortDescription}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      {formatEur(topMatch.price)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(topMatch);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Bekijk specificaties
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 && step <= 4 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Vorige vraag
              </button>
            )}

            {step === 5 ? (
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Opnieuw beginnen</span>
              </button>
            ) : null}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="ml-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <span>Volgende stap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : step === 4 ? (
              <button
                onClick={() => setStep(5)}
                className="ml-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <span>Bekijk advies</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                Sluiten
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
