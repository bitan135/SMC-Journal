---
description: Add a new analytics metric or chart to SMC Journal end-to-end.
---

# /smc-add-metric

Add a new metric or chart to the app, from the storage.js function to the UI.

## What Happens

1. `smc-journal-planner` determines if metric belongs on Dashboard (MetricCard) or Analytics (chart)
2. Pure function written in `src/lib/storage.js` following the `fn(trades[]) → value` pattern
3. Free vs Pro lock decision made and documented
4. UI component added with correct styling
5. `smc-journal-reviewer` verifies the implementation

## Usage

```
/smc-add-metric "consecutive losing trades counter"
/smc-add-metric "best performing hour of day"
/smc-add-metric "average trade hold time in minutes"
/smc-add-metric "psychology: win rate when FOMO vs Focused"
```

## Agents: `smc-journal-planner` → `smc-journal-reviewer`
