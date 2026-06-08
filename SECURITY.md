# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x (current) | Yes |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email security reports to the maintainers via the contact on the [GitHub profile](https://github.com/Flagler-County-BoCC). Include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

You will receive an acknowledgement within 48 hours. Critical vulnerabilities will be patched and released within 7 days of confirmation. You will be credited in the release notes unless you request otherwise.

## Security Measures in This Project

**Input validation:** All tool inputs are validated with Zod schemas before any service call. Invalid inputs are rejected with a `VALIDATION_ERROR` before reaching the HTTP layer.

**Credential management:** ConnectWise API credentials (`CW_pub`, `CW_priv`, `CW_clientId`) are read exclusively from environment variables. They are never written to disk, logged, or included in error messages.

**Log redaction:** Pino is configured to redact `priv`, `pub`, `clientId`, `secret`, `token`, `password`, `privateKey`, and `clientSecret` fields from all log output. All log output goes to stderr — never to the MCP stdout channel.

**Write safeguards:** All mutating tool calls require `confirm=true` or `dryRun=true`. This prevents accidental writes from exploratory AI queries. The `CW_WRITE_ALLOWLIST` environment variable can further restrict which write operations are permitted at runtime.

**Profile-based access control:** Tool modules are gated by `CW_ACTIVE_PROFILE` at server startup. Profiles restrict tool exposure without requiring a restart or code change.

**Non-root container:** The Docker image runs as `appuser` (uid 1001) — never as root.

**Dependency auditing:** `npm audit` runs on every CI build. All dependencies are pinned with semver ranges and audited on lockfile generation.

**No eval:** The codebase contains no `eval()`, `new Function()`, or dynamic code execution of any kind.

## Threat Model

This server runs as a local process. The primary attack surface is:

1. **Malicious MCP client input** — mitigated by Zod input validation on every tool call.
2. **Credential exfiltration via logs** — mitigated by pino redaction and stderr-only logging.
3. **Unintended writes via AI hallucination** — mitigated by the `confirm`/`dryRun` write gate.
4. **Dependency supply chain** — mitigated by lockfile pinning and regular `npm audit`.
