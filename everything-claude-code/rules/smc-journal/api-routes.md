---
paths:
  - "src/app/api/**/*.js"
  - "src/app/api/**/*.ts"
---

# SMC Journal — API Route Rules

## Auth
- EVERY route: call `supabase.auth.getUser()` first, return 401 if null
- Use `createClient()` from `@/utils/supabase/server`

## Input
- ALWAYS validate request body before using it
- ALWAYS check enum values against an allowed list
- Return 400 with specific message for bad input

## Errors
- Log detailed errors with `console.error()` server-side
- Return generic message to client — never leak internals
- Use correct HTTP status codes (400/401/403/404/500)

## Payments API
- Prices defined server-side only: `const PRICES = { pro: 20, lifetime: 50 }`
- Never use client-supplied price amounts

## Webhook
- `NOWPAYMENTS_IPN_SECRET` must be set — return 500 if missing
- `x-nowpayments-sig` header must exist — return 400 if missing
- Verify HMAC SHA-512 signature before processing
- Validate `order_id` contains valid UUID before DB operations
- Use service role key (not anon) for subscription updates
- All operations must be idempotent
