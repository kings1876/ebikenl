'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTr } from '@/i18n/locale';

export const PAGE_SIZE = 24;

/** Page numbers to show: first, last, and a window around the current page, with gaps as null. */
function pageList(current: number, total: number): (number | null)[] {
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(null);
    out.push(n);
  });
  return out;
}

interface PaginationProps {
  page: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalItems, pageSize = PAGE_SIZE, onPageChange }) => {
  const tr = useTr();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const btn = 'min-w-9 h-9 px-3 inline-flex items-center justify-center rounded-lg border text-xs font-semibold transition-colors';
  const idle = 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
  const disabled = 'opacity-40 pointer-events-none';

  return (
    <nav aria-label={tr('Paginering')} className="flex flex-wrap items-center justify-center gap-2 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${btn} ${idle} gap-1 ${page <= 1 ? disabled : ''}`}
      >
        <ChevronLeft className="w-4 h-4" />
        {tr('Vorige')}
      </button>
      {pageList(page, totalPages).map((n, i) =>
        n === null ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden="true">…</span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${btn} ${n === page ? 'bg-blue-600 text-white border-blue-600' : idle}`}
          >
            {n}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${btn} ${idle} gap-1 ${page >= totalPages ? disabled : ''}`}
      >
        {tr('Volgende')}
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
