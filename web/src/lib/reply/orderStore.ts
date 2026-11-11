import { REPLY } from '@/config/reply';
import { getRedis, isStoreConfigured } from './redis';
import type { StoredOrder, StoredPaymentDetails } from './types';

// One hash per type, namespaced by the order prefix so several sites can share one database.
const KEY = `${REPLY.orderPrefix.toLowerCase()}:orders`;

export const isOrderStoreConfigured = isStoreConfigured;

const parse = (v: unknown): StoredOrder => (typeof v === 'string' ? JSON.parse(v) : (v as StoredOrder));

export async function saveOrder(order: StoredOrder): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.hset(KEY, { [order.orderNumber]: JSON.stringify(order) });
  return true;
}

export async function listOrders(): Promise<StoredOrder[]> {
  const redis = getRedis();
  if (!redis) return [];
  const all = await redis.hgetall<Record<string, unknown>>(KEY);
  if (!all) return [];
  return Object.values(all)
    .map(parse)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrder(orderNumber: string): Promise<StoredOrder | null> {
  const redis = getRedis();
  if (!redis) return null;
  const raw = await redis.hget<unknown>(KEY, orderNumber);
  return raw ? parse(raw) : null;
}

export async function markOrderSent(orderNumber: string, paymentDetails: StoredPaymentDetails) {
  const order = await getOrder(orderNumber);
  if (!order) return;
  order.status = order.status === 'payment-confirmed' ? 'payment-confirmed' : 'payment-sent';
  order.paymentDetails = paymentDetails;
  await saveOrder(order);
}

export async function markPaymentConfirmed(orderNumber: string, note?: string) {
  const order = await getOrder(orderNumber);
  if (!order) return;
  order.status = 'payment-confirmed';
  order.paymentConfirmedAt = new Date().toISOString();
  if (note) order.paymentNote = note;
  await saveOrder(order);
}

export async function deleteOrder(orderNumber: string) {
  const redis = getRedis();
  if (!redis) return;
  await redis.hdel(KEY, orderNumber);
}
