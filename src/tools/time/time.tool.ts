import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { config } from '../../config/index.js';
import { timeService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  CreateTimeEntrySchema,
  ListTimeEntriesSchema,
  ListTimePeriodsSchema,
  UpdateTimeEntrySchema,
} from './time.schema.js';

const log = createLogger({ module: 'timeTool' });

export function registerTimeTools(server: McpServer): void {
  server.tool(
    'time-list-entries',
    'List time entries with optional filters for member, ticket, and date range. Returns paginated JSON.',
    ListTimeEntriesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListTimeEntriesSchema, params);
      log.debug({ input }, 'time-list-entries called');
      try {
        const result = await timeService.listEntries(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'time-list-entries');
      }
    },
  );

  server.tool(
    'time-list-periods',
    'List available time periods (pay periods).',
    ListTimePeriodsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListTimePeriodsSchema, params);
      log.debug({ input }, 'time-list-periods called');
      try {
        const result = await timeService.listPeriods(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'time-list-periods');
      }
    },
  );

  server.tool(
    'time-create-entry',
    'Create a new time entry on a service ticket. Requires confirm=true to execute, or dryRun=true to preview the payload without posting.',
    CreateTimeEntrySchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(CreateTimeEntrySchema, params);
      log.debug({ ticketId: input.ticketId, memberId: input.memberId }, 'time-create-entry called');

      if (config.mcp.requireConfirm && !input.confirm && !input.dryRun) {
        return {
          content: [{
            type: 'text',
            text: 'This operation will create a time entry and cannot be undone.\nRe-invoke with confirm=true to proceed, or dryRun=true to preview the payload.',
          }],
          isError: false,
        };
      }

      try {
        const result = await timeService.createEntry(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'time-create-entry');
      }
    },
  );

  server.tool(
    'time-update-entry',
    'Update an existing time entry by ID. Requires confirm=true to execute, or dryRun=true to preview the changes.',
    UpdateTimeEntrySchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(UpdateTimeEntrySchema, params);
      log.debug({ entryId: input.entryId }, 'time-update-entry called');

      if (config.mcp.requireConfirm && !input.confirm && !input.dryRun) {
        return {
          content: [{
            type: 'text',
            text: 'This operation will modify an existing time entry.\nRe-invoke with confirm=true to proceed, or dryRun=true to preview the changes.',
          }],
          isError: false,
        };
      }

      try {
        const result = await timeService.updateEntry(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'time-update-entry');
      }
    },
  );
}
