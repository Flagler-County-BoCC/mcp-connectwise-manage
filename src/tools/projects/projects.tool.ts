import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { projectsService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  GetProjectSchema,
  ListProjectPhasesSchema,
  ListProjectTicketsSchema,
  ListProjectsSchema,
} from './projects.schema.js';

const log = createLogger({ module: 'projectsTool' });

export function registerProjectsTools(server: McpServer): void {
  server.tool(
    'prj-list-projects',
    'List projects with optional filters for name, status, company, and manager. Returns paginated JSON.',
    ListProjectsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListProjectsSchema, params);
      log.debug({ input }, 'prj-list-projects called');
      try {
        const result = await projectsService.listProjects(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'prj-list-projects');
      }
    },
  );

  server.tool(
    'prj-get-project',
    'Get a single project by its numeric ID.',
    GetProjectSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(GetProjectSchema, params);
      log.debug({ input }, 'prj-get-project called');
      try {
        const result = await projectsService.getProject(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'prj-get-project');
      }
    },
  );

  server.tool(
    'prj-list-phases',
    'List phases for a given project ID.',
    ListProjectPhasesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListProjectPhasesSchema, params);
      log.debug({ input }, 'prj-list-phases called');
      try {
        const result = await projectsService.listPhases(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'prj-list-phases');
      }
    },
  );

  server.tool(
    'prj-list-tickets',
    'List service tickets associated with a given project ID.',
    ListProjectTicketsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListProjectTicketsSchema, params);
      log.debug({ input }, 'prj-list-tickets called');
      try {
        const result = await projectsService.listProjectTickets(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'prj-list-tickets');
      }
    },
  );
}
