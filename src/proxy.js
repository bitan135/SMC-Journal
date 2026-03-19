import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/trades/:path*',
    '/add-trade/:path*',
    '/analytics/:path*',
    '/strategies/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/donation/:path*',
  ],
};
