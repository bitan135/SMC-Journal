# SOP: Frontend Rendering

## 1. Purpose
Documents the Next.js 16 rendering strategy, component architecture, and performance optimizations used in SMC Journal.

## 2. Owner
- `src/app/layout.js` — Root layout (ThemeProvider, AuthProvider, PostHogProvider)
- `src/components/LayoutWrapper.jsx` — Sidebar + content shell
- `src/components/Sidebar.jsx` — Navigation (desktop sidebar + mobile bottom nav)

## 3. Rendering Strategy

### Server Components (Default)
All `page.js` files export metadata and render Server Components by default.
- SEO pages: `/`, `/pricing`, `/features`, `/insight-engine`, `/privacy`, `/terms`
- These are statically prerendered at build time (marked `○` in build output)

### Client Components (`'use client'`)
Interactive pages use Client Components:
- All dashboard pages, forms, billing, settings
- Wrapped in `AuthProvider` for session access

### Dynamic Routes (Server-Rendered)
API routes and auth callback are `ƒ` (dynamic):
- `/api/*` — All API endpoints
- `/auth/callback` — OAuth code exchange

## 4. Component Architecture
```
layout.js (Root)
  ├─→ ThemeProvider (system/light/dark theme)
  ├─→ AuthProvider (global auth state)
  ├─→ PostHogProvider (analytics)
  └─→ LayoutWrapper
        ├─→ Sidebar (desktop: left sidebar, mobile: bottom nav)
        └─→ {children} (page content)
```

### Lazy-Loaded Components
- **Recharts** (DashboardCharts, AnalyticsContent) — loaded via `next/dynamic` with SSR disabled
- This removes ~200KB from the initial bundle

### Key UI Components
| Component | File | Purpose |
|---|---|---|
| `Sidebar` | `Sidebar.jsx` | Navigation + plan badge |
| `TradeForm` | `TradeForm.jsx` | 555-line trade entry/edit form |
| `AnalyticsContent` | `AnalyticsContent.jsx` | All analytics visualizations |
| `DashboardCharts` | `DashboardCharts.jsx` | Dashboard equity curve + stats |
| `PlanGuard` | `PlanGuard.jsx` | Feature gating by subscription |
| `MetricCard` | `MetricCard.jsx` | Reusable KPI display card |
| `ChartCard` | `ChartCard.jsx` | Chart container with title |
| `ErrorBoundary` | `ErrorBoundary.jsx` | React error catch-all |

## 5. Design System
- **Theme:** 2026 Fintech Light Theme
- **Palette:** Slate-50/White background, Slate-900 typography, Indigo-600 accents
- **Radii:** 40px outer cards, 28px inner elements, 24px inputs
- **CSS Variables:** Defined in `globals.css` `:root`
- **Typography:** System font stack, font-black for headings, tracking-tight/tighter

## 6. Performance Optimizations
1. **Optimistic auth rendering:** `isLoading` set false before profile fetch completes
2. **Dynamic imports:** Recharts lazy-loaded on Dashboard and Analytics
3. **Trade list memoization:** `useMemo` on filtered/paginated trade arrays
4. **In-memory cache:** 5-minute TTL in storage.js prevents redundant Supabase requests

## 7. Version
Last Updated: 2026-03-26
