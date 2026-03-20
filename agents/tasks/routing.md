# 🛣️ Routing Task Protocol

## 🗺️ Route Separation
- **Public Routes**: `/`, `/login`, `/affiliate`, `/signup`, `/forgot-password`.
- **Protected Paths**: `/dashboard`, `/app/*`, `/settings`, `/trades`.

## 🚦 Guard Logic
- **No Flicker**: Use the `AuthProvider` gate to prevent unauthenticated UI flashes.
- **Strict Redirects**: Authenticated users must NEVER be able to see the `/login` or `/` landing page if a session exists.
- **Next Parameter**: Always preserve the `?next=` parameter to return users to their intended destination after login.

## 🏠 Canonical Identity
- All production traffic must be forced to `https://www.smcjournal.app`.
- Middleware must handle the apex-to-www transition before auth state is even checked.
