'use client';

// Passcode gate + shared admin context. Every /admin page renders inside this, so pages never re-implement auth.
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { REPLY } from '@/config/reply';

const STORAGE_KEY = 'ebt-admin-passcode';

interface AdminContextValue {
  /** fetch() against an /api/admin/* path with the passcode header; resolves to parsed JSON plus the HTTP status. */
  api: <T = Record<string, unknown>>(path: string, init?: RequestInit) => Promise<{ status: number; data: T }>;
  signOut: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminApp');
  return ctx;
};

type GateState = 'checking' | 'locked' | 'open' | 'not-configured';

export function AdminApp({ children }: { children: React.ReactNode }) {
  const [passcode, setPasscode] = useState('');
  const [state, setState] = useState<GateState>('checking');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const verify = useCallback(async (code: string) => {
    const res = await fetch('/api/admin/orders', { headers: { 'x-admin-passcode': code }, cache: 'no-store' });
    if (res.status === 503) return 'not-configured' as const;
    return res.ok ? ('open' as const) : ('locked' as const);
  }, []);

  useEffect(() => {
    let saved = '';
    try {
      saved = localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      /* private mode: just ask again */
    }
    if (!saved) {
      // Still ask the server so a missing ADMIN_PASSCODE shows a useful message instead of a blank lock screen.
      verify('').then((s) => setState(s === 'not-configured' ? s : 'locked'));
      return;
    }
    verify(saved).then((s) => {
      if (s === 'open') setPasscode(saved);
      setState(s);
    });
  }, [verify]);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPasscode('');
    setInput('');
    setState('locked');
  }, []);

  const api = useCallback<AdminContextValue['api']>(
    async (path, init = {}) => {
      const res = await fetch(path, {
        ...init,
        cache: 'no-store',
        headers: { ...(init.headers ?? {}), 'x-admin-passcode': passcode, ...(init.body ? { 'content-type': 'application/json' } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) signOut();
      return { status: res.status, data };
    },
    [passcode, signOut],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const s = await verify(input);
    if (s === 'open') {
      try {
        localStorage.setItem(STORAGE_KEY, input);
      } catch {
        /* ignore */
      }
      setPasscode(input);
      setState('open');
    } else if (s === 'not-configured') {
      setState(s);
    } else {
      setError('Wrong passcode.');
    }
  };

  if (state === 'checking') return <div className="min-h-screen grid place-items-center text-slate-400 text-sm">Loading…</div>;

  if (state === 'not-configured') {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300 space-y-2">
          <h1 className="text-lg font-bold text-white">Admin not configured</h1>
          <p>
            Set the <code className="text-amber-300">ADMIN_PASSCODE</code> environment variable in Vercel and redeploy. Until then the dashboard stays closed.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'locked') {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: REPLY.brand.primary }}>{REPLY.siteName}</div>
            <h1 className="text-xl font-bold text-white">Reply desk</h1>
          </div>
          <label className="block text-xs text-slate-400">
            Passcode
            <input
              type="password"
              autoComplete="current-password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: REPLY.brand.primary }}
              autoFocus
            />
          </label>
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="w-full rounded-lg py-2.5 text-sm font-bold text-white" style={{ background: REPLY.brand.primary }}>
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ api, signOut }}>
      <AdminNav onSignOut={signOut} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </AdminContext.Provider>
  );
}

function AdminNav({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();
  const items = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/enquiries', label: 'Enquiries' },
  ];
  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/admin" className="text-sm font-extrabold tracking-tight text-white">
          <span style={{ color: REPLY.brand.primary }}>●</span> {REPLY.siteName}
        </Link>
        <nav aria-label="Admin" className="flex items-center gap-1">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${active(i.href) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              aria-current={active(i.href) ? 'page' : undefined}
            >
              {i.label}
            </Link>
          ))}
        </nav>
        <button onClick={onSignOut} className="ml-auto rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white">
          Sign out
        </button>
      </div>
    </header>
  );
}
