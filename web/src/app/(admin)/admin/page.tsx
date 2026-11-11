'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, NOT_CONFIGURED, StatusBadge, eur, when } from '@/components/admin/ui';
import type { StoredEnquiry, StoredOrder } from '@/lib/reply/types';

export default function AdminHome() {
  const { api } = useAdmin();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ orders: StoredOrder[]; configured: boolean }>('/api/admin/orders'),
      api<{ enquiries: StoredEnquiry[] }>('/api/admin/enquiries'),
    ]).then(([o, e]) => {
      setOrders(o.data.orders ?? []);
      setEnquiries(e.data.enquiries ?? []);
      setConfigured(o.data.configured !== false);
      setLoaded(true);
    });
  }, [api]);

  const pending = orders.filter((o) => o.status === 'pending').length;
  const fresh = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
      {loaded && !configured && NOT_CONFIGURED}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/orders" className="block">
          <Card title="Orders" className="hover:border-slate-600">
            <div className="text-4xl font-extrabold text-white">{orders.length}</div>
            <div className="mt-1 text-sm text-slate-400">{pending} waiting for payment details</div>
          </Card>
        </Link>
        <Link href="/admin/enquiries" className="block">
          <Card title="Enquiries" className="hover:border-slate-600">
            <div className="text-4xl font-extrabold text-white">{enquiries.length}</div>
            <div className="mt-1 text-sm text-slate-400">{fresh} not answered yet</div>
          </Card>
        </Link>
      </div>

      <Card title="Recent orders">
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {orders.slice(0, 5).map((o) => (
              <li key={o.orderNumber}>
                <Link href={`/admin/orders/${encodeURIComponent(o.orderNumber)}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-slate-800/40">
                  <span>
                    <span className="font-mono text-sm font-bold text-white">{o.orderNumber}</span>
                    <span className="ml-2 text-sm text-slate-400">{o.customerName}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <span className="text-slate-400">{eur(o.amountDue)}</span>
                    <StatusBadge status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent enquiries">
        {enquiries.length === 0 ? (
          <p className="text-sm text-slate-500">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {enquiries.slice(0, 5).map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${encodeURIComponent(e.id)}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-slate-800/40">
                  <span>
                    <span className="text-sm font-bold text-white">{e.name}</span>
                    <span className="ml-2 text-xs text-slate-500">{when(e.createdAt)}</span>
                  </span>
                  <StatusBadge status={e.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
