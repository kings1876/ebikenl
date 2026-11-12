'use client';

import React from 'react';
import NextLink from 'next/link';
import { Link } from '@/lib/router';
import { ShopProvider } from '@/context/ShopContext';
import { Header } from '@/components/Header';
import { StaticHtml } from '@/components/StaticHtml';
import { LazyCartDrawer } from '@/components/LazyCartDrawer';
import { Building, Coins } from '@/components/icons';
import { useTr } from '@/i18n/locale';
import { Logo } from './Logo';
import { brandSlug } from '@/lib/slug';
import { REPLY } from '@/config/reply';

export function SiteShell({ children, popularBrands = [] }: { children: React.ReactNode; popularBrands?: string[] }) {
  const tr = useTr();

  return (
    <ShopProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white">
          {/* Header navigation bar */}
          <Header />

          {/* Slide-over quick cart drawer */}
          <LazyCartDrawer />

          <main className="flex-1">{children}</main>

          {/* Global Dutch E-Commerce Footer */}
          <StaticHtml as="footer" className="below bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Col 1: About E-BIKE-TEKOOP.NL */}
                <div className="space-y-3">
                  <Link prefetch={false}
                    to="/"
                    className="text-lg block"
                  >
                    <Logo onDark />
                  </Link>
                  <p className="leading-relaxed text-slate-400 text-xs">
                    {tr("Online e-bike webwinkel met uitsluitend nieuwe elektrische fietsen van bekende merken. Modellen, specificaties en adviesprijzen overzichtelijk bij elkaar.")}
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-white font-semibold">
                    <span className="text-[#00b67a]">{tr("★ Trustpilot")}</span>
                    <span>{tr("Score 4.8 / 5 (1.428 reviews)")}</span>
                  </div>
                </div>

                {/* Col 2: Landingspagina's & SEO Links */}
                <div className="space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-xs">
                    {tr("SEO Landingspagina's")}
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link prefetch={false} to="/bosch-middenmotor" className="hover:text-white transition-colors">
                        {tr("Bosch Middenmotor E-bikes")}
                      </Link>
                    </li>
                    <li>
                      <Link prefetch={false} to="/elektrische-damesfiets" className="hover:text-white transition-colors">
                        {tr("Elektrische Damesfietsen (Lage instap)")}
                      </Link>
                    </li>
                    <li>
                      <Link prefetch={false} to="/e-bike-onder-2000" className="hover:text-white transition-colors">
                        {tr("E-bike onder €2.000")}
                      </Link>
                    </li>
                    <li>
                      <Link prefetch={false} to="/fietsplan-e-bikes" className="hover:text-white transition-colors">
                        {tr("Fietsplan & WKR Leasen")}
                      </Link>
                    </li>
                    <li>
                      <Link prefetch={false} to="/speed-pedelecs" className="hover:text-white transition-colors">
                        {tr("Speed Pedelecs (45 km/u)")}
                      </Link>
                    </li>
                    <li>
                      <Link prefetch={false} to="/keuzehulp" className="text-blue-400 hover:text-blue-300 font-semibold">
                        {tr("Online E-Bike Keuzehulp")}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Categorieën & Merken */}
                <div className="space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-xs">
                    {tr("Categorieën & Merken")}
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link prefetch={false} to="/categorie/elektrische-fietsen" className="hover:text-white transition-colors">
                        {tr("Elektrische Fietsen")}
                      </Link>
                    </li>
                    {popularBrands.map((brand) => (
                      <li key={brand}>
                        <Link prefetch={false} to={`/merk/${brandSlug(brand)}`} className="hover:text-white transition-colors">
                          {brand} {tr("E-Bikes")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 4: Bedrijfsgegevens & Betaling */}
                <div className="space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-xs">
                    {tr("Betaling & Vestiging")}
                  </div>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      <span>{tr("Bankoverschrijving")}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{tr("Crypto (BTC / USDT / ETH, -10%)")}</span>
                    </li>
                    <li className="pt-2 text-[11px] text-slate-400">
                      {tr("E-mail:")} <a href={`mailto:${REPLY.channels.email}`} className="hover:text-white underline">{REPLY.channels.email}</a>
                    </li>
                    <li className="text-[11px] text-slate-400">
                      {tr("KvK: 84920194 | BTW: NL863492810B01")}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px]">
                <div>
                  © {new Date().getFullYear()} {tr("E-BIKE-TEKOOP.NL. Alle prijzen inclusief 21% BTW.")}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Link prefetch={false} to="/vergelijken" className="hover:text-white">
                    {tr("Vergelijk E-bikes")}
                  </Link>
                  <span>·</span>
                  <NextLink prefetch={false} href="/blog" className="hover:text-white">
                    {tr("Blog")}
                  </NextLink>
                  <span>·</span>
                  <Link prefetch={false} to="/contact" className="hover:text-white">
                    {tr("Contact")}
                  </Link>
                  <span>·</span>
                  <Link prefetch={false} to="/winkelwagen" className="hover:text-white">
                    {tr("Winkelwagen")}
                  </Link>
                  <span>·</span>
                  <span>{tr("EN 15194 & CE Gecertificeerd")}</span>
                </div>
              </div>
            </div>
          </StaticHtml>
        </div>
    </ShopProvider>
  );
}
