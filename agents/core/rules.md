# ⚖️ Core Engineering Rules

Strict adherence to these rules is mandatory. Violation leads to technical debt and production instability.

## 🚫 System Prohibitions
- **No Race Conditions**: Auth state must be synchronized before rendering protected UI.
- **No Redirect Loops**: Middleware and client-side guards must be perfectly aligned.
- **No Partial Fixes**: If a bug is found, fix the underlying architecture, not just the instance.
- **No UI-Only Fixes**: Do not use CSS or `setTimeout` to hide system-level timing issues.
- **No Over-Engineering**: Solve the problem simply and elegantly.

## 🎨 UI/UX Prohibitions
- **No Low-Contrast UI**: Text must be readable against all backgrounds.
- **No Hidden Elements**: Interactive elements must not be obscured or hard to find.
- **No Unreadable Design**: Form follows function; premium aesthetic must enhance, not hinder, clarity.
