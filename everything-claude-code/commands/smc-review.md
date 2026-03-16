---
description: SMC Journal targeted code review. Faster and more relevant than generic /code-review for this project.
---

# /smc-review

Invoke `smc-journal-reviewer` for a project-specific review pass.

Checks all SMC Journal rule violations:
- Forbidden patterns (alert, confirm, direct supabase, window.location)
- Missing loading / empty / error states
- Incorrect analytics lock config (wrong charts locked/unlocked)
- Wrong date field (created_at instead of trade_date)
- Mobile nav item count
- CSS variable usage
- Toast/confirm usage for feedback

Use this instead of generic `/code-review` for all SMC Journal work — it knows the project-specific rules.
