---
paths:
  - "src/**/*.js"
  - "src/**/*.jsx"
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# SMC Journal — Always-On Rules

Applied to every file in `src/`. Non-negotiable in every code change.

## Data Layer
- ALWAYS use `src/lib/storage.js` for all data ops in page components
- NEVER import `supabase.from()` in page components — only in lib/ and api/
- ALWAYS handle `isLoading` state before rendering data
- ALWAYS handle empty array state
- ALWAYS wrap async ops in try/catch with user feedback

## UI Feedback
- NEVER call `alert()` — use `useToast` from `@/components/ui/Toast`
- NEVER call `confirm()` — use `useConfirm` from `@/components/ui/ConfirmModal`
- ALWAYS show a `showToast` on async success
- ALWAYS show a `showToast(..., 'error')` on async failure
- ALWAYS use `useConfirm` before delete or destructive action
- ALWAYS disable and show spinner on buttons during async ops

## Styling
- NEVER hardcode hex colors in className — use CSS variables
- ALWAYS use `glass-card shadow-premium` together on card elements
- NEVER use `window.location.href` — use `router.push()` from `next/navigation`
- ALWAYS use `var(--profit)` for wins/positives, `var(--loss)` for losses/errors

## Dates and Sorting
- ALWAYS use `trade_date` when displaying when a trade happened
- NEVER use `created_at` for trade display dates
- ALWAYS sort trades by `trade_date DESC`
