# Contributing

Thank you for your interest in contributing to `mcp-connectwise-manage`. This document describes how to set up a development environment and the process for submitting changes.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm >= 10
- A ConnectWise Manage instance (or test credentials) for integration work

### Setup

```bash
git clone https://github.com/Flagler-County-BoCC/mcp-connectwise-manage.git
cd mcp-connectwise-manage
npm install
cp .env.example .env.test
# Edit .env.test with fake/test-safe values (never real credentials)
```

### Running Tests

```bash
# Unit + integration tests (no real credentials needed)
npm test

# With coverage
npm run test:coverage

# Type-check
npm run typecheck

# Lint
npm run lint
```

## Development Workflow

1. **Fork** the repository and create a feature branch from `main`.
2. **Make changes** following the patterns below.
3. **Add tests** — new tools and services require unit tests; new tool registrations require integration tests.
4. **Run the full check suite** before submitting:

   ```bash
   npm run lint && npm run format:check && npm run typecheck && npm test
   ```

5. **Open a pull request** against `main` using the PR template.

## Project Conventions

### File Layout

Each tool module follows the same structure:

```
src/tools/<module>/
├── <module>.schema.ts   # Zod input schemas — no business logic
├── <module>.service.ts  # API calls + business logic — no MCP imports
├── <module>.tool.ts     # MCP tool registrations — imports service from container
└── <module>.types.ts    # TypeScript types for CW API responses
```

### Adding a New Tool

1. Add the Zod input schema to `<module>.schema.ts`.
2. Add the service method to `<module>.service.ts` — use `assertWritePermitted` for any write.
3. Register the tool in `<module>.tool.ts` via `server.tool(name, description, schema.shape, handler)`.
4. Add a unit test in `<module>/__tests__/<module>.tool.spec.ts`.
5. Update the tool count assertion in `tests/integration/<module>.tool.test.ts`.
6. Document the tool in `docs/API.md`.

### Adding a New Module

1. Create `src/tools/<module>/` with the four standard files.
2. Export the service from `src/lib/container.ts`.
3. Import and call `registerXTools(server)` in `src/server.ts` (alphabetical order, profile-gated).
4. Add the module prefix to the profile examples in `docs/ENVIRONMENT.md`.
5. Create `tests/integration/<module>.tool.test.ts`.

### Code Style

- TypeScript strict mode — `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`.
- All optional property assignments require `if (value !== undefined)` guards.
- ESM imports use `.js` extensions on all local imports.
- No `console.log` in `src/` — use `createLogger({ module: '...' })`.
- No `process.env.X` in business code — always read from `config`.
- No `eval()`, `new Function()`, or `as any` casts.

### Write Safeguards

Any tool that modifies data must:

1. Accept `confirm: z.coerce.boolean().default(false)` and `dryRun: z.coerce.boolean().default(false)` in its schema.
2. Check `config.mcp.requireConfirm && !input.confirm && !input.dryRun` in the tool handler and return a prompt.
3. Call `this.assertWritePermitted(input.confirm, input.dryRun, 'METHOD', '/path')` as the first line of the service method.
4. Return `{ dryRun: true, payload }` when `input.dryRun` is true.

### Logging

```typescript
const log = createLogger({ module: 'myModuleTool' });

log.debug({ params }, 'my-tool-name called');
log.info({ resourceId }, 'Created resource');
log.warn({ err }, 'Operational error');
log.error({ err }, 'Unexpected error');
```

Never log `CW_pub`, `CW_priv`, or `CW_clientId` — pino redaction covers these by field name, but avoid passing them explicitly.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(time): add time-delete-entry tool
fix(service): handle 404 from getTicket correctly
docs(api): add prj-list-phases example
chore(deps): upgrade vitest to 4.2.0
```

## Pull Request Process

1. Ensure all CI checks pass.
2. Coverage must not drop below the configured thresholds (80% lines/functions, 75% branches).
3. Include a description of the change and its motivation.
4. Reference any related issues with `Fixes #NNN` or `Closes #NNN`.

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) issue template. Do not include real ConnectWise credentials in bug reports.

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities responsibly.
