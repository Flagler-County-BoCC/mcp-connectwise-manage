# Architecture

## Overview

`mcp-connectwise-manage` is an MCP stdio server. It speaks JSON-RPC 2.0 over stdin/stdout and proxies requests to the ConnectWise Manage REST API over HTTPS. There is no HTTP server, no open ports, and no persistent state.

## Data Flow

```
MCP Client (Cursor / Claude Desktop)
         │  JSON-RPC over stdio
         ▼
┌─────────────────────────────────────┐
│         StdioServerTransport         │  src/stdio.ts
│  (stdin reader / stdout writer)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│            McpServer                 │  src/server.ts
│  (tool registry, profile gating)    │
└──────────────┬──────────────────────┘
               │  tool call dispatch
               ▼
┌─────────────────────────────────────┐
│          Tool Handler                │  src/tools/<module>/<module>.tool.ts
│  validate(schema, params)            │
│  → write gate check                  │
│  → call service method               │
│  → format JSON result               │
│  → handleToolError on catch          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│            Service                   │  src/tools/<module>/<module>.service.ts
│  (business logic)                    │
│  assertWritePermitted()              │
│  assertOperationAllowed()            │
│  builds CW query params/conditions   │
│  throws AppError subclasses          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          HTTP Client                 │  src/lib/http-client.ts
│  axios + Basic Auth interceptor      │
│  clientId header injection           │
│  → ExternalServiceError on failure   │
└──────────────┬──────────────────────┘
               │  HTTPS
               ▼
      ConnectWise Manage REST API
      (v4_6_release / apis/3.0)
```

## Modules

| Directory | Responsibility |
|---|---|
| `src/config/` | Zod env schema + strongly-typed `config` object; `process.exit(1)` on invalid env |
| `src/errors/` | `AppError` hierarchy: `ForbiddenError`, `NotFoundError`, `ValidationError`, `ExternalServiceError` |
| `src/lib/` | Shared utilities: http-client, logger (pino, stderr-only), DI container, profile check, input validate, write allowlist |
| `src/tools/<module>/` | One directory per API module — schema, service, tool handler, types |
| `src/server.ts` | `createServer()` — registers tools, applies profile gating. Does NOT call `server.connect()`. |
| `src/stdio.ts` | Entry point — creates transport, connects server, handles SIGTERM/SIGINT |
| `scripts/` | Setup + uninstall scripts for Claude Desktop and Claude Code |

## Security Layers

```
Layer 1 — Profile gating (src/lib/profile.ts)
  Tool modules not matching the active profile prefix are never registered.

Layer 2 — Write gate at tool layer (src/tools/<module>/<module>.tool.ts)
  config.mcp.requireConfirm + !confirm + !dryRun → return prompt (isError: false)

Layer 3 — Write gate at service layer (src/tools/time/time.service.ts)
  assertWritePermitted() → ForbiddenError if bypassed

Layer 4 — Operation allowlist (src/lib/write-allowlist.ts)
  assertOperationAllowed() checks CW_WRITE_ALLOWLIST before any write
```

## Logging

All log output goes to **stderr**. stdout is reserved exclusively for MCP JSON-RPC protocol messages — any log line on stdout would corrupt the stdio transport.

- Development: `pino-pretty` → `destination: 2` (stderr fd)
- Production: `pino` JSON → `process.stderr`
- Test: `level: 'silent'`

Sensitive fields (`priv`, `pub`, `clientId`, `secret`, `token`, `password`) are redacted via pino's `redact.paths` — they never appear in log output.

## Error Handling

```
AppError (src/errors/AppError.ts)
├── ForbiddenError       — 403, write gate violations
├── NotFoundError        — 404, resource not found
├── ValidationError      — 400, Zod schema failures
└── ExternalServiceError — 502, upstream CW API errors
```

Tool handlers wrap all service calls in `try/catch` and return results via `handleToolError(err, toolName)` — errors surface as `isError: true` text content, never as thrown exceptions to the MCP transport.

## Dependency Injection

A single `httpClient` (axios instance) is created once in `src/lib/container.ts` and shared across all 7 service singletons. This ensures a single auth configuration and simplifies testing via `AxiosInstance` mock injection.

## Testing Strategy

- **Unit tests** (`src/tools/<module>/__tests__/*.spec.ts`): Test service classes directly with a mocked `AxiosInstance`. No MCP transport or real HTTP.
- **Integration tests** (`tests/integration/*.test.ts`): Instantiate `McpServer`, call `registerXTools()`, and assert that the correct tool names appear in `_registeredTools`.
- **Smoke test** (CI): Build, pipe a JSON-RPC `initialize` message to `dist/stdio.js` via `timeout 5`, assert process exits cleanly.
