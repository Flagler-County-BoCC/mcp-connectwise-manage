# Environment Variables

Copy `.env.example` to `.env` and fill in the values. Variables marked **Required** have no default and will cause the server to exit on startup if missing.

## ConnectWise Credentials

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_server` | Yes | — | ConnectWise server hostname (e.g. `na.myconnectwise.net`) |
| `CW_company` | Yes | — | ConnectWise company identifier (shown in the URL after login) |
| `CW_clientId` | Yes | — | API client ID — register at [developer.connectwise.com](https://developer.connectwise.com) |
| `CW_pub` | Yes | — | API public key (min 8 chars) |
| `CW_priv` | Yes | — | API private key (min 8 chars) |

Authentication uses HTTP Basic Auth: `{company}+{pub}:{priv}` plus a `clientId` header.

## OpenAPI Spec

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPEC_PATH` | Yes | — | Absolute path to the ConnectWise Manage OpenAPI JSON spec file |

## API Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_API_PATH` | No | `v4_6_release` | ConnectWise API version path segment |
| `CW_TIMEOUT_MS` | No | `30000` | HTTP request timeout in milliseconds |
| `CW_MAX_CONCURRENCY` | No | `5` | Maximum concurrent outbound API requests |
| `CW_HEADERS_ALLOWLIST` | No | `Accept` | Comma-separated list of allowed response headers |

## Pagination Defaults

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_DEFAULT_PAGE_SIZE` | No | `50` | Default results per page for list tools |
| `CW_MAX_PAGE_SIZE` | No | `100` | Maximum allowed `pageSize` value |
| `CW_TOTAL_ROWS_LIMIT` | No | `500` | Maximum total rows returned across paginated calls |
| `CW_DEFAULT_TIME_WINDOW_DAYS` | No | `30` | Default lookback window for time-based queries (days) |

## Service Desk Defaults

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_DEFAULT_SERVICE_BOARD` | No | `Managed Services` | Default service board name for ticket queries |
| `CW_DEFAULT_SERVICE_DEPARTMENT` | No | `Managed Services` | Default department for service queries |
| `CW_DEFAULT_COMPANY_SCOPE` | No | `All Companies` | Default company scope for cross-company queries |

## Module Exposure

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_ENABLED_MODULES` | No | `service,time,agreements,companies,projects,sales,setup` | Comma-separated list of enabled tool modules |
| `CW_ALLOWED_OPERATIONS` | No | `[]` | JSON array of allowed operation identifiers (empty = all) |

## Profile Configuration

Profiles restrict which tool modules are available without restarting the server.

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_PROFILES` | No | `{"admin":[""]}` | JSON object mapping profile names to tool-prefix arrays |
| `CW_ACTIVE_PROFILE` | No | `technician` | Name of the active profile |

**Profile format:** Each profile is an array of tool-name prefixes. An empty string (`""`) or empty array grants access to all tools.

```json
{
  "admin":      [""],
  "technician": ["svc-", "time-"],
  "sales":      ["sal-", "co-"],
  "readonly":   ["svc-list-", "prj-list-", "agr-list-"]
}
```

## Write Safeguards

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_REQUIRE_CONFIRM_WRITES` | No | `true` | Require `confirm=true` on all write tool calls |
| `CW_ENABLE_DRY_RUN` | No | `true` | Enable `dryRun=true` for write tools to preview without executing |
| `CW_WRITE_ALLOWLIST` | No | `[]` | JSON array of allowed write operations (e.g. `["POST /time/entries"]`). Empty = all writes allowed. |
| `CW_BLACKOUT_WINDOWS` | No | `[]` | JSON array of blackout time windows (ISO 8601 intervals) during which writes are blocked |

## Rate Limiting

| Variable | Required | Default | Description |
|---|---|---|---|
| `CW_RATE_LIMIT_BURST_RPS` | No | `5` | Maximum requests per second (burst) |
| `CW_RATE_LIMIT_SUSTAINED_RPM` | No | `60` | Maximum requests per minute (sustained) |

## Logging

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `test`, or `production` |
| `LOG_LEVEL` | No | `info` | Pino log level: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent` |

All log output goes to **stderr**. stdout is reserved for MCP JSON-RPC protocol messages.
