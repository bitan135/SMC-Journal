# SMC Journal — Claude Code Master Briefing

> Read this fully before writing any code. Every decision must match the patterns here.

## What This App Is

SMC Journal is a **premium SaaS trading journal** for Smart Money Concept (SMC) traders. Users log forex/crypto/index trades, tag SMC confluences, upload chart screenshots, and analyze performance through analytics dashboards. Monetised via crypto subscription (NOWPayments, USDT on Arbitrum).

**Live URL:** https://edge-ledger-mocha.vercel.app
**Repo:** https://github.com/bitan135/Edge-Ledger
**Deploy:** Vercel auto-deploys from `main` branch push

---

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 16.1.6 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | v4 |
| Database | Supabase PostgreSQL | Latest |
| Auth | Supabase Auth | @supabase/ssr ^0.9.0 |
| Storage | Supabase Storage | Bucket: `trade-screenshots` |
| Charts | Recharts | ^3.8.0 |
| Icons | Lucide React | ^0.577.0 |
| Payments | NOWPayments API | USDT on Arbitrum |
| Hosting | Vercel | Auto-deploy |

---

## File Map — Every File

```
src/
  app/
    page.js                          ← Dashboard (/)
    login/page.js                    ← Auth
    signup/page.js                   ← Auth + Google OAuth
    forgot-password/page.js          ← Password reset request
    reset-password/page.js           ← Password reset confirm
    add-trade/page.js                ← Trade logging
    trades/page.js                   ← Trade vault + detail modal + edit
    analytics/page.js                ← 7 charts + metrics
    strategies/page.js               ← Strategy performance cards
    billing/page.js                  ← Plan upgrade (free/pro/$20/lifetime/$50)
    checkout/page.js                 ← Crypto payment flow + polling
    settings/page.js                 ← Profile + config + danger zone
    donation/page.js                 ← Crypto donation page
    api/
      payments/create/route.js       ← Create NOWPayments invoice
      payments/[id]/route.js         ← Poll payment status
      webhooks/nowpayments/route.js  ← IPN webhook — upgrades subscriptions
    auth/callback/route.js           ← Supabase OAuth callback
    globals.css                      ← Design tokens + animations
    layout.js                        ← Root layout + all providers
  components/
    Sidebar.jsx                      ← Desktop nav + mobile bottom nav (5 items max)
    TradeForm.jsx                    ← Shared form used in Add Trade AND Edit modal
    MetricCard.jsx                   ← Dashboard stat cards (5 cards, lg:grid-cols-5)
    ChartCard.jsx                    ← Chart wrapper with title/subtitle/height
    LayoutWrapper.jsx                ← Content area with sidebar offset
    ThemeProvider.js                 ← dark/light/auto theme + sidebar collapse
    ui/
      Toast.jsx                      ← ToastProvider + useToast hook
      ConfirmModal.jsx               ← ConfirmProvider + useConfirm hook
      ModalContainer.jsx             ← Generic modal shell
      EmptyState.jsx                 ← Empty state with icon/title/action
      SkeletonLoader.jsx             ← MetricSkeleton, TableRowSkeleton, ChartSkeleton
      ResultBadge.jsx                ← Win/Loss/Break Even badges
      SessionBadge.jsx               ← London/New York/Asia badges
      TagBadge.jsx                   ← SMC tag chips
      Onboarding.jsx                 ← First-run onboarding flow
  lib/
    storage.js                       ← ONLY data interface — all pages use this
    supabase.js                      ← Re-exports client + tradeService + strategyService
    payments/nowpayments.ts          ← NOWPayments API wrapper + HMAC verify
  utils/supabase/
    client.js                        ← Browser client (createBrowserClient from @supabase/ssr)
    server.js                        ← Server client (createServerClient from @supabase/ssr)
    middleware.js                    ← Session refresh for middleware.js
  middleware.js                      ← Auth guard — protects all routes except public ones
supabase/
  schema.sql                         ← Source of truth for DB structure
  migrations/                        ← Sequential SQL migrations — NEVER edit after deploy
SUPABASE_MANUAL_STEPS.md            ← SQL for Bitan to run manually in Supabase dashboard
```

---

## The Golden Rule — `src/lib/storage.js` Is The Only Data Layer

Never call Supabase directly from a page component. All data operations go through `src/lib/storage.js`.

```js
// ✅ CORRECT
import { getTrades, saveTrade, getExpectancy } from '@/lib/storage';

// ❌ WRONG — never in a page component
import { supabase } from '@/lib/supabase';
const { data } = await supabase.from('trades').select('*');
```

The only exception: `supabase.auth.*` calls in auth pages (login, signup, forgot-password, reset-password, settings password change).

---

## Database Schema — Know This Cold

### `trades` table
```
id UUID PRIMARY KEY
user_id UUID → auth.users (CASCADE DELETE)
instrument TEXT              'EURUSD'|'GBPUSD'|'USDJPY'|'XAUUSD'|'NAS100'|'US30'|'GBPJPY'|'AUDUSD'
direction TEXT               'Buy'|'Sell'
entry_price NUMERIC
stop_loss NUMERIC
take_profit NUMERIC
lot_size NUMERIC
result TEXT                  'Win'|'Loss'|'Break Even'|'Running'
rr NUMERIC                   auto-calculated by calculateRR()
pips NUMERIC                 auto-calculated by calculatePips()
session TEXT                 'London'|'New York'|'Asia'
strategy TEXT                user-defined name from strategies table
notes TEXT
screenshot_before TEXT       Supabase Storage public URL
screenshot_after TEXT        Supabase Storage public URL
smc_tags TEXT[]              ['BOS','CHoCH','FVG','Order Block','Liquidity Sweep']
trade_date TIMESTAMPTZ       WHEN THE TRADE HAPPENED — use for all display and sorting
emotional_state TEXT         'Focused'|'Fear'|'Greed'|'FOMO'|'Neutral'|'Revenge'
discipline_score INTEGER     1–5
rule_adherence BOOLEAN       did trader follow their rules?
created_at TIMESTAMPTZ       when the journal entry was logged
updated_at TIMESTAMPTZ
```

### `profiles` table (1:1 with auth.users)
```
id UUID PRIMARY KEY = auth.users.id
full_name TEXT
avatar_url TEXT
account_balance NUMERIC DEFAULT 10000
risk_percentage NUMERIC DEFAULT 1
currency TEXT DEFAULT 'USD'
has_completed_onboarding BOOLEAN DEFAULT FALSE
```

### `strategies` table
```
id UUID PRIMARY KEY
user_id UUID → auth.users (CASCADE DELETE)
name TEXT
UNIQUE(user_id, name)
```

### `subscriptions` table
```
user_id UUID UNIQUE → auth.users (CASCADE DELETE)
plan_id TEXT        'free'|'pro'|'lifetime'
status TEXT         'active'|'expired'|'past_due'
current_period_end TIMESTAMPTZ
```

### `crypto_payments` table
```
payment_id TEXT UNIQUE   NOWPayments payment_id
user_id UUID
order_id TEXT            format: '{user_uuid}_{timestamp}'
price_amount NUMERIC     20 for pro, 50 for lifetime
payment_status TEXT
pay_address TEXT         USDT/Arbitrum wallet address
plan_id TEXT
```

---

## Analytics Functions in storage.js

| Function | Returns | Notes |
|----------|---------|-------|
| `getWinRate(trades)` | `58.3` | Win% as number |
| `getProfitFactor(trades)` | `1.42` | WinRR / LossCount |
| `getAverageRR(trades)` | `2.1` | Wins only |
| `getExpectancy(trades)` | `0.68` | `(WR×avgRR) - (LR×1)` |
| `getTrend(trades, 'winRate')` | `+3.2` | Delta vs prior 10 |
| `getTrend(trades, 'profitFactor')` | `-0.1` | Delta vs prior 10 |
| `getEquityCurve(trades)` | `[{date,balance,trade}]` | For AreaChart |
| `getDrawdownCurve(trades)` | `[{date,drawdown}]` | For AreaChart |
| `getMaxDrawdown(trades)` | `-23.5` | Peak-to-trough R |
| `getMonthlyPerformance(trades)` | `[{name,rr,winRate,trades}]` | BarChart |
| `getWinRateByGroup(trades,'session')` | `[{name,winRate,trades}]` | BarChart |
| `getStrategyInsights(trades)` | `[{name,trades,winRate,avgRR,expectancy}]` | Table/cards |
| `getRRDistribution(trades)` | `[{name,count}]` | Histogram |
| `calculateRR(entry,sl,tp,dir)` | `2.1` | TradeForm live calc |
| `calculatePips(entry,sl,instrument)` | `43.5` | TradeForm live calc |
| `calculateRiskAmount(lots,pips,instr)` | `127.50` | Dollar risk display |

---

## SMC Domain Constants (from storage.js)

```js
INSTRUMENTS      = ['EURUSD','GBPUSD','USDJPY','XAUUSD','NAS100','US30','GBPJPY','AUDUSD']
SESSIONS         = ['London','New York','Asia']
SMC_TAGS         = ['Liquidity Sweep','BOS','CHoCH','FVG','Order Block']
DEFAULT_STRATEGIES = ['FVG Continuation','Liquidity Sweep Reversal','Breaker Block',
                      'Mitigation Block','Order Block Bounce','CHoCH Reversal']
```

**SMC Glossary — use exact terminology in UI copy:**
- **BOS** = Break of Structure
- **CHoCH** = Change of Character
- **FVG** = Fair Value Gap
- **OB** = Order Block
- **SL/TP** = Stop Loss / Take Profit
- **RR** = Risk/Reward ratio
- **Confluence** = Multiple SMC signals aligning on same trade
- **Session** = Market trading window (London 7am-4pm UTC / NY 12pm-9pm UTC / Asia 0am-8am UTC)

---

## Design System — CSS Variables (Never Hardcode Hex)

```css
--accent: #6366f1         Primary CTA, active states, focus rings
--background: #050505     Page background
--foreground: #F8FAFC     Primary text
--glass-bg: rgba(255,255,255,0.015)   Card fill
--glass-border: rgba(255,255,255,0.05) Card border
--profit: #10B981         Wins, positive deltas, success states
--profit-bg: rgba(16,185,129,0.1)
--loss: #F43F5E           Losses, errors, danger
--loss-bg: rgba(244,63,94,0.1)
--text-secondary: #94A3B8 Body text
--text-muted: #64748B     Labels, placeholders
--card-radius: 40px       All cards
--sidebar-bg: #0A0A0B
```

**Standard card:**
```jsx
<div className="glass-card shadow-premium">  {/* always both classes */}
```

**Animation classes (all defined in globals.css):**
```
animate-fade-in         page entrance
animate-shimmer         skeleton loaders
animate-float           background blur orbs
animate-slide-up        error/success banners
animate-scale-in        modals
animate-slide-right-in  toast notifications
animate-progress        progress bars
animate-pulse-glow      logo pulse
stagger-children        grid entrance stagger
```

---

## Feedback Systems — Use These, Never Native Browser

```js
// Notifications
import { useToast } from '@/components/ui/Toast';
const { showToast } = useToast();
showToast('Trade saved.', 'success');  // 'success'|'error'|'info'

// Destructive confirms
import { useConfirm } from '@/components/ui/ConfirmModal';
const { showConfirm } = useConfirm();
showConfirm({
  title: 'Delete Trade',
  message: 'This cannot be undone.',
  confirmLabel: 'Delete Trade',
  onConfirm: async () => { /* async */ },
  type: 'danger'  // 'danger'|'warning'
});

// FORBIDDEN:
alert('...');   // ❌
confirm('...');  // ❌
```

---

## Subscription Tiers

| Plan | Price | Unlocks |
|------|-------|---------|
| `free` | $0 | Equity Trajectory chart + Session Performance chart |
| `pro` | $20/month | All 7 analytics charts |
| `lifetime` | $50 once | All pro features, forever |

Free users must see at least 2 charts. Never lock everything — they need to see value to upgrade.

---

## Payments Architecture

```
Upgrade click → POST /api/payments/create
→ NOWPayments creates USDT/Arbitrum invoice
→ Redirect to /checkout?id={payment_id}
→ Client polls GET /api/payments/{id} every 10s
→ NOWPayments POSTs IPN to /api/webhooks/nowpayments
→ Webhook verifies HMAC SHA-512 signature
→ On 'finished': upsert subscriptions table via service role key
→ User plan becomes 'pro' or 'lifetime'
```

---

## Auth Flow

- Supabase email/password + Google OAuth
- `src/middleware.js` protects all routes, refreshes session on every request
- Public routes: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`
- Always use `supabase.auth.signOut()` (not `supabase.signOut()`) for logout
- After logout: redirect to `/login`
- After login: redirect to `/`

---

## Environment Variables

```bash
# Exposed to browser (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

# Server-only secrets (NEVER prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=       # Webhook handler only — bypasses RLS
NOWPAYMENTS_API_KEY=             # Payment creation
NOWPAYMENTS_IPN_SECRET=          # Webhook signature verification — REQUIRED
```

---

## Hard Rules — Non-Negotiable

1. Never call `alert()` or `confirm()` — use `useToast` / `useConfirm`
2. Never call Supabase directly in page components — use `src/lib/storage.js`
3. Never hardcode CSS colors — use CSS variables
4. Never use `window.location.href` for navigation — use `router.push()`
5. Never edit a migration file that has already been deployed to production
6. Always show loading state (skeleton) before data is ready
7. Always show empty state when data arrays are empty
8. Always use `trade_date` for display — never `created_at`
9. Always sort trades by `trade_date DESC`
10. Always use `useConfirm` before any delete or irreversible action
11. Always wrap async operations in try/catch with user-facing error feedback
12. Mobile bottom nav must always have exactly 5 items
