// Machine-readable site description (llms.txt, auth.md, .well-known/*). Built from the real catalogue at build time.
// Only what the site really offers is declared: it is a catalogue and comparison site; agents cannot place orders.
import { PRODUCTS, BRANDS_WITH_PRODUCTS, ACTIVE_TAXONOMY_CATEGORIES } from '@/data/catalog';
import { SITE_URL, SITE_NAME, brandSlug, LANDING_SLUGS } from '@/lib/seo';
import { SUB_COPY, subSlug } from '@/lib/seoCopy';
import { SEO_LANDING_PAGES } from '@/data/ebikes';

const abs = (p: string) => `${SITE_URL}${p}`;
const eur = (n: number) => `€${n.toLocaleString('nl-NL')}`;
const prices = PRODUCTS.map((p) => p.price);
const range = `${eur(Math.min(...prices))} - ${eur(Math.max(...prices))}`;

export function llmsTxt(): string {
  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`, '');
  lines.push(`> Dutch-language website for comparing new electric bikes: ${PRODUCTS.length} models with specifications and list prices, from brands such as ${BRANDS_WITH_PRODUCTS.slice(0, 6).join(', ')}. An English version is available under /en.`, '');
  lines.push('Prices are manufacturer list prices in euro including VAT. For some brands the price is an indicative conversion from the Swiss list price; the product page says so. This site is a catalogue: orders cannot be placed through this file or by automated agents.', '');

  lines.push('## Catalogue', '');
  lines.push(`- [Elektrische fietsen](${abs('/categorie/elektrische-fietsen')}): all ${PRODUCTS.length} models, ${range}`);
  for (const cat of ACTIVE_TAXONOMY_CATEGORIES) {
    for (const sub of cat.subs.filter((s) => SUB_COPY[s])) {
      const n = PRODUCTS.filter((p) => p.subCategory === sub).length;
      lines.push(`- [${SUB_COPY[sub]!.h1}](${abs(`/categorie/elektrische-fietsen/${subSlug(sub)}`)}): ${n} ${n === 1 ? 'model' : 'models'}`);
    }
  }
  lines.push('');

  lines.push('## Brands', '');
  for (const b of BRANDS_WITH_PRODUCTS) {
    const n = PRODUCTS.filter((p) => p.brand === b).length;
    lines.push(`- [${b}](${abs(`/merk/${brandSlug(b)}`)}): ${n} ${n === 1 ? 'model' : 'models'}`);
  }
  lines.push('');

  lines.push('## Guides', '');
  for (const slug of LANDING_SLUGS) {
    const l = SEO_LANDING_PAGES.find((x) => x.slug === slug);
    if (l) lines.push(`- [${l.h1}](${abs(`/${slug}`)}): ${l.subtitle}`);
  }
  lines.push(`- [E-bike keuzehulp](${abs('/keuzehulp')}): a short questionnaire that suggests a model`);
  lines.push('');

  lines.push('## Optional', '');
  lines.push(`- [Sitemap](${abs('/sitemap.xml')}): every page, with product images`);
  lines.push(`- [Auth.md](${abs('/auth.md')}): no authentication is needed to read this site`);
  lines.push(`- [API catalog](${abs('/.well-known/api-catalog')}): machine-readable list of the resources above`);
  return lines.join('\n') + '\n';
}

export function authMd(): string {
  return `# Auth.md

${SITE_NAME} is a public catalogue. Reading it needs no account, key or token.

## Agent registration

None required. Agents may read every page listed in [llms.txt](${abs('/llms.txt')}) and in the [sitemap](${abs('/sitemap.xml')}).

\`\`\`json
${JSON.stringify(
  { agent_auth: { register_uri: null, identity_types_supported: ['none'], credential_types_supported: ['none'], notes: 'No authentication required. All resources are public and read-only.' } },
  null,
  2,
)}
\`\`\`

## Ordering

Orders cannot be placed through automated agents. Send people to the product page of the model they want.
`;
}

export function apiCatalog() {
  return {
    linkset: [
      { anchor: abs('/'), 'https://www.iana.org/assignments/link-relations/service-doc': [{ href: abs('/llms.txt') }], title: `${SITE_NAME}: compare new electric bikes` },
      { anchor: abs('/categorie/elektrische-fietsen'), type: 'text/html', title: 'Electric bike catalogue' },
      { anchor: abs('/sitemap.xml'), type: 'application/xml', title: 'Sitemap' },
    ],
  };
}

export const oauthProtectedResource = () => ({
  resource: SITE_URL,
  resource_name: `${SITE_NAME} public catalogue`,
  authorization_servers: [],
  scopes_supported: [],
  bearer_methods_supported: [],
  resource_documentation: abs('/auth.md'),
  note: 'All resources are public. No OAuth tokens are required.',
});

export const oauthAuthorizationServer = () => ({
  issuer: SITE_URL,
  authorization_endpoint: null,
  token_endpoint: null,
  jwks_uri: null,
  grant_types_supported: [],
  response_types_supported: [],
  scopes_supported: [],
  note: `${SITE_NAME} has no protected APIs.`,
  public_resources: [abs('/llms.txt'), abs('/sitemap.xml'), abs('/categorie/elektrische-fietsen')],
  agent_auth: { register_uri: null, identity_types_supported: ['none'], credential_types_supported: ['none'], notes: 'No registration required.' },
});

export const openidConfiguration = () => ({
  issuer: SITE_URL,
  note: `${SITE_NAME} does not operate an OpenID Connect provider.`,
  public_site: true,
  authorization_endpoint: null,
  token_endpoint: null,
  userinfo_endpoint: null,
  jwks_uri: null,
  scopes_supported: [],
  response_types_supported: [],
  grant_types_supported: [],
  subject_types_supported: [],
  id_token_signing_alg_values_supported: [],
});
