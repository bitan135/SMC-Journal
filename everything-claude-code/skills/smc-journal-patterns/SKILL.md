---
name: smc-journal-patterns
description: Canonical development patterns for SMC Journal. Read when adding features, new pages, new fields, or debugging. Contains the exact code patterns for data, charts, and UI.
origin: SMC Journal
---

# SMC Journal Development Patterns

## When to Activate
- Adding a new page
- Adding a new field to trades or strategies
- Building a new analytics metric or chart
- Modifying TradeForm
- Debugging a data display issue

---

## Pattern 1 — Standard Page Structure

```jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getData } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';

export default function PageName() {
  const router = useRouter();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (err) {
        console.error('Load failed:', err);
        showToast('Failed to load. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <SkeletonLayout />;
  if (!data.length) return <EmptyState icon={...} title="..." description="..." />;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-[1440px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float pointer-events-none" />
      <div className="relative z-10 w-full">
        {/* content */}
      </div>
    </div>
  );
}
```

---

## Pattern 2 — Adding a New Field to Trades (7 steps)

**Step 1:** Create migration
```sql
-- supabase/migrations/YYYYMMDD_add_fieldname.sql
ALTER TABLE public.trades
ADD COLUMN IF NOT EXISTS field_name TEXT
  CHECK (field_name IN ('Option1', 'Option2'));
CREATE INDEX IF NOT EXISTS idx_trades_field_name ON public.trades(field_name);
```

**Step 2:** Update `supabase/schema.sql`
**Step 3:** Add to `SUPABASE_MANUAL_STEPS.md`
**Step 4:** Add to TradeForm `formData` initial state
```js
field_name: initialData?.field_name || 'default',
```
**Step 5:** Add to TradeForm `finalData` submission object
```js
field_name: formData.fieldName || null,
```
**Step 6:** Add to `handleUpdate` updates object in `trades/page.js`
**Step 7:** Add display to trade detail modal if relevant

---

## Pattern 3 — Adding a New Analytics Function to storage.js

```js
export function getNewMetric(trades = []) {
  if (!trades || !trades.length) return 0;  // guard always first

  const result = trades.reduce((acc, trade) => {
    // always use trade_date for date logic
    const date = new Date(trade.trade_date || trade.created_at);
    return acc + (trade.result === 'Win' ? (trade.rr || 1) : -1);
  }, 0);

  return parseFloat(result.toFixed(2));  // always round output
}
```

Then in the page:
```js
import { ..., getNewMetric } from '@/lib/storage';
const newMetric = getNewMetric(trades);  // after trades loaded
```

---

## Pattern 4 — Recharts Chart Setup

```jsx
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function CustomTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card shadow-premium p-4 rounded-2xl border-[var(--glass-border)] backdrop-blur-xl">
      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-lg font-black text-[var(--foreground)] tracking-tighter">{payload[0].value}{suffix}</p>
    </div>
  );
}

<ChartCard title="Title" subtitle="subtitle" className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)]">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip suffix="R" />} />
      <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={4} fillOpacity={1} fill="url(#grad)" animationDuration={2000} />
    </AreaChart>
  </ResponsiveContainer>
</ChartCard>
```

---

## Pattern 5 — Analytics Lock System

```jsx
// At top of analytics component (outside return)
const isLocked = subscription?.plan_id === 'free';

const LockOverlay = () => (
  <div className="absolute inset-x-8 inset-y-12 z-50 flex flex-col items-center justify-center text-center p-8 glass-effect rounded-[32px] border border-[var(--glass-border)] backdrop-blur-md">
    <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-6 animate-pulse">
      <ShieldCheck className="text-[var(--accent)]" size={32} />
    </div>
    <h3 className="text-xl font-black text-[var(--foreground)] mb-3 tracking-tighter">Pro Analytics</h3>
    <p className="text-[var(--text-secondary)] text-sm font-medium max-w-[240px] mb-8 leading-[1.8]">Upgrade to unlock advanced analytics.</p>
    <button onClick={() => window.location.href = '/billing'} className="px-8 py-3 bg-[var(--accent)] text-white text-xs font-black uppercase tracking-widest rounded-2xl">
      Upgrade to Pro
    </button>
  </div>
);

// FREE chart (no lock):
<ChartCard title="Equity Trajectory" className="... group">
  <div className="h-full w-full"><ResponsiveContainer>...</ResponsiveContainer></div>
</ChartCard>

// PRO chart (with lock):
<ChartCard title="Yield Distribution" className="... relative group">
  {isLocked && <LockOverlay />}
  <div className={isLocked ? 'blur-md opacity-20 pointer-events-none h-full w-full' : 'h-full w-full'}>
    <ResponsiveContainer>...</ResponsiveContainer>
  </div>
</ChartCard>
```
