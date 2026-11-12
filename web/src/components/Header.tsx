'use client';

import React from 'react';
import NextLink from 'next/link';
import { Link, useLocation } from '@/lib/router';
import { ShoppingBag, Scale, Compass } from '@/components/icons';
import { formatEur } from '../utils/format';
import { useShop } from '../context/ShopContext';
import { useTr } from '@/i18n/locale';
import { REPLY } from '@/config/reply';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from './Logo';

const NAV_LINK = 'whitespace-nowrap shrink-0 transition-colors hover:text-blue-600';
const ACTIVE = 'text-blue-600 font-semibold';
// plain: the blog exists in Dutch only, so English pages link to /blog directly instead of through a redirect
const NAV = [
  { to: '/categorie/elektrische-fietsen', label: 'Elektrische Fietsen', plain: false },
  { to: '/bosch-middenmotor', label: 'Bosch Middenmotor', plain: false },
  { to: '/fietsplan-e-bikes', label: 'Fietsplan (WKR)', plain: false },
  { to: '/blog', label: 'Blog', plain: true },
];

export const Header: React.FC = () => {
  const tr = useTr();

  const { cartCount, cartTotal, comparedProducts, setIsCartDrawerOpen } = useShop();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top USP strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">{tr("✓ Nieuwe e-bikes van A-merken")}</span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline">{tr("100% Rijklaar thuisbezorgd")}</span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline">{tr("Bankoverschrijving & Crypto (BTC/USDT/ETH, -10%)")}</span>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <span className="text-slate-400">·</span>
            <span className="font-semibold text-white">{tr("Trustpilot ★★★★★ 4.8")}</span>
            <span className="text-slate-400">·</span>
            <span>{tr("Klantenservice:")} <a href={`mailto:${REPLY.channels.email}`} className="whitespace-nowrap hover:text-white underline-offset-2 hover:underline">{REPLY.channels.email}</a></span>
          </div>
        </div>
      </div>

      {/* One bar: logo, navigation and cart. The navigation wraps onto its own scrollable row below the bar on small screens. */}
      <div className="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-8 px-4 sm:px-6 lg:px-8">
        <Link prefetch={false} to="/" className="h-18 flex items-center text-xl sm:text-2xl shrink-0 hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        <nav
          aria-label={tr("Hoofdmenu")}
          className="order-last basis-full -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto flex items-center justify-between gap-4 text-xs font-medium text-slate-700 lg:order-none lg:basis-auto lg:mx-0 lg:p-0 lg:border-0 lg:bg-transparent lg:overflow-visible lg:justify-start lg:gap-6 lg:text-sm"
        >
          {NAV.map(({ to, label, plain }) => (
            plain ? (
              <NextLink prefetch={false} key={to} href={to} className={`${NAV_LINK} ${isActive(to) ? ACTIVE : ''}`}>
                {tr(label)}
              </NextLink>
            ) : (
              <Link prefetch={false} key={to} to={to} className={`${NAV_LINK} ${isActive(to === '/categorie/elektrische-fietsen' ? '/categorie' : to) ? ACTIVE : ''}`}>
                {tr(label)}
              </Link>
            )
          ))}
          <Link
            prefetch={false}
            to="/keuzehulp"
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors text-blue-600 font-semibold lg:font-medium ${isActive('/keuzehulp') ? 'lg:font-semibold' : 'lg:text-slate-700 lg:hover:text-blue-600'}`}
          >
            <Compass className="hidden lg:block w-4 h-4 text-blue-600" />
            <span>{tr("Keuzehulp")}</span>
          </Link>
        </nav>

        <div className="h-18 flex items-center gap-3 shrink-0">
          {comparedProducts.length > 0 && (
            <Link prefetch={false}
              to="/vergelijken"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              <Scale className="w-4 h-4 text-blue-600" />
              <span>{tr("Vergelijk (")}{tr(comparedProducts.length)})</span>
            </Link>
          )}

          <Link prefetch={false}
            to="/winkelwagen"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm hover:shadow active:scale-[0.99]"
            aria-label={tr("Winkelwagen openen")}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-full flex items-center justify-center">
                  {tr(cartCount)}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">
              {cartCount === 0 ? tr("Winkelwagen") : formatEur(cartTotal)}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
