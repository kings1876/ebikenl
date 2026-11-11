import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminApp } from '@/components/admin/AdminApp';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Reply desk',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <AdminApp>{children}</AdminApp>
      </body>
    </html>
  );
}
