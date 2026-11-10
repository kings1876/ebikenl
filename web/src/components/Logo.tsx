import React from 'react';

/** Brand mark: electric bolt inside a wheel. Same artwork as src/app/icon.svg. */
export const LogoMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 64 64" role="img" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="14" fill="#2563eb" />
    <circle cx="32" cy="32" r="18" fill="none" stroke="#fff" strokeWidth="4" />
    <path d="M35.5 19 24 34.5h7.4L28.5 45 40 29.5h-7.4z" fill="#fff" />
  </svg>
);

/** Mark + wordmark. `onDark` switches the wordmark to white for the footer. */
export const Logo: React.FC<{ onDark?: boolean; className?: string }> = ({ onDark = false, className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 font-display font-black tracking-tight whitespace-nowrap ${className}`}>
    <LogoMark className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
    <span className={onDark ? 'text-white' : 'text-slate-900'}>
      E-BIKE-TEKOOP<span className={onDark ? 'text-blue-400' : 'text-blue-600'}>.NL</span>
    </span>
  </span>
);
