'use client';

import React from 'react';
import { Link, useLocation } from '@/lib/router';
import { ShoppingBag, Scale, Compass, Layers } from 'lucide-react';
import { formatEur } from '../utils/format';
import { useShop } from '../context/ShopContext';
import { useTr } from '@/i18n/locale';
import { REPLY } from '@/config/reply';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from './Logo';

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

      {/* Main Top Bar adhering strictly to Top Bar Contract */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-18">
        {/* Zone 1: Single text element Brand Zone */}
        <Link
          to="/"
          className="text-xl sm:text-2xl shrink-0 hover:opacity-90 transition-opacity"
        >
          <Logo />
        </Link>

        {/* Zone 2: 4-5 single-line clean nav links with real URLs */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link
            to="/categorie/elektrische-fietsen"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 ${
              isActive('/categorie') ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {tr("Elektrische Fietsen")}
          </Link>

          <Link
            to="/bosch-middenmotor"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 ${
              isActive('/bosch-middenmotor') ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {tr("Bosch Middenmotor")}
          </Link>

          <Link
            to="/fietsplan-e-bikes"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 ${
              isActive('/fietsplan-e-bikes') ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {tr("Fietsplan (WKR)")}
          </Link>

          <Link
            to="/keuzehulp"
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              isActive('/keuzehulp')
                ? 'text-blue-600 font-semibold'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>{tr("Keuzehulp")}</span>
          </Link>

          <Link
            to="/taxonomie"
            className={`flex items-center gap-1 whitespace-nowrap shrink-0 text-xs px-2 py-1 rounded border transition-colors ${
              isActive('/taxonomie')
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title={tr("Bekijk de complete WooCommerce taxonomie en SEO structuur")}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{tr("Taxonomie")}</span>
          </Link>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {comparedProducts.length > 0 && (
            <Link
              to="/vergelijken"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              <Scale className="w-4 h-4 text-blue-600" />
              <span>{tr("Vergelijk (")}{tr(comparedProducts.length)})</span>
            </Link>
          )}

          <Link
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

      {/* Mobile navigation row with distinct URLs */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto text-xs font-medium text-slate-700 gap-4">
        <Link
          to="/categorie/elektrische-fietsen"
          className={`whitespace-nowrap hover:text-blue-600 ${
            isActive('/categorie') ? 'text-blue-600 font-semibold' : ''
          }`}
        >
          {tr("Elektrische Fietsen")}
        </Link>
        <Link
          to="/bosch-middenmotor"
          className={`whitespace-nowrap hover:text-blue-600 ${
            isActive('/bosch-middenmotor') ? 'text-blue-600 font-semibold' : ''
          }`}
        >
          {tr("Bosch Middenmotor")}
        </Link>
        <Link
          to="/fietsplan-e-bikes"
          className={`whitespace-nowrap hover:text-blue-600 ${
            isActive('/fietsplan-e-bikes') ? 'text-blue-600 font-semibold' : ''
          }`}
        >
          {tr("Fietsplan (WKR)")}
        </Link>
        <Link
          to="/keuzehulp"
          className={`whitespace-nowrap text-blue-600 font-semibold ${
            isActive('/keuzehulp') ? 'underline' : ''
          }`}
        >
          {tr("Keuzehulp")}
        </Link>
        <Link
          to="/taxonomie"
          className={`whitespace-nowrap text-slate-500 ${
            isActive('/taxonomie') ? 'font-bold text-slate-900' : ''
          }`}
        >
          {tr("Taxonomie")}
        </Link>
      </div>
    </header>
  );
};
