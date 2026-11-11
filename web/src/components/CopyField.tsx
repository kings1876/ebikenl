'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTr } from '@/i18n/locale';

/** One payment-detail row with a tap-to-copy button (email clients strip JavaScript, so the copy button lives on this page). */
export function CopyField({ label, value }: { label: string; value: string }) {
  const tr = useTr();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the value is still visible and selectable */
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
        <div className="break-all font-mono text-sm text-slate-900">{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-slate-200"
        aria-label={`${tr('Kopieer')} ${label}`}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        <span aria-live="polite">{copied ? tr('Gekopieerd') : tr('Kopieer')}</span>
      </button>
    </div>
  );
}
