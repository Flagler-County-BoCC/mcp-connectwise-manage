import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { serviceDeskService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  GetTicketSchema,
  ListBoardsSchema,
  ListImpactsSchema,
  ListMembersSchema,
  ListPrioritiesSchema,
  ListStatusesSchema,
  ListTicketsSchema,
} from './service.schema.js';

const log = createLogger({ module: 'serviceTool' });

export function registerServiceTools(server: McpServer): void {
  server.tool(
    'svc-list-tickets',
    'List service desk tickets with optional filters for board, status, priority, company, summary, and assigned technician. Returns paginated JSON.',
    ListTicketsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListTicketsSchema, params);
      log.debug({ input }, 'svc-list-tickets called');
      try {
        const result = await serviceDeskService.listTickets(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-list-tickets');
      }
    },
  );

  server.tool(
    'svc-get-ticket',
    'Get a single service ticket by its numeric ID.',
    GetTicketSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(GetTicketSchema, params);
      log.debug({ input }, 'svc-get-ticket called');
      try {
        const result = await serviceDeskService.getTicket(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-get-ticket');
      }
    },
  );

  server.tool(
    'svc-list-boards',
    'List available service boards, optionally filtered by name.',
    ListBoardsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListBoardsSchema, params);
      log.debug({ input }, 'svc-list-boards called');
      try {
        const result = await serviceDeskService.listBoards(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-list-boards');
      }
    },
  );

  server.tool(
    'svc-list-statuses',
    'List ticket statuses for a given service board ID.',
    ListStatusesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListStatusesSchema, params);
      log.debug({ input }, 'svc-list-statuses called');
      try {
        const result = await serviceDeskService.listStatuses(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-list-statuses');
      }
    },
  );

  server.tool(
    'svc-list-priorities',
    'List all ticket priority levels.',
    ListPrioritiesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListPrioritiesSchema, params);
      log.debug({ input }, 'svc-list-priorities called');
      try {
        const result = await serviceDeskService.listPriorities(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-list-priorities');
      }
    },
  );

  server.tool(
    'svc-list-impacts',
    'List all ticket impact levels.',
    ListImpactsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListImpactsSchema, params);
      log.debug({ input }, 'svc-list-impacts called');
      try {
        const result = await serviceDeskService.listImpacts(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-list-impacts');
      }
    },
  );

  server.tool(
    'svc-list-members',
    'List ConnectWise Manage system members (technicians), optionally filtered by identifier, first name, or last name.',
    ListMembersSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListMembersSchema, params);
      log.debug({ input }, 'svc-list-members called');
      try {
        const result = await serviceDeskService.listMembers(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'svc-list-members');
      }
    },
  );
}
