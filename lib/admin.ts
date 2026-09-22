export const ADMIN_EMAILS = [
  'dennissabu444@gmail.com',
];

export function isAdmin(
  user: {
    email?: string | null;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
  } | null | undefined
): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  if (ADMIN_EMAILS.map((e) => e.toLowerCase().trim()).includes(email)) return true;
  if (user.app_metadata?.role === 'admin') return true;
  if (user.user_metadata?.is_admin === true) return true;
  return false;
}
