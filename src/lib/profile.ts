import { config } from '../config/index.js';

export function isToolAllowedForProfile(toolNameOrPrefix: string): boolean {
  const profiles = config.mcp.profiles as Record<string, string[]> | undefined;
  const active = config.mcp.activeProfile;

  if (!profiles) return true;

  const prefixes = profiles[active];
  if (!prefixes) return false;

  // Empty prefix or a single empty-string entry = admin (allow all)
  if (prefixes.length === 0 || (prefixes.length === 1 && prefixes[0] === '')) return true;

  return prefixes.some((prefix) => toolNameOrPrefix.startsWith(prefix));
}
