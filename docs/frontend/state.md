# SOP: Frontend State Management

## 1. Purpose
Documents how application state flows through the SMC Journal React application, covering auth state, trade data, subscriptions, and UI state.

## 2. Owner
- `src/components/AuthProvider.js` — Global auth + subscription state
- `src/lib/storage.js` — Unified data layer (trade CRUD, analytics helpers, caching)
- `src/lib/supabase.js` — Supabase client services (tradeService, strategyService)

## 3. State Architecture

### Global State (AuthProvider Context)
| State | Type | Source | Scope |
|---|---|---|---|
| `user` | Supabase User | `supabase.auth.getSession()` | Entire app |
| `session` | Session object | `supabase.auth.getSession()` | Entire app |
| `profile` | profiles row | `supabase.from('profiles')` | Entire app |
| `subscription` | subscriptions row | `supabase.from('subscriptions')` | Entire app |
| `isLoading` | boolean | Auth initialization | Gate rendering |

### Page-Level State (Local)
Each page manages its own data via `useState` + `useEffect`:
- **Dashboard:** Fetches trades via `storage.getTrades()`, passes to `DashboardCharts`
- **Trade Library:** Fetches trades, manages search/filter/pagination locally
- **Analytics:** Fetches trades, runs heavy analytics calculations client-side
- **Insights:** Fetches trades, runs AI-style pattern analysis client-side
- **Strategies:** Fetches strategies via `storage.getStrategies()`
- **Settings:** Reads/writes to `profiles` via `AuthProvider.updateProfile()`

### Data Layer (storage.js)
- **In-memory cache** with 5-minute TTL for trades and strategies
- Cache invalidated on any mutation (create, update, delete)
- All CRUD operations return `{ success, data, error }` envelope
- Pure math functions: `calculateRR()`, `calculatePips()` — no side effects

## 4. Data Flow Diagram
```
AuthProvider (global) ──→ user/session/profile/subscription
       │
       ├─→ Dashboard page
       │     └─→ getTrades() ──→ DashboardCharts (memoized)
       │
       ├─→ Trade Library page
       │     └─→ getTrades() ──→ TradeLibraryClient (search/filter/paginate)
       │
       ├─→ Add Trade page
       │     └─→ TradeForm ──→ saveTrade() ──→ invalidates cache
       │
       ├─→ Analytics page
       │     └─→ getTrades() ──→ AnalyticsContent (Recharts, lazy-loaded)
       │
       ├─→ Insights page (PlanGuard wrapped)
       │     └─→ getTrades() ──→ pattern analysis (client-side)
       │
       └─→ Sidebar
             └─→ subscription.plan_id ──→ getPlanBadge()
```

## 5. Failure Modes
| Failure | Cause | Symptom |
|---|---|---|
| Stale data after mutation | Cache not invalidated | User sees old trade after editing |
| Profile/subscription null | Slow network or trigger failure | App renders with free defaults |
| Infinite loading spinner | `isLoading` never set to false | White screen / spinner forever |
| Analytics crash | Empty trades array | Chart components throw on empty data |

## 6. Debugging Guide
1. **Data not updating after save:** Check `storage.js` — ensure cache is invalidated after mutation
2. **PlanGuard blocking access:** Check `subscription.plan_id` in browser DevTools → React DevTools → AuthProvider state
3. **Performance lag on analytics:** Check if Recharts is lazy-loaded (`next/dynamic`) — verify bundle split

## 7. Version
Last Updated: 2026-03-26
