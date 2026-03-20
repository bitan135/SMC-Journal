# 🔑 Authentication Task Protocol

## 🏗️ Auth Architecture
- **Global Provider**: All auth state MUST live in `AuthProvider.js`.
- **Loading Gate**: No children should render until `isLoading` is definitively resolved.
- **Synchronized Logout**: `signOut` must clear both Supabase session and server-side cookies.

## 🛡️ OAuth Implementation
- **PKCE Flow**: Detect `?code=` on any landing route.
- **Manual Exchange**: Always call `exchangeCodeForSession` if a code is present.
- **URL Cleanup**: Clean query parameters immediately after a successful session exchange.

## 🛂 Route Protection
- **Middleware First**: Server-side guards are the primary defense.
- **Provider Fallback**: Client-side guards must immediately push to `/dashboard` if a session is detected on a public route.
