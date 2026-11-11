import type { NextConfig } from "next";

// Sub-category slugs that used to be a ?sub=… filter on the category page. Kept as permanent redirects so old links keep working.
const OLD_SUB_REDIRECTS: Record<string, string> = {
  Stadsfietsen: '/categorie/elektrische-fietsen/stadsfietsen',
  Trekkingfietsen: '/categorie/elektrische-fietsen/trekkingfietsen',
  'Elektrische mountainbikes': '/categorie/elektrische-fietsen/elektrische-mountainbikes',
  'Gravel & racefietsen': '/categorie/elektrische-fietsen/gravel-en-racefietsen',
  Vouwfietsen: '/categorie/elektrische-fietsen/vouwfietsen',
  Bakfietsen: '/categorie/elektrische-fietsen/bakfietsen',
  'Speed pedelecs': '/speed-pedelecs',
  'Kinder- & jongerenfietsen': '/categorie/elektrische-fietsen/kinder-en-jongerenfietsen',
};

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return ['', '/en'].flatMap((prefix) =>
      Object.entries(OLD_SUB_REDIRECTS).map(([sub, destination]) => ({
        source: `${prefix}/categorie/elektrische-fietsen`,
        has: [{ type: 'query' as const, key: 'sub', value: sub }],
        destination: `${prefix}${destination}`,
        permanent: true,
      })),
    );
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          // points agents at the machine-readable site description (RFC 8288 / RFC 9727)
          { key: 'Link', value: '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="describedby"' },
          // Narrow CSP: blocks plugins, base-tag and form hijacking and framing by other sites, without restricting scripts or images.
          { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
