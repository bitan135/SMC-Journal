---
name: smc-journal-security
description: Security rules for SMC Journal. Read before modifying any API route, webhook, payment flow, migration, or auth code.
origin: SMC Journal
---

# SMC Journal Security

## When to Activate
- Modifying `src/app/api/` routes
- Working on the payments or webhook flow
- Writing Supabase migrations
- Adding environment variables
- Touching auth pages

---

## Secure API Route Template

```js
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // 1. Auth — always first
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Validate input — always second
  const body = await req.json();
  const VALID_PLANS = ['pro', 'lifetime'];
  if (!body.planId || !VALID_PLANS.includes(body.planId)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  // 3. Business logic in try/catch
  try {
    // ... do the work
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Route error:', error);  // detailed log, server only
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });  // generic to client
  }
}
```

---

## Webhook Security — All 5 Rules Are Mandatory

```js
// In /api/webhooks/nowpayments/route.js

// Rule 1: IPN secret must exist
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
if (!ipnSecret) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

// Rule 2: Signature header must exist
const signature = headerStore.get('x-nowpayments-sig');
if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

// Rule 3: Verify HMAC SHA-512
const isValid = nowPaymentsService.verifySignature(payload, signature, ipnSecret);
if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

// Rule 4: Validate order_id UUID format
const userId = order_id.split('_')[0];
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(userId)) return NextResponse.json({ error: 'Invalid order' }, { status: 400 });

// Rule 5: Use service role key (not anon key) for DB writes
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
```

---

## Prices Defined Server-Side Only

```js
// In /api/payments/create/route.js
// Prices are ONLY defined here — never trust client-supplied amounts
const PRICES = { pro: 20, lifetime: 50 };
if (!PRICES[planId]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
const price_amount = PRICES[planId];
```

---

## Environment Variable Rules

| Variable | Prefix | Used In |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Public | Everywhere |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Public | Client fetches (respects RLS) |
| `NEXT_PUBLIC_SITE_URL` | ✅ Public | OAuth redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Server only | Webhook handler ONLY |
| `NOWPAYMENTS_API_KEY` | ❌ Server only | Payment creation route |
| `NOWPAYMENTS_IPN_SECRET` | ❌ Server only | Webhook signature verify |

If a secret is missing → fail loudly, not silently.

---

## Supabase RLS — Every Table

```sql
-- Immediately when creating a new table:
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own data" ON public.new_table
  FOR ALL USING (auth.uid() = user_id);

-- Never: GRANT ALL, GRANT ... TO anon
-- Never: RLS disabled on a user-data table
```
