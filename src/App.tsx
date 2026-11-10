import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { BrandPage } from './pages/BrandPage';
import { LandingPage } from './pages/LandingPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { KeuzehulpPage } from './pages/KeuzehulpPage';
import { ComparePage } from './pages/ComparePage';
import { TaxonomyPage } from './pages/TaxonomyPage';
import { CreditCard, Building, Coins, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white">
          {/* Header navigation bar */}
          <Header />

          {/* Slide-over quick cart drawer */}
          <CartDrawer />

          {/* Multi-Page Routes */}
          <main className="flex-1">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Product Detail Pages */}
              <Route path="/product/:slug" element={<ProductDetailPage />} />

              {/* Category & Subcategory Pages */}
              <Route path="/categorie/:categorySlug" element={<CategoryPage />} />

              {/* 24 Brand Pages (native WooCommerce Brands) */}
              <Route path="/merk/:brandSlug" element={<BrandPage />} />

              {/* Curated SEO Landingspagina's */}
              <Route path="/bosch-middenmotor" element={<LandingPage customSlug="bosch-middenmotor" />} />
              <Route path="/elektrische-damesfiets" element={<LandingPage customSlug="elektrische-damesfiets" />} />
              <Route path="/e-bike-onder-2000" element={<LandingPage customSlug="e-bike-onder-2000" />} />
              <Route path="/fietsplan-e-bikes" element={<LandingPage customSlug="fietsplan-e-bikes" />} />
              <Route path="/speed-pedelecs" element={<LandingPage customSlug="speed-pedelecs" />} />

              {/* Cart & Checkout */}
              <Route path="/winkelwagen" element={<CartPage />} />
              <Route path="/afrekenen" element={<CheckoutPage />} />
              <Route path="/bestelling-bevestigd/:orderId" element={<OrderConfirmationPage />} />

              {/* E-Bike Keuzehulp Quiz */}
              <Route path="/keuzehulp" element={<KeuzehulpPage />} />

              {/* E-Bike Compare Tool */}
              <Route path="/vergelijken" element={<ComparePage />} />

              {/* WooCommerce Taxonomy & Architecture Page */}
              <Route path="/taxonomie" element={<TaxonomyPage />} />

              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Global Dutch E-Commerce Footer */}
          <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Col 1: About E-BIKE-TEKOOP.NL */}
                <div className="space-y-3">
                  <Link
                    to="/"
                    className="text-base font-black text-white font-display block"
                  >
                    E-BIKE-TEKOOP<span className="text-blue-500">.NL</span>
                  </Link>
                  <p className="leading-relaxed text-slate-400 text-xs">
                    De grootste online e-bike speciaalzaak van Nederland. Uitsluitend nieuwe elektrische
                    fietsen van toonaangevende A-merken via officiële distributiekanalen.
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-white font-semibold">
                    <span className="text-[#00b67a]">★ Trustpilot</span>
                    <span>Score 4.8 / 5 (1.428 reviews)</span>
                  </div>
                </div>

                {/* Col 2: Landingspagina's & SEO Links */}
                <div className="space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-xs">
                    SEO Landingspagina's
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/bosch-middenmotor" className="hover:text-white transition-colors">
                        Bosch Middenmotor E-bikes
                      </Link>
                    </li>
                    <li>
                      <Link to="/elektrische-damesfiets" className="hover:text-white transition-colors">
                        Elektrische Damesfietsen (Lage instap)
                      </Link>
                    </li>
                    <li>
                      <Link to="/e-bike-onder-2000" className="hover:text-white transition-colors">
                        E-bike onder €2.000
                      </Link>
                    </li>
                    <li>
                      <Link to="/fietsplan-e-bikes" className="hover:text-white transition-colors">
                        Fietsplan & WKR Leasen
                      </Link>
                    </li>
                    <li>
                      <Link to="/speed-pedelecs" className="hover:text-white transition-colors">
                        Speed Pedelecs (45 km/u)
                      </Link>
                    </li>
                    <li>
                      <Link to="/keuzehulp" className="text-blue-400 hover:text-blue-300 font-semibold">
                        Online E-Bike Keuzehulp
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Categorieën & Merken */}
                <div className="space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-xs">
                    Categorieën & Merken
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/categorie/elektrische-fietsen" className="hover:text-white transition-colors">
                        Elektrische Fietsen
                      </Link>
                    </li>
                    <li>
                      <Link to="/categorie/accus-en-opladers" className="hover:text-white transition-colors">
                        Accu's & Opladers
                      </Link>
                    </li>
                    <li>
                      <Link to="/categorie/accessoires" className="hover:text-white transition-colors">
                        Accessoires & Sloten
                      </Link>
                    </li>
                    <li>
                      <Link to="/merk/gazelle" className="hover:text-white transition-colors">
                        Gazelle E-Bikes
                      </Link>
                    </li>
                    <li>
                      <Link to="/merk/cube" className="hover:text-white transition-colors">
                        Cube E-Bikes
                      </Link>
                    </li>
                    <li>
                      <Link to="/merk/stromer" className="hover:text-white transition-colors">
                        Stromer Speed Pedelecs
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Bedrijfsgegevens & Betaling */}
                <div className="space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-xs">
                    Betaling & Vestiging
                  </div>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-pink-500" />
                      <span>iDEAL (Direct via internetbankieren)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      <span>SEPA Bankoverschrijving</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Crypto (BTC / ETH / USDT)</span>
                    </li>
                    <li className="pt-2 text-[11px] text-slate-500">
                      Telefoon: 085 - 200 78 90 (Ma - Za)
                    </li>
                    <li className="text-[11px] text-slate-500">
                      KvK: 84920194 | BTW: NL863492810B01
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px]">
                <div>
                  © {new Date().getFullYear()} E-BIKE-TEKOOP.NL. Alle prijzen inclusief 21% BTW.
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/taxonomie" className="text-slate-400 hover:text-white underline">
                    Taxonomie & Architectuur
                  </Link>
                  <span>·</span>
                  <Link to="/vergelijken" className="hover:text-white">
                    Vergelijk E-bikes
                  </Link>
                  <span>·</span>
                  <Link to="/winkelwagen" className="hover:text-white">
                    Winkelwagen
                  </Link>
                  <span>·</span>
                  <span>EN 15194 & CE Gecertificeerd</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}
