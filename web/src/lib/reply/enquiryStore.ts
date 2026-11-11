import { REPLY } from '@/config/reply';
import { getRedis } from './redis';
import type { StoredEnquiry } from './types';

const KEY = `${REPLY.orderPrefix.toLowerCase()}:enquiries`;

const parse = (v: unknown): StoredEnquiry => (typeof v === 'string' ? JSON.parse(v) : (v as StoredEnquiry));

export function generateEnquiryId(): string {
  return `ENQ-${(Date.now().toString(36) + Math.random().toString(36).slice(2, 6)).toUpperCase()}`;
}

export async function saveEnquiry(enquiry: StoredEnquiry): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.hset(KEY, { [enquiry.id]: JSON.stringify(enquiry) });
  return true;
}

export async function listEnquiries(): Promise<StoredEnquiry[]> {
  const redis = getRedis();
  if (!redis) return [];
  const all = await redis.hgetall<Record<string, unknown>>(KEY);
  if (!all) return [];
  return Object.values(all)
    .map(parse)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getEnquiry(id: string): Promise<StoredEnquiry | null> {
  const redis = getRedis();
  if (!redis) return null;
  const raw = await redis.hget<unknown>(KEY, id);
  return raw ? parse(raw) : null;
}

export async function markEnquiryReplied(id: string) {
  const enquiry = await getEnquiry(id);
  if (!enquiry) return;
  enquiry.status = 'replied';
  enquiry.repliedAt = new Date().toISOString();
  await saveEnquiry(enquiry);
}

export async function deleteEnquiry(id: string) {
  const redis = getRedis();
  if (!redis) return;
  await redis.hdel(KEY, id);
}
