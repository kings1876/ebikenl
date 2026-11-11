import { checkAdminPasscode } from '@/lib/reply/adminAuth';
import { getEnquiry, markEnquiryReplied } from '@/lib/reply/enquiryStore';
import { sendMail } from '@/lib/reply/mailer';
import { enquiryReplyEmail } from '@/lib/reply/emailTemplates';

export async function POST(request: Request) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = String(body.id ?? '');
  const reply = String(body.reply ?? '').trim().slice(0, 8000);
  if (!id || reply.length < 2) return Response.json({ ok: false, error: 'invalid' }, { status: 400 });

  const enquiry = await getEnquiry(id);
  if (!enquiry) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });

  const result = await sendMail(enquiryReplyEmail(enquiry, reply));
  if (!result.sent) return Response.json({ ok: false, error: 'mail-not-configured-or-failed' }, { status: 503 });

  await markEnquiryReplied(id);
  return Response.json({ ok: true });
}
