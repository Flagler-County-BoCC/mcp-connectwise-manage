import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { companiesService } from '../../lib/container.js';
import { createLogger } from '../../lib/logger.js';
import { handleToolError } from '../../lib/tool-error-handler.js';
import { validate } from '../../lib/validate.js';
import {
  GetCompanySchema,
  ListCompaniesSchema,
  ListContactsSchema,
} from './companies.schema.js';

const log = createLogger({ module: 'companiesTool' });

export function registerCompaniesTools(server: McpServer): void {
  server.tool(
    'co-list-companies',
    'List companies with optional filters for name, identifier, status, and type. Returns paginated JSON.',
    ListCompaniesSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListCompaniesSchema, params);
      log.debug({ input }, 'co-list-companies called');
      try {
        const result = await companiesService.listCompanies(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'co-list-companies');
      }
    },
  );

  server.tool(
    'co-get-company',
    'Get a single company record by its numeric ID.',
    GetCompanySchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(GetCompanySchema, params);
      log.debug({ input }, 'co-get-company called');
      try {
        const result = await companiesService.getCompany(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'co-get-company');
      }
    },
  );

  server.tool(
    'co-list-contacts',
    'List contacts with optional filters for company, first name, last name, and email. Returns paginated JSON.',
    ListContactsSchema.shape,
    async (params): Promise<CallToolResult> => {
      const input = validate(ListContactsSchema, params);
      log.debug({ input }, 'co-list-contacts called');
      try {
        const result = await companiesService.listContacts(input);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return handleToolError(err, 'co-list-contacts');
      }
    },
  );
}
