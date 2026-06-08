import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { agreementsService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  GetAgreementSchema,
  ListAgreementAdditionsSchema,
  ListAgreementsSchema,
} from './agreements.schema.js';

const log = createLogger({ module: 'agreementsTool' });

export function registerAgreementsTools(server: McpServer): void {
  server.tool(
    'agr-list-agreements',
    'List finance agreements with optional filters for company, name, and type. Returns paginated JSON.',
    ListAgreementsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListAgreementsSchema, params);
      log.debug({ input }, 'agr-list-agreements called');
      try {
        const result = await agreementsService.listAgreements(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'agr-list-agreements');
      }
    },
  );

  server.tool(
    'agr-get-agreement',
    'Get a single agreement by its numeric ID.',
    GetAgreementSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(GetAgreementSchema, params);
      log.debug({ input }, 'agr-get-agreement called');
      try {
        const result = await agreementsService.getAgreement(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'agr-get-agreement');
      }
    },
  );

  server.tool(
    'agr-list-additions',
    'List additions (line items) for a specific agreement ID.',
    ListAgreementAdditionsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListAgreementAdditionsSchema, params);
      log.debug({ input }, 'agr-list-additions called');
      try {
        const result = await agreementsService.listAdditions(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'agr-list-additions');
      }
    },
  );
}
