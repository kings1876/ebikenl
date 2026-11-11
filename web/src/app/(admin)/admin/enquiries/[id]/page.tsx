'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, Notice, StatusBadge, when } from '@/components/admin/ui';
import type { StoredEnquiry } from '@/lib/reply/types';

export default function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { api } = useAdmin();
  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api<{ enquiry: StoredEnquiry }>(`/api/admin/enquiries/${id}`).then(({ status, data }) => {
      if (status === 404) setMissing(true);
      else setEnquiry(data.enquiry ?? null);
    });
  }, [api, id]);

  if (missing) return <Notice tone="error">Enquiry not found.</Notice>;
  if (!enquiry) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/enquiries" className="text-sm text-slate-400 hover:text-white">← Enquiries</Link>
        <h1 className="text-2xl font-extrabold text-white">{enquiry.name}</h1>
        <StatusBadge status={enquiry.status} />
      </div>
      <Card title="Contact">
        <p className="text-sm text-slate-300"><a className="underline" href={`mailto:${enquiry.email}`}>{enquiry.email}</a></p>
        {enquiry.phone && <p className="text-sm text-slate-300">{enquiry.phone}</p>}
        <p className="mt-1 text-xs text-slate-500">{when(enquiry.createdAt)} · {enquiry.locale === 'en' ? 'English' : 'Dutch'}</p>
      </Card>
      {(enquiry.kind === 'quote' || enquiry.source) && (
        <Card title={enquiry.kind === 'quote' ? 'Quote request' : 'Source'}>
          {enquiry.product && (
            <p className="text-sm text-slate-200">
              <Link className="underline" href={`/product/${enquiry.product.slug}`} target="_blank">{enquiry.product.name}</Link>
              <span className="ml-2 text-slate-400">€{enquiry.product.price.toLocaleString('nl-NL')}{enquiry.product.indicative ? ' (indicative price: confirm before quoting)' : ''}</span>
            </p>
          )}
          {enquiry.source && <p className="mt-1 text-xs text-slate-500">Came from {enquiry.source}</p>}
        </Card>
      )}
      <Card title="Message">
        <p className="whitespace-pre-wrap text-sm text-slate-200">{enquiry.message}</p>
      </Card>
      <Link href={`/admin/reply-enquiry?id=${encodeURIComponent(enquiry.id)}`} className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500">
        {enquiry.status === 'replied' ? 'Reply again' : 'Reply'}
      </Link>
    </div>
  );
}
