import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { salesService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  GetOpportunitySchema,
  ListOpportunitiesSchema,
  ListQuotesSchema,
} from './sales.schema.js';

const log = createLogger({ module: 'salesTool' });

export function registerSalesTools(server: McpServer): void {
  server.tool(
    'sal-list-opportunities',
    'List sales opportunities with optional filters for name, company, status, and assigned rep. Returns paginated JSON.',
    ListOpportunitiesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListOpportunitiesSchema, params);
      log.debug({ input }, 'sal-list-opportunities called');
      try {
        const result = await salesService.listOpportunities(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'sal-list-opportunities');
      }
    },
  );

  server.tool(
    'sal-get-opportunity',
    'Get a single sales opportunity by its numeric ID.',
    GetOpportunitySchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(GetOpportunitySchema, params);
      log.debug({ input }, 'sal-get-opportunity called');
      try {
        const result = await salesService.getOpportunity(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'sal-get-opportunity');
      }
    },
  );

  server.tool(
    'sal-list-quotes',
    'List sales quotes with optional filters for name and conditions. Returns paginated JSON.',
    ListQuotesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListQuotesSchema, params);
      log.debug({ input }, 'sal-list-quotes called');
      try {
        const result = await salesService.listQuotes(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'sal-list-quotes');
      }
    },
  );
}
