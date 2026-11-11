'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminApp';
import { Card, Notice, PrimaryButton, useQueryId } from '@/components/admin/ui';
import type { StoredEnquiry } from '@/lib/reply/types';

export default function ReplyEnquiry() {
  const id = useQueryId();
  const { api } = useAdmin();
  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    api<{ enquiry: StoredEnquiry }>(`/api/admin/enquiries/${encodeURIComponent(id)}`).then(({ data }) => setEnquiry(data.enquiry ?? null));
  }, [api, id]);

  const send = async () => {
    if (!enquiry) return;
    setBusy(true);
    setResult(null);
    const { status, data } = await api<{ error?: string }>('/api/admin/reply-enquiry', { method: 'POST', body: JSON.stringify({ id: enquiry.id, reply }) });
    setBusy(false);
    setResult(
      status === 200
        ? { tone: 'ok', text: `Reply sent to ${enquiry.email}. The enquiry is now marked as replied.` }
        : { tone: 'error', text: status === 503 ? 'Email is not configured or failed (check the SMTP_* variables in Vercel). Nothing was marked as replied.' : `Could not send (${data.error ?? status}).` },
    );
  };

  if (!id) return <Notice tone="error">No enquiry selected. Open an enquiry and press “Reply”.</Notice>;
  if (!enquiry) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/admin/enquiries/${encodeURIComponent(enquiry.id)}`} className="text-sm text-slate-400 hover:text-white">← Enquiry</Link>
        <h1 className="text-2xl font-extrabold text-white">Reply to {enquiry.name}</h1>
      </div>
      <Card title="Their message">
        <p className="whitespace-pre-wrap text-sm text-slate-300">{enquiry.message}</p>
      </Card>
      <Card title={`Your reply to ${enquiry.email}`}>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={8}
          aria-label="Your reply"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white"
        />
        <p className="mt-2 text-xs text-slate-500">Sent in the branded email template, in {enquiry.locale === 'en' ? 'English' : 'Dutch'} chrome. Their original message is quoted underneath.</p>
      </Card>
      {result && <Notice tone={result.tone}>{result.text}</Notice>}
      <PrimaryButton onClick={send} disabled={busy || reply.trim().length < 2}>{busy ? 'Sending…' : 'Send reply'}</PrimaryButton>
    </div>
  );
}
