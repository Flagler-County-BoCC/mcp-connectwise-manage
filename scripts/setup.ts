/**
 * Registers mcp-connectwise-manage in Claude Desktop and Claude Code CLI.
 * Also installs project slash commands to ~/.claude/commands/ for global availability.
 * Run with: npm run setup
 *
 * Claude Desktop config: claude_desktop_config.json (per-OS path)
 * Claude Code config:    ~/.claude.json (mcpServers key, type: "stdio")
 * Slash commands:        ~/.claude/commands/  (global — available in every project)
 *
 * Writes a .bak backup before modifying any config file.
 * Requires dist/stdio.js to be built first (handled by `npm run setup`).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BINARY = path.join(ROOT, 'dist', 'stdio.js');
const SERVER_KEY = 'cw-manage';
const TEMPLATES_DIR = path.join(ROOT, 'templates', '.claude', 'commands');
const GLOBAL_COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands');

function getClaudeDesktopConfigPath(): string {
  switch (process.platform) {
    case 'darwin':
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'Claude',
        'claude_desktop_config.json',
      );
    case 'win32':
      return path.join(
        process.env['APPDATA'] ?? path.join(os.homedir(), 'AppData', 'Roaming'),
        'Claude',
        'claude_desktop_config.json',
      );
    default:
      return path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
}

function getClaudeCodeConfigPath(): string {
  // ~/.claude.json — NOT ~/.claude/settings.json (that file is for preferences, not MCP servers)
  return path.join(os.homedir(), '.claude.json');
}

/** Parse key=value lines from a .env file, ignoring comments and blank lines. */
function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key) env[key] = val;
  }
  return env;
}

function readJson(filePath: string): Record<string, unknown> {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, 'utf-8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.error(`\n  Config at ${filePath} is not valid JSON — fix manually before re-running.\n`);
    process.exit(1);
  }
}

function writeJson(filePath: string, data: Record<string, unknown>): void {
  const backupPath = `${filePath}.bak`;
  if (fs.existsSync(filePath)) fs.copyFileSync(filePath, backupPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function buildServerEntry(
  extra: Record<string, unknown>,
  env: Record<string, string>,
): Record<string, unknown> {
  const entry: Record<string, unknown> = { command: 'node', args: [BINARY], ...extra };
  if (Object.keys(env).length > 0) entry['env'] = env;
  return entry;
}

function registerDesktop(configPath: string, env: Record<string, string>): void {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    console.warn(`\n  Claude Desktop: config directory not found — may not be installed. Skipping.`);
    return;
  }
  const cfg = readJson(configPath);
  const mcpServers = (cfg['mcpServers'] as Record<string, unknown> | undefined) ?? {};
  const isUpdate = SERVER_KEY in mcpServers;
  mcpServers[SERVER_KEY] = buildServerEntry({}, env);
  cfg['mcpServers'] = mcpServers;
  writeJson(configPath, cfg);
  console.log(`\n  ${isUpdate ? 'Updated' : 'Registered'} in Claude Desktop`);
  console.log(`  Config: ${configPath}`);
}

function registerClaudeCode(configPath: string, env: Record<string, string>): void {
  const cfg = readJson(configPath);
  const mcpServers = (cfg['mcpServers'] as Record<string, unknown> | undefined) ?? {};
  const isUpdate = SERVER_KEY in mcpServers;
  // Claude Code requires type: "stdio" for local process servers
  mcpServers[SERVER_KEY] = buildServerEntry({ type: 'stdio' }, env);
  cfg['mcpServers'] = mcpServers;
  writeJson(configPath, cfg);
  console.log(`\n  ${isUpdate ? 'Updated' : 'Registered'} in Claude Code`);
  console.log(`  Config: ${configPath}`);
}

function installCommands(): void {
  if (!fs.existsSync(TEMPLATES_DIR)) return;
  fs.mkdirSync(GLOBAL_COMMANDS_DIR, { recursive: true });
  const files = fs.readdirSync(TEMPLATES_DIR).filter((f) => f.endsWith('.md'));
  if (!files.length) return;
  const installed: string[] = [];
  const updated: string[] = [];
  for (const file of files) {
    const dest = path.join(GLOBAL_COMMANDS_DIR, file);
    const isUpdate = fs.existsSync(dest);
    fs.copyFileSync(path.join(TEMPLATES_DIR, file), dest);
    (isUpdate ? updated : installed).push(file.replace('.md', ''));
  }
  console.log(`\n  Slash commands → ${GLOBAL_COMMANDS_DIR}`);
  if (installed.length) console.log(`  Installed: ${installed.map((f) => `/${f}`).join('  ')}`);
  if (updated.length) console.log(`  Updated:   ${updated.map((f) => `/${f}`).join('  ')}`);
}

function main(): void {
  if (!fs.existsSync(BINARY)) {
    console.error(`\n  Binary not found: ${BINARY}`);
    console.error('  Run `npm run build` before `npm run setup`.\n');
    process.exit(1);
  }

  const envPath = path.join(ROOT, '.env');
  const env = parseEnvFile(envPath);
  const envKeys = Object.keys(env);

  console.log('\nmcp-connectwise-manage — setup');
  console.log('─'.repeat(40));

  if (envKeys.length > 0) {
    console.log(`\n  Embedding ${envKeys.length} env vars from .env into MCP config`);
  } else {
    console.warn('\n  No .env file found — env vars must be set manually in MCP client config');
  }

  registerDesktop(getClaudeDesktopConfigPath(), env);
  registerClaudeCode(getClaudeCodeConfigPath(), env);
  installCommands();

  console.log(`\n  Binary: ${BINARY}`);
  console.log('\n  Restart Claude Desktop to apply the change.');
  console.log('  Claude Code picks up the change automatically.\n');
}

main();
