'use client';

import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from '@/lib/router';
import { CheckCircle, Truck, FileText, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { formatEur } from '../utils/format';
import { useTr } from '@/i18n/locale';

export const OrderConfirmationPage: React.FC = () => {
  const tr = useTr();

  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as any;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-[#00b67a] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          {tr("Hartelijk dank voor je bestelling!")}
        </h1>

        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {tr("Je ordernummer is")} <strong className="text-slate-900 font-mono">{tr(orderId)}</strong>{tr(". We hebben de officiële factuur en bevestiging naar je e-mail gestuurd.")}
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-slate-500 font-medium">{tr("Status bestelling:")}</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {tr("In verwerking bij distributeur")}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-slate-500 font-medium">{tr("Aflevermethode:")}</span>
          <span className="font-semibold text-slate-900">
            {tr("100% Rijklaar aan huis (koerier belt 30 min van tevoren)")}
          </span>
        </div>

        {state?.paymentMethod && (
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium">{tr("Betaalmethode:")}</span>
            <span className="font-semibold text-slate-900 uppercase">
              {state.paymentMethod === 'ideal' ? tr("iDEAL") : state.paymentMethod === 'bank' ? tr('SEPA Bankoverschrijving') : `Crypto (${state.cryptoAsset || 'BTC'})`}
            </span>
          </div>
        )}

        {state?.cartTotal && (
          <div className="flex justify-between items-center pt-1 text-sm font-bold">
            <span className="text-slate-900">{tr("Totaalbedrag voldaan:")}</span>
            <span className="text-blue-700">{formatEur(state.cartTotal)}</span>
          </div>
        )}
      </div>

      {/* Trustpilot review invitation */}
      <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="text-[#00b67a]">{tr("★ Trustpilot")}</span>
          <span>{tr("Jouw mening telt!")}</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {tr("Zodra onze koerier jouw e-bike heeft afgeleverd en op maat heeft afgesteld, ontvang je per e-mail een korte uitnodiging om je ervaring te delen op Trustpilot.")}
        </p>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
        >
          <span>{tr("Terug naar de winkel")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
