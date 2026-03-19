import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (Supabase auth callback)
     * - forgot-password
     * - reset-password
     * - billing/checkout (payments)
     * - .png, .jpg, .jpeg, .gif, .svg (images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|forgot-password|reset-password|billing/checkout|features|pricing|privacy|terms|affiliate|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)(?!$).*)',
  ],
};
