# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.1.6] — 2026-06-08

### Changed (Enterprise Rewrite)

Full enterprise-grade rewrite via the mcp-forge framework. This release replaces the previous OpenAPI-auto-expose architecture with a hand-authored, type-safe, defense-in-depth MCP server.

**Breaking changes:**
- Removed Express, cors, ajv, ajv-formats, and dotenv dependencies.
- Removed self-referential `mcp-connectwise-manage` production dependency.
- All 25 tools are now explicitly defined with Zod schemas — no runtime OpenAPI parsing.
- Environment variable names are unchanged; values are now strictly validated on startup.

**New features:**
- Profile-based tool filtering via `CW_PROFILES` / `CW_ACTIVE_PROFILE`.
- Write safeguards: `confirm=true` / `dryRun=true` required on all mutating tools.
- Operation allowlist via `CW_WRITE_ALLOWLIST`.
- Blackout window configuration via `CW_BLACKOUT_WINDOWS`.
- Pino structured logging (stderr-only, credential redaction).
- Full AppError hierarchy: `ForbiddenError`, `NotFoundError`, `ValidationError`, `ExternalServiceError`.
- Vitest test suite with 80%+ coverage thresholds.
- GitHub Actions CI with lint, typecheck, test, and smoke-test jobs.
- Multi-stage Dockerfile (non-root user, no EXPOSE, no HTTP HEALTHCHECK).
- ESLint flat config with TypeScript strict rules.
- `npm run setup` / `npm run uninstall` for Claude Desktop and Claude Code integration.

**Security:**
- Upgraded vitest from `^1.5.0` to `^4.1.8` — patches 2 critical and 3 moderate CVEs.
- `npm audit` now passes with 0 vulnerabilities.

**Modules and tools:**

| Module | Tools |
|---|---|
| Agreements | `agr-list-agreements`, `agr-get-agreement`, `agr-list-additions` |
| Companies | `co-list-companies`, `co-get-company`, `co-list-contacts` |
| Projects | `prj-list-projects`, `prj-get-project`, `prj-list-phases`, `prj-list-tickets` |
| Sales | `sal-list-opportunities`, `sal-get-opportunity`, `sal-list-quotes` |
| Service Desk | `svc-list-tickets`, `svc-get-ticket`, `svc-list-boards`, `svc-list-statuses`, `svc-list-priorities`, `svc-list-impacts`, `svc-list-members` |
| Setup | `setup-list-tables`, `setup-list-locations`, `setup-list-departments`, `setup-list-work-types`, `setup-list-work-roles` |
| Time | `time-list-entries`, `time-list-periods`, `time-create-entry`, `time-update-entry` |

---

## [0.1.5] — 2024-12-01

### Added
- Initial public release.
- OpenAPI-driven tool auto-exposure via ConnectWise Manage v4_6_release spec.
- Basic stdio MCP transport.
- Service desk, time, agreements, companies, projects, sales, and setup modules.

[Unreleased]: https://github.com/Flagler-County-BoCC/mcp-connectwise-manage/compare/v0.1.6...HEAD
[0.1.6]: https://github.com/Flagler-County-BoCC/mcp-connectwise-manage/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/Flagler-County-BoCC/mcp-connectwise-manage/releases/tag/v0.1.5
