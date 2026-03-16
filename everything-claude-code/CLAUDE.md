# ECC + SMC Journal Agent Environment

This folder contains the ECC infrastructure plus SMC Journal project-specific agents, skills, rules, and commands.

## SMC Journal Files — Read These First

| File | Purpose |
|------|---------|
| `../CLAUDE.md` (project root) | Stack, schema, constants, rules, all patterns |
| `agents/smc-journal-planner.md` | Feature planning |
| `agents/smc-journal-reviewer.md` | Code review |
| `agents/supabase-specialist.md` | Migrations, RLS, schema |
| `agents/ui-polish-specialist.md` | Design system, components |
| `skills/smc-journal-patterns/` | Canonical code patterns |
| `skills/smc-journal-security/` | API/webhook/payment security |
| `skills/smc-journal-analytics/` | Charts, metrics, lock system |
| `rules/smc-journal/always.md` | Always-on: all src files |
| `rules/smc-journal/api-routes.md` | All API routes |
| `rules/smc-journal/database.md` | All migrations |
| `commands/smc-verify.md` | `/smc-verify` — pre-commit checks |
| `commands/smc-review.md` | `/smc-review` — project review |
| `commands/smc-add-metric.md` | `/smc-add-metric` — add analytics |
| `commands/smc-add-field.md` | `/smc-add-field` — add trade field |

## ECC Agents Kept

`architect` `build-error-resolver` `chief-of-staff` `code-reviewer`
`database-reviewer` `doc-updater` `e2e-runner` `planner`
`refactor-cleaner` `security-reviewer` `tdd-guide`

## ECC Skills Kept

`frontend-patterns` `backend-patterns` `api-design` `postgres-patterns`
`database-migrations` `security-review` `security-scan` `tdd-workflow`
`verification-loop` `deployment-patterns` `coding-standards`
`agentic-engineering` `ai-first-engineering` `deep-research`
`continuous-learning` `continuous-learning-v2` `iterative-retrieval`

## ECC Commands Kept

`/plan` `/tdd` `/code-review` `/build-fix` `/checkpoint`
`/learn` `/quality-gate` `/refactor-clean` `/e2e`
`/test-coverage` `/verify` `/eval`
