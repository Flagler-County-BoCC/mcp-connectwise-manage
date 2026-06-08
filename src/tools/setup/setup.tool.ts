import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { setupService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  ListDepartmentsSchema,
  ListLocationsSchema,
  ListSetupTablesSchema,
  ListWorkRolesSchema,
  ListWorkTypesSchema,
} from './setup.schema.js';

const log = createLogger({ module: 'setupTool' });

export function registerSetupTools(server: McpServer): void {
  server.tool(
    'setup-list-tables',
    'List ConnectWise setup tables with optional name filter.',
    ListSetupTablesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListSetupTablesSchema, params);
      log.debug({ input }, 'setup-list-tables called');
      try {
        const result = await setupService.listSetupTables(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'setup-list-tables');
      }
    },
  );

  server.tool(
    'setup-list-locations',
    'List system locations (offices/sites) with optional name filter.',
    ListLocationsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListLocationsSchema, params);
      log.debug({ input }, 'setup-list-locations called');
      try {
        const result = await setupService.listLocations(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'setup-list-locations');
      }
    },
  );

  server.tool(
    'setup-list-departments',
    'List system departments with optional name filter.',
    ListDepartmentsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListDepartmentsSchema, params);
      log.debug({ input }, 'setup-list-departments called');
      try {
        const result = await setupService.listDepartments(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'setup-list-departments');
      }
    },
  );

  server.tool(
    'setup-list-work-types',
    'List time work types with optional name filter.',
    ListWorkTypesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListWorkTypesSchema, params);
      log.debug({ input }, 'setup-list-work-types called');
      try {
        const result = await setupService.listWorkTypes(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'setup-list-work-types');
      }
    },
  );

  server.tool(
    'setup-list-work-roles',
    'List time work roles with optional name filter.',
    ListWorkRolesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListWorkRolesSchema, params);
      log.debug({ input }, 'setup-list-work-roles called');
      try {
        const result = await setupService.listWorkRoles(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'setup-list-work-roles');
      }
    },
  );
}
