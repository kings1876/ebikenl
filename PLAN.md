# E-BIKE-TEKOOP.NL: project plan

New e-bikes from established brands via a distributor. Dutch site. Payment: iDEAL (recommended), bank transfer, crypto.

## Architecture (decided 2026-11-10)
- **Backend:** WordPress + WooCommerce = source of truth (products, stock, orders, payments, invoices). Taxonomy created by `setup-taxonomy.php`.
- **Frontend:** Next.js (App Router, server-rendered/ISR) in `web/`. Reads WooCommerce via REST/Store API. SSR/ISR is what keeps SEO strong; the old Vite SPA could not.
- **Checkout:** Next.js creates the order in WooCommerce; payment happens on the gateway's hosted page (Mollie iDEAL, crypto gateway) or shows bank-transfer instructions. No card/crypto secrets ever touch our frontend.
- **Legacy:** the original Vite/React prototype stays at the repo root as the design and UX reference until ported, then is archived.

## Audit of the prototype (src/)
- Its taxonomy already matches our design 1:1: 5 categories (22 subs), 24 brands, 16 attributes, 13 tags, product fields (EAN, SKU, warranty, EN 15194, speed pedelec, shipping).
- Slugs differ slightly from our script; script was aligned (`accucapaciteit`, `max-snelheid`).
- **Filter UI gaps:** the sidebar only exposes categorie, merk, prijs, doelgroep, motor, accu, aandrijving/versnelling, framemaat, tags. Missing: actieradius, remtype, wielmaat, gewicht, kleur, snelheid, leverbaarheid, opvouwbaar, max. gebruikersgewicht.
- Product data is sample data in `src/data/ebikes.ts` (to be replaced by the distributor feed).
- Worth porting: keuzehulp, compare, brand/landing pages, taxonomy explorer, trust elements.
- **Reviews** (`TrustpilotReview`, `SITE_TRUSTPILOT_REVIEWS`, `TrustpilotWidget`, per-product reviews) are legitimate: **do not edit, remove or regenerate.** Port verbatim only.

## Roadmap
1. [x] Audit prototype vs taxonomy
2. [x] Scaffold Next.js in `web/` (Dutch, nl-NL, typed WooCommerce client in `web/src/lib/woocommerce.ts`; builds clean)
3. [ ] Stand up WordPress/WooCommerce staging, run `wp eval-file setup-taxonomy.php`
4. [ ] Import distributor feed into WooCommerce (needs feed format)
5. [ ] Pages: home, category, brand, product, landing, keuzehulp, compare
6. [ ] Checkout + payments (bank transfer, crypto gateway, iDEAL)
7. [ ] SEO (metadata, schema.org Product, sitemap, noindex on filters), Dutch legal pages, launch

## Open inputs needed from owner
- Hosting for WordPress and for Next.js (e.g. Vercel)
- Distributor feed (CSV/API) and brand list actually carried
- Crypto provider choice; company details for invoices (KvK, BTW-nr, IBAN)
