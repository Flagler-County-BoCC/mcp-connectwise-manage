import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerAgreementsTools } from '../../src/tools/agreements/agreements.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  agreementsService: {
    listAgreements: vi.fn().mockResolvedValue([]),
    getAgreement: vi.fn().mockResolvedValue({ id: 200, name: 'Test' }),
    listAdditions: vi.fn().mockResolvedValue([]),
  },
}));

describe('agreements tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerAgreementsTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 3 agreements tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('agr-list-agreements' in registered).toBe(true);
    expect('agr-get-agreement' in registered).toBe(true);
    expect('agr-list-additions' in registered).toBe(true);
  });
});
