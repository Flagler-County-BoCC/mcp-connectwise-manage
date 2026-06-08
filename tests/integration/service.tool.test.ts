import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerServiceTools } from '../../src/tools/service/service.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  serviceDeskService: {
    listTickets: vi.fn().mockResolvedValue([]),
    getTicket: vi.fn().mockResolvedValue({ id: 1001, summary: 'Test' }),
    listBoards: vi.fn().mockResolvedValue([]),
    listStatuses: vi.fn().mockResolvedValue([]),
    listPriorities: vi.fn().mockResolvedValue([]),
    listImpacts: vi.fn().mockResolvedValue([]),
    listMembers: vi.fn().mockResolvedValue([]),
  },
}));

describe('service tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerServiceTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 7 service tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('svc-list-tickets' in registered).toBe(true);
    expect('svc-get-ticket' in registered).toBe(true);
    expect('svc-list-boards' in registered).toBe(true);
    expect('svc-list-statuses' in registered).toBe(true);
    expect('svc-list-priorities' in registered).toBe(true);
    expect('svc-list-impacts' in registered).toBe(true);
    expect('svc-list-members' in registered).toBe(true);
  });
});
