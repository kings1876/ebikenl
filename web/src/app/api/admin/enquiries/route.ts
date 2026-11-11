import { checkAdminPasscode } from '@/lib/reply/adminAuth';
import { isStoreConfigured } from '@/lib/reply/redis';
import { listEnquiries } from '@/lib/reply/enquiryStore';

export async function GET(request: Request) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const configured = isStoreConfigured();
  return Response.json({ ok: true, configured, enquiries: configured ? await listEnquiries() : [] }, { headers: { 'Cache-Control': 'no-store' } });
}
