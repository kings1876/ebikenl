'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { CARD_PRODUCTS as PRODUCTS } from '../data/slim';
import { Product } from '../types/ebike';
import { formatEur } from '../utils/format';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sparkles, Check, ArrowRight, RotateCcw, Compass, ArrowLeft } from 'lucide-react';
import { useTr } from '@/i18n/locale';

export const KeuzehulpPage: React.FC = () => {
  const tr = useTr();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    gebruik: 'woon-werk',
    afstand: '60-100',
    instap: 'laag',
    aandrijving: 'alles'
  });

  const getRecommendations = () => {
    return PRODUCTS.filter((p) => {
      if (answers.gebruik === 'speed' && p.maximaleSnelheid !== '45 km/u') return false;
      if (answers.gebruik === 'gezin' && p.subCategory !== 'Bakfietsen' && !p.tags.includes('Gezinsfiets')) return false;
      if (answers.gebruik === 'sportief' && p.subCategory !== 'Elektrische mountainbikes' && !p.tags.includes('Sportief')) return false;

      if (answers.instap === 'laag' && !(p.doelgroep ?? "").includes('lage instap')) return false;
      if (answers.instap === 'diamant' && !(p.doelgroep ?? "").includes('diamant')) return false;
      if (answers.instap === 'vouw' && p.opvouwbaar !== 'Ja') return false;

      if (answers.aandrijving === 'riem' && p.aandrijving !== 'Riem') return false;

      return true;
    });
  };

  const recommendations = getRecommendations();
  const topMatch = recommendations[0];

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'E-bike Keuzehulp' }]} />

      <div className="text-center space-y-2 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
          <Compass className="w-4 h-4" />
          <span>{tr("Binnen 1 minuut de juiste e-bike")}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
          {tr("Online E-Bike Keuzehulp")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {tr("Beantwoord 4 korte vragen en ontdek direct welk model perfect aansluit bij jouw wensen en rijstijl.")}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {tr("Stap 1 van 4: Gebruiksdoel")}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {tr("Waar ga je de e-bike voornamelijk voor gebruiken?")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
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
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    answers.gebruik === opt.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{tr(opt.label)}</div>
                  <div className="text-xs text-slate-500 mt-1">{tr(opt.desc)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {tr("Stap 2 van 4: Framevorm")}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {tr("Welk type framevorm past bij jouw voorkeur?")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {[
                { id: 'laag', label: 'Lage Instap (Dames)', desc: 'Moeiteloos en veilig op- en afstappen, maximale stabiliteit' },
                { id: 'diamant', label: 'Heren (Hoge Buis)', desc: 'Klassiek sportief diamantframe met hoge stijfheid' },
                { id: 'vouw', label: 'Vouwfiets', desc: 'Compact op te vouwen voor trein en kofferbak' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, instap: opt.id })}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    answers.instap === opt.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{tr(opt.label)}</div>
                  <div className="text-xs text-slate-500 mt-1">{tr(opt.desc)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {tr("Stap 3 van 4: Accucapaciteit")}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {tr("Hoeveel kilometer wil je kunnen rijden op één lading?")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {[
                { id: 'tot-60', label: 'Tot 60 km (400-500 Wh)', desc: 'Korte ritten en stadsverkeer' },
                { id: '60-100', label: '60 tot 100 km (500-625 Wh)', desc: 'Meest gekozen, zorgeloos toeren' },
                { id: '100-plus', label: '100 tot 150+ km (750-1000 Wh)', desc: 'Voor echte langeafstandsfietser' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, afstand: opt.id })}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    answers.afstand === opt.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{tr(opt.label)}</div>
                  <div className="text-xs text-slate-500 mt-1">{tr(opt.desc)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {tr("Stap 4 van 4: Aandrijving")}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {tr("Heb je een voorkeur voor riemaandrijving of ketting?")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {[
                { id: 'riem', label: 'Belt Drive (Riemaandrijving)', desc: 'Onderhoudsvrij, stil, geen kettingvet en gaat 3x langer mee' },
                { id: 'ketting', label: 'Traditionele Ketting', desc: 'Bewezen techniek, voordeliger in aanschaf' },
                { id: 'alles', label: 'Geen specifieke voorkeur', desc: 'Toon beide opties' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, aandrijving: opt.id })}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    answers.aandrijving === opt.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{tr(opt.label)}</div>
                  <div className="text-xs text-slate-500 mt-1">{tr(opt.desc)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && !topMatch && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <h2 className="text-lg font-bold text-slate-900">{tr("Ons assortiment wordt geladen")}</h2>
            <p className="text-xs text-slate-600">{tr("We vullen momenteel de catalogus met nieuwe modellen. Kom binnenkort terug of bekijk alvast onze categorieën.")}</p>
            <Link to="/categorie/elektrische-fietsen" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">{tr("Bekijk alle e-bikes")}</Link>
          </div>
        )}

        {step === 5 && topMatch && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-[#00b67a] rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {tr("Jouw Aanbevolen E-Bike")}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {tr("Geselecteerd op basis van jouw antwoorden en rijwensen:")}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-48 h-36 bg-white rounded-xl border border-slate-200 p-2 shrink-0 flex items-center justify-center">
                <img
                  src={topMatch.image}
                  alt={topMatch.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {tr("Top Match ·")} {tr(topMatch.brand)}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {tr(topMatch.title)}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tr(topMatch.subCategory)}{topMatch.motorModel ? ` · ${topMatch.motorModel}` : ''}{topMatch.accuWhNumber ? ` · ${topMatch.accuWhNumber} Wh` : ''}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {formatEur(topMatch.price)}
                  </span>
                  <Link
                    to={`/product/${topMatch.slug}`}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tr("Bekijk model")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 && step <= 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              {tr("Vorige vraag")}
            </button>
          )}

          {step === 5 && (
            <button
              onClick={resetQuiz}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{tr("Opnieuw beginnen")}</span>
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>{tr("Volgende stap")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : step === 4 ? (
            <button
              onClick={() => setStep(5)}
              className="ml-auto px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <span>{tr("Bekijk resultaat")}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
