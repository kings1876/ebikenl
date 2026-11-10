/**
 * Minimal typed client for the WooCommerce REST API (v3), server-side only.
 * Credentials come from env and must never reach the browser.
 */

const BASE = process.env.WC_API_URL; // e.g. https://shop.e-bike-tekoop.nl
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export interface WcTerm {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  description: string;
  short_description: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: { id: number; src: string; alt: string }[];
  categories: WcTerm[];
  tags: WcTerm[];
  brands?: WcTerm[];
  attributes: { id: number; name: string; slug: string; options: string[] }[];
}

type Query = Record<string, string | number | undefined>;

export async function wc<T>(
  path: string,
  query: Query = {},
  revalidate = 300,
): Promise<T> {
  if (!BASE || !KEY || !SECRET) {
    throw new Error("WooCommerce env vars (WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET) are not set");
  }
  const url = new URL(`/wp-json/wc/v3/${path}`, BASE);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64"),
    },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`WooCommerce ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

export const getProducts = (query: Query = {}) =>
  wc<WcProduct[]>("products", { per_page: 24, status: "publish", ...query });

export const getProductBySlug = async (slug: string) =>
  (await wc<WcProduct[]>("products", { slug }))[0];

export const getCategories = () =>
  wc<WcTerm[]>("products/categories", { per_page: 100, hide_empty: "true" });

export const getBrands = () =>
  wc<WcTerm[]>("products/brands", { per_page: 100, hide_empty: "true" });
