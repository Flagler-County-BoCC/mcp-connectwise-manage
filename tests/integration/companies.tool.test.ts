import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerCompaniesTools } from '../../src/tools/companies/companies.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  companiesService: {
    listCompanies: vi.fn().mockResolvedValue([]),
    getCompany: vi.fn().mockResolvedValue({ id: 10, name: 'Test Corp' }),
    listContacts: vi.fn().mockResolvedValue([]),
  },
}));

describe('companies tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerCompaniesTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 3 companies tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('co-list-companies' in registered).toBe(true);
    expect('co-get-company' in registered).toBe(true);
    expect('co-list-contacts' in registered).toBe(true);
  });
});
