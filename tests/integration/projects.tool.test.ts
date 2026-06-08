import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerProjectsTools } from '../../src/tools/projects/projects.tool.js';

vi.mock('../../src/lib/container.js', () => ({
  projectsService: {
    listProjects: vi.fn().mockResolvedValue([]),
    getProject: vi.fn().mockResolvedValue({ id: 300, name: 'Test Project' }),
    listPhases: vi.fn().mockResolvedValue([]),
    listProjectTickets: vi.fn().mockResolvedValue([]),
  },
}));

describe('projects tool integration', () => {
  let server: McpServer;

  beforeAll(() => {
    server = new McpServer({ name: 'test-server', version: '0.0.0' });
    registerProjectsTools(server);
  });

  it('server instance is created without error', () => {
    expect(server).toBeDefined();
  });

  it('registers 4 projects tools', () => {
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    expect('prj-list-projects' in registered).toBe(true);
    expect('prj-get-project' in registered).toBe(true);
    expect('prj-list-phases' in registered).toBe(true);
    expect('prj-list-tickets' in registered).toBe(true);
  });
});
