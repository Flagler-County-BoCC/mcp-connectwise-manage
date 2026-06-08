import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerSetupTools } from '../../src/tools/setup/setup.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  setupService: {
    listSetupTables: vi.fn().mockResolvedValue([]),
    listLocations: vi.fn().mockResolvedValue([]),
    listDepartments: vi.fn().mockResolvedValue([]),
    listWorkTypes: vi.fn().mockResolvedValue([]),
    listWorkRoles: vi.fn().mockResolvedValue([]),
  },
}));

describe('setup tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerSetupTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 5 setup tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('setup-list-tables' in registered).toBe(true);
    expect('setup-list-locations' in registered).toBe(true);
    expect('setup-list-departments' in registered).toBe(true);
    expect('setup-list-work-types' in registered).toBe(true);
    expect('setup-list-work-roles' in registered).toBe(true);
  });
});
