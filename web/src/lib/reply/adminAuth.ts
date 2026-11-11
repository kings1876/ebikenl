import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (s: string) => createHash('sha256').update(s).digest();

/** Call as the first line of every admin route. Returns a Response to send back, or null when the passcode is valid. */
export function checkAdminPasscode(request: Request): Response | null {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return Response.json({ ok: false, error: 'admin-not-configured' }, { status: 503 });
  const given = request.headers.get('x-admin-passcode') ?? '';
  if (!timingSafeEqual(digest(given), digest(expected))) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  return null;
}
