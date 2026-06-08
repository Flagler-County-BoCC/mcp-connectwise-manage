import { config } from '../config/index.js';
import { ForbiddenError } from '../errors/index.js';

/**
 * Checks `CW_WRITE_ALLOWLIST` before any mutating operation.
 * The allowlist is a JSON array of operation keys in the form "METHOD /path".
 * An empty allowlist (the default) permits all write operations.
 */
export function assertOperationAllowed(operationKey: string): void {
  const allowlist = config.mcp.writeAllowlist as string[];
  if (allowlist.length > 0 && !allowlist.includes(operationKey)) {
    throw new ForbiddenError(
      `Operation '${operationKey}' is not permitted by CW_WRITE_ALLOWLIST`,
      { operationKey },
    );
  }
}
