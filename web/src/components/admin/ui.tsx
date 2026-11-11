'use client';

import React from 'react';
import { REPLY } from '@/config/reply';
import { useQueryParam } from '@/lib/useQueryParam';
import type { OrderStatus } from '@/lib/reply/types';

export const eur = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
export const when = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900 p-5 ${className}`}>
      {title && <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</h2>}
      {children}
    </section>
  );
}

const ORDER_BADGES: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-500/15 text-amber-300' },
  'payment-sent': { label: 'Payment sent', cls: 'bg-blue-500/15 text-blue-300' },
  'payment-confirmed': { label: 'Payment confirmed', cls: 'bg-emerald-500/15 text-emerald-300' },
};

export function StatusBadge({ status }: { status: OrderStatus | 'new' | 'replied' }) {
  const b = status === 'new' ? { label: 'New', cls: 'bg-amber-500/15 text-amber-300' } : status === 'replied' ? { label: 'Replied', cls: 'bg-emerald-500/15 text-emerald-300' } : ORDER_BADGES[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${b.cls}`}>{b.label}</span>;
}

export function PrimaryButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`rounded-lg px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${rest.className ?? ''}`} style={{ background: REPLY.brand.primary }}>
      {children}
    </button>
  );
}

export function Notice({ children, tone = 'warn' }: { children: React.ReactNode; tone?: 'warn' | 'error' | 'ok' }) {
  const cls = tone === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-200' : tone === 'ok' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-amber-500/40 bg-amber-500/10 text-amber-200';
  return <div role={tone === 'error' ? 'alert' : undefined} className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

export const NOT_CONFIGURED = (
  <Notice>
    No database is connected yet, so orders and enquiries are only arriving by email. Add Upstash Redis in the Vercel Storage tab and redeploy to see them here.
  </Notice>
);

/** Reads ?id= without useSearchParams so the page needs no Suspense boundary. */
export const useQueryId = () => useQueryParam('id');
