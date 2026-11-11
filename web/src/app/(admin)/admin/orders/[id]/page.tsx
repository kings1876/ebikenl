'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, Notice, StatusBadge, eur, when } from '@/components/admin/ui';
import { methodLabel } from '@/lib/reply/order';
import type { StoredOrder } from '@/lib/reply/types';

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { api } = useAdmin();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api<{ order: StoredOrder }>(`/api/admin/orders/${id}`).then(({ status, data }) => {
      if (status === 404) setMissing(true);
      else setOrder(data.order ?? null);
    });
  }, [api, id]);

  if (missing) return <Notice tone="error">Order not found.</Notice>;
  if (!order) return <p className="text-sm text-slate-500">Loading…</p>;

  const sent = order.status !== 'pending';
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/orders" className="text-sm text-slate-400 hover:text-white">← Orders</Link>
        <h1 className="font-mono text-2xl font-extrabold text-white">{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      {order.status === 'payment-confirmed' && (
        <Notice tone="ok">
          The customer uploaded a payment confirmation {order.paymentConfirmedAt ? `on ${when(order.paymentConfirmedAt)}` : ''}. Check your bank before dispatching.
          {order.paymentNote ? ` Note: “${order.paymentNote}”` : ''}
        </Notice>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Customer">
          <p className="font-semibold text-white">{order.customerName}{order.company ? ` (${order.company})` : ''}</p>
          <p className="text-sm text-slate-300"><a className="underline" href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a></p>
          <p className="text-sm text-slate-300">{order.customerPhone}</p>
          <p className="mt-2 text-sm text-slate-400">{order.address.street}, {order.address.postalCode} {order.address.city}</p>
        </Card>
        <Card title="Order">
          <p className="text-sm text-slate-300">Placed {when(order.createdAt)} · {order.locale === 'en' ? 'English' : 'Dutch'}</p>
          <p className="text-sm text-slate-300">Preferred payment: {methodLabel(order.paymentMethod, 'en')}</p>
          {order.discount ? (
            <p className="mt-2 text-sm text-emerald-300">Crypto discount {eur(order.discount)} applied to a subtotal of {eur(order.subtotal ?? order.amountDue + order.discount)}</p>
          ) : null}
          <p className="mt-2 text-2xl font-extrabold text-white">{eur(order.amountDue)}</p>
          {order.notes && <p className="mt-2 text-sm text-slate-400">Notes: {order.notes}</p>}
        </Card>
      </div>

      <Card title="Items">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-800">
            {order.items.map((i, idx) => (
              <tr key={idx}>
                <td className="py-2 pr-3 text-slate-200">
                  {i.name}
                  <span className="block text-xs text-slate-500">{i.size} · {i.color} · {i.quantity}×</span>
                  {i.indicative && <span className="block text-xs text-amber-300">Indicative price (converted from Swiss list price): confirm before sending payment details</span>}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-200">{eur(i.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {order.paymentDetails && (
        <Card title={`Payment details sent ${when(order.paymentDetails.sentAt)}`}>
          <dl className="space-y-1 text-sm">
            {order.paymentDetails.fields.map((f, i) => (
              <div key={i} className="flex gap-3">
                <dt className="w-40 shrink-0 text-slate-500">{f.label}</dt>
                <dd className="break-all font-mono text-slate-200">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      <Link
        href={`/admin/send-payment-email?id=${encodeURIComponent(order.orderNumber)}`}
        className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
      >
        {sent ? 'Resend payment details' : 'Send payment details'}
      </Link>
    </div>
  );
}
