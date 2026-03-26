# SOP: Authentication System

## 1. Purpose
Handles user identity, session management, and route protection for SMC Journal. Uses Supabase Auth with PKCE flow, cookie-based session persistence, and Next.js middleware for server-side guards.

## 2. Owner
- `src/utils/supabase/client.js` — Browser client
- `src/utils/supabase/server.js` — Server client (API routes, Server Components)
- `src/utils/supabase/middleware.js` — Middleware session refresh
- `src/components/AuthProvider.js` — Client-side auth state
- `src/app/auth/callback/route.js` — OAuth code exchange
- `src/app/api/auth/logout/route.js` — Server-side session termination

## 3. Dependencies
- **Supabase Auth** (hosted auth service)
- **PKCE flow** (`flowType: 'pkce'`)
- **Session storage key:** `sb-smc-auth-v5`
- **Cookie domain (production):** `.smcjournal.app`

## 4. Inputs
- **Signup:** Email + password, or OAuth (Google)
- **Login:** Email + password, or OAuth redirect
- **Logout:** Client calls `/api/auth/logout`
- **Session refresh:** Automatic via middleware on every request

## 5. Outputs
- Authenticated session stored in HTTP cookies
- `AuthProvider` exposes: `user`, `session`, `profile`, `subscription`, `isLoading`, `signOut`
- Middleware redirects: unauthenticated→`/login`, authenticated on login page→`/dashboard`

## 6. Flow (Step-by-step)

### Signup/Login (OAuth)
1. User clicks "Sign in with Google" on `/login`
2. Supabase redirects to Google OAuth consent screen
3. Google redirects back with `?code=...`
4. **Middleware** intercepts the `code` param on any route → redirects to `/auth/callback`
5. `/auth/callback` exchanges code for session via `supabase.auth.exchangeCodeForSession(code)`
6. Session cookies set on response (domain: `.smcjournal.app`, SameSite: Lax)
7. If user has a `smc_referral_code` cookie → affiliate referral logic runs (links user to affiliate, creates referral record)
8. Redirect to `/dashboard`

### Signup/Login (Email + Password)
1. `supabase.auth.signUp()` or `supabase.auth.signInWithPassword()` called from client
2. Supabase returns session directly (no code exchange needed for password auth)
3. Client `AuthProvider` detects `SIGNED_IN` event, fetches profile + subscription

### Every Page Load (Middleware)
1. `middleware.js` imports `updateSession` from `src/utils/supabase/middleware.js`
2. Creates Supabase server client with cookie access
3. Calls `supabase.auth.getUser()` to validate session
4. **If no user + protected route:** Redirect to `/login?next={path}`
5. **If user + login/signup/landing page:** Redirect to `/dashboard`
6. Syncs all Supabase cookies on response

### Client-Side State (AuthProvider)
1. On mount: `supabase.auth.getSession()` → set user + session
2. `setIsLoading(false)` immediately after session check (optimistic rendering)
3. Background fetch: `profiles` + `subscriptions` tables
4. Listen for `onAuthStateChange` events (SIGNED_IN, SIGNED_OUT, USER_UPDATED)

### Logout
1. Client calls `supabase.auth.signOut()`
2. Redirects to `/api/auth/logout` (server-side)
3. Server clears all Supabase cookies
4. Redirect to `/login`

## 7. Failure Modes
| Failure | Cause | Symptom |
|---|---|---|
| Infinite redirect loop | Cookie domain mismatch (www vs apex) | Browser shows ERR_TOO_MANY_REDIRECTS |
| Session not persisting | `storageKey` mismatch between client/server/middleware | User logged out on page reload |
| OAuth callback crash | Missing `code` param or expired code | Redirect to `/login?error=auth_callback_failed` |
| Profile/subscription null | `handle_new_user` trigger failed | App renders with free plan defaults |
| CORS cookie rejection | `Secure` flag set on localhost | Login works in prod but not dev |

## 8. Debugging Guide
1. **User can't stay logged in:**
   - Check `storageKey` is `sb-smc-auth-v5` in ALL THREE files (client.js, server.js, middleware.js)
   - Check cookie domain: `.smcjournal.app` in prod, `undefined` in dev
   - Check browser DevTools → Application → Cookies for `sb-smc-auth-v5` key
2. **OAuth not working:**
   - Check Supabase Dashboard → Auth → Providers → Google is enabled
   - Check redirect URL is `https://smcjournal.app/auth/callback`
   - Check Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Middleware redirect loop:**
   - Check `isPublicRoute()` and `isProtectedRoute()` in `src/lib/routes.js`
   - Ensure the landing page (`/`) is in PUBLIC_ROUTES
   - Check for `?logout=true` handling (prevents redirect on landing after logout)

## 9. Logs & Observability
- **Supabase Dashboard → Auth → Logs** for OAuth errors
- **Vercel Logs** for middleware and callback route errors
- **Browser console** for `[AuthProvider]` prefixed messages
- **`[Auth Callback]`** log prefix in server logs

## 10. Recovery Procedure
- **User stuck on free plan after payment:** Check `subscriptions` table, manually upsert
- **Session corruption:** Clear all cookies starting with `sb-` in browser DevTools
- **OAuth redirect broken:** Verify the callback URL in Supabase Auth settings matches `/auth/callback`

## 11. Edge Cases
- User signs up via OAuth → `handle_new_user` trigger creates profile. If user already exists (re-auth), trigger doesn't fire (ON INSERT only)
- Affiliate referral cookie checked during OAuth callback — if user already has `referred_by`, no duplicate attribution
- `isLoading` is set to `false` before profile/subscription fetch completes (optimistic rendering)

## 12. Security Considerations
- PKCE flow prevents authorization code interception
- Service role key NEVER exposed to client — only in API routes and middleware
- Affiliate JWT uses separate secret (`AFFILIATE_JWT_SECRET`) — not related to Supabase auth
- Rate limiting not applied to auth endpoints (handled by Supabase)
- `Secure` cookie flag disabled on localhost to allow local development

## 13. Version
Last Updated: 2026-03-26
