import { checkAdminPasscode } from '@/lib/reply/adminAuth';
import { deleteEnquiry, getEnquiry } from '@/lib/reply/enquiryStore';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const enquiry = await getEnquiry(decodeURIComponent((await params).id));
  if (!enquiry) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });
  return Response.json({ ok: true, enquiry }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  await deleteEnquiry(decodeURIComponent((await params).id));
  return Response.json({ ok: true });
}
