import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerTimeTools } from '../../src/tools/time/time.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  timeService: {
    listEntries: vi.fn().mockResolvedValue([]),
    listPeriods: vi.fn().mockResolvedValue([]),
    createEntry: vi.fn().mockResolvedValue({ id: 999 }),
    updateEntry: vi.fn().mockResolvedValue({ id: 999 }),
  },
}));

describe('time tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerTimeTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 4 time tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('time-list-entries' in registered).toBe(true);
    expect('time-list-periods' in registered).toBe(true);
    expect('time-create-entry' in registered).toBe(true);
    expect('time-update-entry' in registered).toBe(true);
  });
});
