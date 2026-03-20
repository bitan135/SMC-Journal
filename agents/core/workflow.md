# 🔄 Mandatory Engineering Workflow

Every task must follow this deterministic cycle to ensure production readiness.

## 1. Audit
- Analyze the current implementation.
- Identify all affected files and systems.
- Check for existing technical debt.

## 2. Diagnose
- Find the **root cause**.
- Reproduce the issue consistently.
- Do not move to planning until the problem is fully understood.

## 3. Plan
- Draft an implementation plan.
- Ensure the solution is holistic and follows the Core Rules.
- Get alignment on breaking changes.

## 4. Implement
- Write clean, maintainable code.
- Follow the designated file structure.

## 5. Validate
- Verify the fix in a production build (`npm run build`).
- Confirm that the root cause is eliminated.

## 6. Test Edge Cases
- **Auth Flow**: Test login/logout on different domains.
- **Refresh Behavior**: Ensure state survives manual page refreshes.
- **Direct URL**: Access protected paths directly from the address bar.
- **Mobile**: Verify all interactions on simulated mobile devices.
