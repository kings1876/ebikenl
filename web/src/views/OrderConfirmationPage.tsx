'use client';

import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from '@/lib/router';
import { CheckCircle, Mail, ArrowRight } from '@/components/icons';
import { formatEur } from '../utils/format';
import { useTr } from '@/i18n/locale';
import { methodLabel } from '@/lib/reply/order';
import { REPLY } from '@/config/reply';

// Deliberately no payment instructions, bank details or deadlines here: those arrive by email once the order has been reviewed.
export const OrderConfirmationPage: React.FC = () => {
  const tr = useTr();

  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as { paymentMethod?: string; cartTotal?: number; email?: string } | undefined;

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
          {tr("Je ordernummer is")} <strong className="text-slate-900 font-mono">{tr(orderId)}</strong>{tr(". We hebben een bevestiging naar je e-mail gestuurd.")}
        </p>
      </div>

      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Mail className="w-5 h-5 text-blue-600" />
          <span>{tr("Let op onze volgende e-mail")}</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          {tr("We sturen je binnenkort een tweede e-mail met de betaalgegevens voor deze bestelling. Je bestelling is definitief zodra de betaling is ontvangen.")}
        </p>
        <p className="text-xs text-slate-500">
          {tr("Geen e-mail ontvangen? Kijk ook in je spam, of mail ons op")} <a className="underline font-semibold" href={`mailto:${REPLY.channels.email}`}>{REPLY.channels.email}</a>.
        </p>
      </div>

      {(state?.paymentMethod || state?.cartTotal) && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          {state?.paymentMethod && (
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">{tr("Gekozen betaalmethode:")}</span>
              <span className="font-semibold text-slate-900">{tr(methodLabel(state.paymentMethod))}</span>
            </div>
          )}
          {state?.cartTotal ? (
            <div className="flex justify-between items-center pt-1 text-sm font-bold">
              <span className="text-slate-900">{tr("Totaalbedrag:")}</span>
              <span className="text-blue-700">{formatEur(state.cartTotal)}</span>
            </div>
          ) : null}
        </div>
      )}

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
}
