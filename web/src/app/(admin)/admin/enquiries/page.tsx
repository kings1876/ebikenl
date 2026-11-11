'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, NOT_CONFIGURED, StatusBadge, when } from '@/components/admin/ui';
import type { StoredEnquiry } from '@/lib/reply/types';

const FILTERS = ['all', 'quotes', 'new', 'replied'] as const;

export default function EnquiriesPage() {
  const { api } = useAdmin();
  const [items, setItems] = useState<StoredEnquiry[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');

  useEffect(() => {
    let live = true;
    api<{ enquiries: StoredEnquiry[]; configured: boolean }>('/api/admin/enquiries').then(({ data }) => {
      if (!live) return;
      setItems(data.enquiries ?? []);
      setConfigured(data.configured !== false);
      setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, [api]);

  const shown = items.filter((e) => filter === 'all' || (filter === 'quotes' ? e.kind === 'quote' : e.status === filter));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-white">Enquiries</h1>
      {loaded && !configured && NOT_CONFIGURED}
      <div className="flex gap-2" role="group" aria-label="Filter">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <Card>
        {shown.length === 0 ? (
          <p className="text-sm text-slate-500">{loaded ? 'Nothing here.' : 'Loading…'}</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {shown.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${encodeURIComponent(e.id)}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-slate-800/40">
                  <span className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-white">{e.name}</span>
                    {e.kind === 'quote' && <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 text-[11px] font-bold text-blue-300">Quote{e.product ? `: ${e.product.name}` : ''}</span>}
                    <span className="block truncate text-xs text-slate-500">{e.message}</span>
                  </span>
                  <span className="text-xs text-slate-500">{when(e.createdAt)}</span>
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
