---
description: Pre-commit quality gate for SMC Journal. Scans for project-specific violations before any push.
---

# /smc-verify

Run this before every git commit or push. Catches the mistakes that generic linters miss.

## Automated Scans

```bash
# 1. Build
npm run build

# 2. Lint
npm run lint

# 3. Forbidden patterns
echo "=== alert() calls ===" && grep -rn "alert(" src/ --include="*.js" --include="*.jsx"
echo "=== confirm() calls ===" && grep -rn "confirm(" src/ --include="*.js" --include="*.jsx"
echo "=== window.location ===" && grep -rn "window.location.href" src/ --include="*.js" --include="*.jsx"
echo "=== Direct Supabase in pages ===" && grep -rn "supabase.from(" src/app/ --include="*.js" --include="*.jsx"
echo "=== created_at in display ===" && grep -rn "created_at" src/app/ --include="*.js" --include="*.jsx"
echo "=== console.log in components ===" && grep -rn "console.log" src/app/ --include="*.js" --include="*.jsx"
echo "=== Hardcoded hex colors ===" && grep -rn "#[0-9a-fA-F]\{3,6\}" src/app/ --include="*.jsx"
```

## Expected: All Forbidden Pattern Scans Return Zero Results

If any scan returns results — fix before committing.

## Agent: `smc-journal-reviewer`
