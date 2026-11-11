'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, NOT_CONFIGURED, StatusBadge, eur, when } from '@/components/admin/ui';
import type { StoredOrder } from '@/lib/reply/types';

export default function OrdersPage() {
  const { api } = useAdmin();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    api<{ orders: StoredOrder[]; configured: boolean }>('/api/admin/orders').then(({ data }) => {
      if (!live) return;
      setOrders(data.orders ?? []);
      setConfigured(data.configured !== false);
      setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, [api, tick]);

  const remove = async (o: StoredOrder) => {
    if (!window.confirm(`Delete order ${o.orderNumber}? This cannot be undone.`)) return;
    await api(`/api/admin/orders/${encodeURIComponent(o.orderNumber)}`, { method: 'DELETE' });
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-white">Orders</h1>
      {loaded && !configured && NOT_CONFIGURED}
      <Card>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">{loaded ? 'No orders yet.' : 'Loading…'}</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {orders.map((o) => (
              <li key={o.orderNumber} className="flex flex-wrap items-center gap-3 py-3">
                <Link href={`/admin/orders/${encodeURIComponent(o.orderNumber)}`} className="min-w-0 flex-1 hover:underline">
                  <span className="font-mono text-sm font-bold text-white">{o.orderNumber}</span>
                  <span className="ml-2 text-sm text-slate-300">{o.customerName}</span>
                  <span className="block text-xs text-slate-500">{when(o.createdAt)} · {o.items.length} item{o.items.length === 1 ? '' : 's'}</span>
                </Link>
                <span className="text-sm font-semibold text-slate-200">{eur(o.amountDue)}</span>
                <StatusBadge status={o.status} />
                <button onClick={() => remove(o)} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-red-400" aria-label={`Delete order ${o.orderNumber}`}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
