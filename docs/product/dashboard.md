# SOP: Dashboard & Journal

## 1. Purpose
Documents the core application experience: dashboard KPIs, trade journaling, analytics, insights, and strategies.

## 2. Owner
- `src/app/dashboard/page.js` → `DashboardCharts.jsx`
- `src/app/trades/page.js` → `TradeLibraryClient.jsx`
- `src/app/add-trade/page.js` → `TradeForm.jsx`
- `src/app/analytics/page.js` → `AnalyticsContent.jsx`
- `src/app/dashboard/insights/page.js`
- `src/app/strategies/page.js`
- `src/app/settings/page.js`

## 3. User Flows

### Trade Entry Flow
```
User → /add-trade → TradeForm
  1. Select instrument (EURUSD, XAUUSD, etc.)
  2. Pick direction (Buy/Sell)
  3. Enter entry price, SL, TP, lot size
  4. Tag SMC concepts: BOS, CHoCH, FVG, Order Block, etc.
  5. Add setup zone type (Supply/Demand)
  6. Add bias (Continuation/Reversal + timeframe)
  7. Add session (London/New York/Asia/Sydney)
  8. Add strategy (from user's strategy list)
  9. Set result (Win/Loss/Break Even/Running)
  10. Add psychology: emotional state, discipline score, rule adherence
  11. Upload screenshots (before/after)
  12. Add notes
  → saveTrade() → Supabase insert → redirect to /trades
```

### Dashboard Flow
```
User → /dashboard
  1. Fetch all trades for user
  2. Calculate KPIs: total trades, win rate, avg RR, total P&L
  3. Render equity curve (line chart)
  4. Show recent trades summary
  5. Display plan badge in sidebar
```

### Analytics Flow (Pro Required)
```
User → /analytics → PlanGuard check
  If free → show locked overlay with upgrade CTA
  If pro/6_month/lifetime_legacy →
    1. Fetch all trades
    2. Calculate: win rate by session, by strategy, drawdown analysis, monthly P&L
    3. Render Recharts charts (lazy-loaded)
```

### Insights Flow (Pro + 30 Trades Required)
```
User → /dashboard/insights → check plan + trade count
  If free or <30 trades → show gated content
  If pro + 30+ trades →
    1. Fetch all trades
    2. Run pattern analysis:
       - Best performing session
       - Best performing strategy
       - Emotional patterns vs results
       - SMC tag correlations
    3. Display insights cards with recommendations
  If pro + 100+ trades →
    - Unlock advanced insights
```

## 4. Data Dependencies
| Feature | Table | Min Trades | Plan Required |
|---|---|---|---|
| Dashboard KPIs | trades | 0 | Free |
| Equity Curve | trades | 1 | Free |
| Trade Library | trades | 0 | Free |
| Analytics | trades | 1 | Pro |
| Basic Insights | trades | 30 | Pro |
| Advanced Insights | trades | 100 | Pro |
| Strategies | strategies | 0 | Free |

## 5. State Updates After Trade Mutation
1. `storage.saveTrade()` called
2. In-memory cache invalidated
3. User redirected to `/trades`
4. Next visit to `/dashboard` fetches fresh data
5. Analytics recalculate from full trade set

## 6. Failure Modes
| Failure | Cause | Impact |
|---|---|---|
| Empty dashboard | No trades yet | Shows empty state / CTA to add first trade |
| RR shows 0 | SL === entry price | Division by zero guard returns 0 |
| Screenshot upload fails | Storage bucket issue | Trade saves without screenshot |
| Analytics crash | Chart component receives null/undefined | ErrorBoundary catches |

## 7. Version
Last Updated: 2026-03-26
