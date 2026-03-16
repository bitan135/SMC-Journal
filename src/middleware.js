import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|auth|api|forgot-password|reset-password|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
