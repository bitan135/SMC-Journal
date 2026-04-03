export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/features',
  '/pricing',
  '/privacy',
  '/terms',
  '/forgot-password',
  '/reset-password',
  '/insight-engine',
  '/auth/callback',
  '/founding-member'
];

export const PROTECTED_PATHS = [
  '/dashboard',
  '/trades',
  '/add-trade',
  '/analytics',
  '/strategies',
  '/billing',
  '/settings',
  '/donation',
  '/checkout/founding-member'
];

export function isPublicRoute(pathname) {
  if (pathname === '/') return true;
  if (pathname.startsWith('/affiliate')) return true;
  return PUBLIC_ROUTES.includes(pathname);
}

export function isProtectedRoute(pathname) {
  return PROTECTED_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
}
