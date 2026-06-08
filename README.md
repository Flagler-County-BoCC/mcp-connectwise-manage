# mcp-connectwise-manage

> Model Context Protocol (MCP) stdio server for ConnectWise Manage — exposes service desk, time, agreements, companies, projects, sales, and setup operations as typed MCP tools for AI agents.

![CI](https://github.com/Flagler-County-BoCC/mcp-connectwise-manage/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/Flagler-County-BoCC/mcp-connectwise-manage)
![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [MCP Configuration](#mcp-configuration)
- [Tool Reference](#tool-reference)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

`mcp-connectwise-manage` bridges AI assistants (Claude, Cursor, and other MCP-compatible clients) with ConnectWise Manage's REST API. It exposes 25 typed MCP tools across 7 modules, with built-in write safeguards, profile-based access control, and structured logging — all communicating over stdin/stdout using the Model Context Protocol.

Key design decisions:

- **Stdio-only transport** — no HTTP server, no open ports.
- **Write safeguards** — all mutating tools require `confirm=true` or `dryRun=true`.
- **Profile filtering** — tool exposure is scoped per `CW_ACTIVE_PROFILE` without restarting.
- **Type-safe throughout** — Zod validates every tool input; TypeScript strict mode enforced.

## Requirements

- Node.js >= 22.0.0
- A ConnectWise Manage instance with API access
- A ConnectWise API Member with appropriate permissions
- A ConnectWise `clientId` (register at [developer.connectwise.com](https://developer.connectwise.com))

## Installation

```bash
git clone https://github.com/Flagler-County-BoCC/mcp-connectwise-manage.git
cd mcp-connectwise-manage
npm install
cp .env.example .env
# Edit .env with your ConnectWise credentials
npm run build
```

## Configuration

All configuration is via environment variables. Copy `.env.example` to `.env` and fill in the required values.

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for the full variable reference.

**Minimum required variables:**

| Variable | Description |
|---|---|
| `CW_server` | ConnectWise server hostname (e.g. `na.myconnectwise.net`) |
| `CW_company` | ConnectWise company identifier |
| `CW_clientId` | API client ID from developer.connectwise.com |
| `CW_pub` | API public key |
| `CW_priv` | API private key |
| `SPEC_PATH` | Absolute path to the ConnectWise OpenAPI JSON spec |

## MCP Configuration

### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "cw-manage": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-connectwise-manage/dist/stdio.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info",
        "CW_server": "na.myconnectwise.net",
        "CW_company": "yourcompany",
        "CW_clientId": "your-client-id",
        "CW_pub": "your-public-key",
        "CW_priv": "your-private-key",
        "SPEC_PATH": "/absolute/path/to/connectwise-openapi.json"
      }
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "cw-manage": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-connectwise-manage/dist/stdio.js"],
      "env": {
        "NODE_ENV": "production",
        "CW_server": "na.myconnectwise.net",
        "CW_company": "yourcompany",
        "CW_clientId": "your-client-id",
        "CW_pub": "your-public-key",
        "CW_priv": "your-private-key",
        "SPEC_PATH": "/absolute/path/to/connectwise-openapi.json"
      }
    }
  }
}
```

### Automated setup (Claude Code / Claude Desktop)

```bash
npm run setup
```

This builds the project and registers it in Claude Desktop and Claude Code (`~/.claude.json`), and installs slash commands to `~/.claude/commands/`.

To remove all registrations:

```bash
npm run uninstall
```

## Tool Reference

See [docs/API.md](docs/API.md) for the full tool reference with input/output schemas and examples.

**Available tool modules:**

| Prefix | Module | Tools |
|---|---|---|
| `agr-` | Agreements | list-agreements, get-agreement, list-additions |
| `co-` | Companies | list-companies, get-company, list-contacts |
| `prj-` | Projects | list-projects, get-project, list-phases, list-tickets |
| `sal-` | Sales | list-opportunities, get-opportunity, list-quotes |
| `svc-` | Service Desk | list-tickets, get-ticket, list-boards, list-statuses, list-priorities, list-impacts, list-members |
| `setup-` | Setup | list-tables, list-locations, list-departments, list-work-types, list-work-roles |
| `time-` | Time | list-entries, list-periods, create-entry, update-entry |

## Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run integration tests only
npm run test:integration

# Type-check without building
npm run typecheck
```

Unit tests mock the HTTP layer — no real ConnectWise credentials are required to run tests.

## Project Structure

```
src/
├── config/          # Zod env schema + typed config object
├── errors/          # AppError hierarchy (Forbidden, NotFound, Validation, ExternalService)
├── lib/             # Shared utilities (http-client, logger, container, profile, validate)
├── tools/           # One directory per module
│   └── <module>/
│       ├── <module>.schema.ts   # Zod input schemas
│       ├── <module>.service.ts  # Business logic + CW API calls
│       ├── <module>.tool.ts     # MCP tool registrations
│       └── <module>.types.ts    # TypeScript response types
├── server.ts        # createServer() — tool registry, profile gating
└── stdio.ts         # Entry point — transport, signals, startup log
scripts/
├── setup.ts         # Register in Claude Desktop + Claude Code
└── uninstall.ts     # Remove registrations
templates/
└── .claude/commands/  # Slash command templates
tests/
├── integration/     # McpServer registration smoke tests
└── setup.ts         # Test environment bootstrap
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
