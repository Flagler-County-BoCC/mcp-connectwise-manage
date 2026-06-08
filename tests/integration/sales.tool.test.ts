import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerSalesTools } from '../../src/tools/sales/sales.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  salesService: {
    listOpportunities: vi.fn().mockResolvedValue([]),
    getOpportunity: vi.fn().mockResolvedValue({ id: 400, name: 'Test Deal' }),
    listQuotes: vi.fn().mockResolvedValue([]),
  },
}));

describe('sales tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerSalesTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 3 sales tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('sal-list-opportunities' in registered).toBe(true);
    expect('sal-get-opportunity' in registered).toBe(true);
    expect('sal-list-quotes' in registered).toBe(true);
  });
});
