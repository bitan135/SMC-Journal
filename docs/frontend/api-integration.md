# SOP: Frontend-API Integration

## 1. Purpose
Documents how the frontend communicates with backend APIs and the Supabase data layer.

## 2. Communication Patterns

### Direct Supabase (Client-Side)
Most data operations go directly to Supabase via the browser client:
- `tradeService.getTrades()` → `supabase.from('trades').select('*')`
- `tradeService.createTrade()` → `supabase.from('trades').insert()`
- `strategyService.getStrategies()` → `supabase.from('strategies').select('*')`
- Profile updates → `supabase.from('profiles').update()`
- **Auth:** RLS enforces user_id matching automatically

### API Routes (Server-Side)
Operations requiring elevated privileges or external APIs go through Next.js API routes:
- **Payment creation:** `POST /api/payments/create` (needs NOWPayments API key)
- **Payment lookup:** `GET /api/payments/[id]`
- **Affiliate operations:** All affiliate routes use service role key
- **Auth logout:** `GET /api/auth/logout` (needs cookie manipulation)

### Webhooks (External → Server)
- `POST /api/webhooks/nowpayments` — Called by NOWPayments, not by frontend

## 3. Error Handling Pattern
All `storage.js` helpers return a safe envelope:
```javascript
{ success: true, data: [...] }
{ success: false, error: "Error message" }
```
Components check `success` before rendering data, and display error states on failure.

## 4. Caching
- **In-memory cache** in `storage.js` with 5-minute TTL
- Cache key: `'trades'` and `'strategies'`
- Invalidation: Any mutation (create/update/delete) clears the cache immediately
- No HTTP caching headers configured on API routes

## 5. Version
Last Updated: 2026-03-26
