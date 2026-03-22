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
  '/auth/callback'
];

export const PROTECTED_PATHS = [
  '/dashboard',
  '/trades',
  '/add-trade',
  '/analytics',
  '/strategies',
  '/billing',
  '/settings',
  '/donation'
];

export function isPublicRoute(pathname) {
  if (pathname === '/') return true;
  if (pathname.startsWith('/affiliate')) return true;
  return PUBLIC_ROUTES.includes(pathname);
}

export function isProtectedRoute(pathname) {
  return PROTECTED_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
}
