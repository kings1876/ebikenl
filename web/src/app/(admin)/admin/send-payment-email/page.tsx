'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, Notice, PrimaryButton, eur, useQueryId } from '@/components/admin/ui';
import { REPLY } from '@/config/reply';
import { paymentMethodParts, paymentTermsLines, parsePaymentDetail } from '@/lib/reply/order';
import type { StoredOrder } from '@/lib/reply/types';

const PLACEHOLDER = 'Account name: E-BIKE-TEKOOP.NL\nIBAN: NL00 BANK 0000 0000 00\nReference: EBT-XXXXXX';

export default function SendPaymentEmail() {
  const id = useQueryId();
  const { api } = useAdmin();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [methodId, setMethodId] = useState<string>(REPLY.paymentMethods[0].id);
  const [detail, setDetail] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    api<{ order: StoredOrder }>(`/api/admin/orders/${encodeURIComponent(id)}`).then(({ data }) => {
      if (data.order) {
        setOrder(data.order);
        if (REPLY.paymentMethods.some((m) => m.id === data.order.paymentMethod)) setMethodId(data.order.paymentMethod);
        if (data.order.paymentDetails) setDetail(data.order.paymentDetails.fields.map((f) => `${f.label}: ${f.value}`).join('\n'));
      }
    });
  }, [api, id]);

  const fields = useMemo(() => parsePaymentDetail(detail), [detail]);
  const parts = order ? paymentMethodParts(methodId, order.amountDue, order.orderNumber, order.locale) : null;

  const send = async () => {
    if (!order) return;
    if (!window.confirm(`Email these payment details to ${order.customerEmail}?`)) return;
    setBusy(true);
    setResult(null);
    const { status, data } = await api<{ error?: string }>('/api/admin/send-payment-email', {
      method: 'POST',
      body: JSON.stringify({ orderNumber: order.orderNumber, methodId, detail }),
    });
    setBusy(false);
    setResult(
      status === 200
        ? { tone: 'ok', text: `Sent to ${order.customerEmail}. The order is now marked "payment sent".` }
        : { tone: 'error', text: status === 503 ? 'Email is not configured or failed (check the SMTP_* variables in Vercel). Nothing was marked as sent.' : `Could not send (${data.error ?? status}).` },
    );
  };

  if (!id) return <Notice tone="error">No order selected. Open an order and press “Send payment details”.</Notice>;
  if (!order) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} className="text-sm text-slate-400 hover:text-white">← Order</Link>
        <h1 className="text-2xl font-extrabold text-white">Payment details for <span className="font-mono">{order.orderNumber}</span></h1>
      </div>
      <p className="text-sm text-slate-400">{order.customerName} · {order.customerEmail} · {eur(order.amountDue)} · email language: {order.locale === 'en' ? 'English' : 'Dutch'}</p>

      <Card title="1. Payment method">
        <select
          value={methodId}
          onChange={(e) => setMethodId(e.target.value)}
          aria-label="Payment method"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
        >
          {REPLY.paymentMethods.map((m) => (
            <option key={m.id} value={m.id}>{m.label.en}</option>
          ))}
        </select>
      </Card>

      <Card title="2. Paste the real payment details">
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={6}
          placeholder={PLACEHOLDER}
          aria-label="Payment details, one Label: value per line"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-white placeholder:text-slate-600"
        />
        <p className="mt-2 text-xs text-slate-500">One <code>Label: value</code> per line. Each line becomes its own copy button for the customer. Use your real details only: the placeholder above is an example.</p>
      </Card>

      <Card title="3. What the customer will see">
        {parts && (
          <div className="space-y-3 rounded-xl bg-white p-4 text-sm text-slate-800">
            <p>{parts.opening}</p>
            {fields.length === 0 ? (
              <p className="text-slate-400">Nothing pasted yet.</p>
            ) : (
              <dl className="space-y-1.5">
                {fields.map((f, i) => (
                  <div key={i} className="flex gap-3">
                    <dt className="w-36 shrink-0 text-xs font-bold uppercase text-slate-400">{f.label}</dt>
                    <dd className="break-all font-mono">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p>{parts.closing}</p>
            <ul className="list-disc space-y-1 rounded-lg bg-blue-50 p-3 pl-7 text-xs">
              {paymentTermsLines(order.orderNumber, order.locale).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {result && <Notice tone={result.tone}>{result.text}</Notice>}
      <PrimaryButton onClick={send} disabled={busy || fields.length === 0}>{busy ? 'Sending…' : 'Send email to customer'}</PrimaryButton>
    </div>
  );
}
