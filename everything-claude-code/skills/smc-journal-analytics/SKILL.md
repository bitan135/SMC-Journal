---
name: smc-journal-analytics
description: SMC Journal analytics system reference. Read when adding metrics, charts, or modifying analytics page. Documents all computation functions, chart configurations, and the free/pro lock system.
origin: SMC Journal
---

# SMC Journal Analytics System

## When to Activate
- Adding a metric to Dashboard or Analytics page
- Adding a new chart
- Debugging wrong metric values
- Changing which charts are locked/free

---

## All Analytics Functions

All live in `src/lib/storage.js`. All pure functions: `fn(trades[]) → value`.

```
getWinRate(trades)               → 58.3       Win% as number
getProfitFactor(trades)          → 1.42       Total win RR / loss count
getAverageRR(trades)             → 2.1        Avg RR on wins only
getExpectancy(trades)            → 0.68       (WR×avgRR) - (LR×1)
getTrend(trades, 'winRate', N)   → +3.2       Delta vs prior N trades
getTrend(trades, 'profitFactor') → -0.1       Delta vs prior N trades

getEquityCurve(trades)           → [{date, balance, trade, result}]
getDrawdownCurve(trades)         → [{date, drawdown, balance, trade}]
getMaxDrawdown(trades)           → -23.5      Worst peak-to-trough R
getMonthlyPerformance(trades)    → [{name:'Jan 25', rr:4.2, winRate:62, trades:8}]
getWinRateByGroup(trades,'session')     → [{name:'London', winRate:62, trades:24}]
getWinRateByGroup(trades,'instrument')  → [{name:'XAUUSD', winRate:55, trades:12}]
getStrategyInsights(trades)      → [{name, trades, winRate, avgRR, expectancy, wins, losses}]
getRRDistribution(trades)        → [{name:'1-1.5', count:4}, ...]
```

---

## Expectancy Formula

```
Expectancy = (WinRate × AverageWinRR) - (LossRate × 1)

60% WR, 2.1R average win:
= (0.60 × 2.1) - (0.40 × 1) = 1.26 - 0.40 = 0.86R

> 0.5R = strong edge
0.2–0.5R = positive edge
< 0 = losing system
```

---

## The 7 Charts — Free vs Pro

| # | Title | Free? | Data Function |
|---|-------|-------|---------------|
| 1 | Equity Trajectory | ✅ FREE | `getEquityCurve()` |
| 2 | Session Performance | ✅ FREE | `getWinRateByGroup(t,'session')` |
| 3 | Yield Distribution | 🔒 PRO | `getRRDistribution()` |
| 4 | Setup Authority | 🔒 PRO | `getStrategyInsights()` |
| 5 | Instrument Dominance | 🔒 PRO | `getWinRateByGroup(t,'instrument')` |
| 6 | Portfolio Drawdown | 🔒 PRO | `getDrawdownCurve()` |
| 7 | Monthly P&L Velocity | 🔒 PRO | `getMonthlyPerformance()` |

**Rule: Free users see charts 1+2. Pro users see all 7. Never lock chart 1 or 2.**

---

## Dashboard MetricCards (5 total, `lg:grid-cols-5`)

```jsx
<MetricCard label="Win Rate"       value={`${winRate}%`}         trend={getTrend(trades,'winRate')}         color={winRate>=50?'profit':'loss'} icon={Target} />
<MetricCard label="Profit Factor"  value={profitFactor}           trend={getTrend(trades,'profitFactor')}    color={pf>=1?'profit':'loss'}       icon={TrendingUp} />
<MetricCard label="Average RR"     value={`${avgRR}R`}            subValue="Wins Only"                       color="accent"                      icon={BarChart3} />
<MetricCard label="Expectancy"     value={`${expectancy >= 0 ? '+' : ''}${expectancy}R`} subValue="Per Trade" color={exp>=0?'profit':'loss'}      icon={Zap} />
<MetricCard label="Vault Sample"   value={totalTrades}             subValue="Executions"                     color="neutral"                     icon={Clock} />
```

Trend values MUST come from `getTrend()` — never hardcode `+2.4%` or similar.

---

## Psychology Analytics (Data Captured, Analytics Not Yet Built)

The trades table captures: `emotional_state`, `discipline_score`, `rule_adherence`. These are logged but not yet surfaced in charts. Future analytics to build:

- Win rate by emotional state (Focused > FOMO > Revenge)
- Correlation between `rule_adherence = false` and losing trades
- `discipline_score` trend over time

These are the "killer features" that create user addiction and justify the Pro subscription. Keep logging the data now; analytics come in the next phase.
