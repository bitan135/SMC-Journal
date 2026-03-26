# SOP: Navigation & Routing

## 1. Purpose
Documents all application routes, their protection status, and navigation flow.

## 2. Route Map

### Public Routes (No Auth Required)
| Route | Page | Purpose |
|---|---|---|
| `/` | Landing page | Marketing, conversion |
| `/login` | Login | Email/password + OAuth |
| `/signup` | Signup | Registration |
| `/pricing` | Pricing page | Plan comparison |
| `/features` | Features page | Product features |
| `/privacy` | Privacy policy | Legal |
| `/terms` | Terms of service | Legal |
| `/forgot-password` | Password reset request | |
| `/reset-password` | Password reset form | |
| `/insight-engine` | Marketing page | Insight Engine demo |
| `/auth/callback` | OAuth callback | Code exchange |
| `/affiliate/*` | Affiliate portal | Application, login, dashboard |
| `/forex-trading-journal` | SEO page | Search traffic |
| `/smc-trading-journal` | SEO page | Search traffic |
| `/trading-journal` | SEO page | Search traffic |
| `/donation` | Donation page | Community support |

### Protected Routes (Auth Required)
| Route | Page | Plan Required | Purpose |
|---|---|---|---|
| `/dashboard` | Dashboard | Free | KPIs, equity curve |
| `/trades` | Trade Library | Free | Browse/search all trades |
| `/add-trade` | Add Trade | Free | New trade entry form |
| `/analytics` | Analytics | Pro | Advanced charts & metrics |
| `/dashboard/insights` | Insight Engine | Pro (30+ trades) | AI pattern analysis |
| `/strategies` | Strategies | Free | Strategy management |
| `/billing` | Billing | Free | Plan selection |
| `/billing/checkout` | Checkout | Free | Payment form |
| `/settings` | Settings | Free | Profile & account |

### Protection Enforcement
1. **Middleware** (`src/utils/supabase/middleware.js`): Server-side redirect
2. **AuthProvider** (`src/components/AuthProvider.js`): Client-side guard
3. **PlanGuard** (`src/components/PlanGuard.jsx`): Feature gating by plan

### Navigation Components
- **Desktop:** Left sidebar (`Sidebar.jsx`) — always visible on protected routes
- **Mobile:** Bottom tab bar — 5 icons (Dashboard, Trades, Add, Analytics, Settings)
- **Sidebar hides on:** All public routes + `/auth/callback`

## 3. Redirect Logic
| Condition | Action |
|---|---|
| Unauthenticated + protected route | → `/login?next={path}` |
| Authenticated + `/login` or `/signup` or `/` | → `/dashboard` |
| Authenticated + `/` with `?logout=true` | Stay on landing (no redirect) |
| OAuth `?code=` on any route | → `/auth/callback` (middleware intercept) |

## 4. Version
Last Updated: 2026-03-26
