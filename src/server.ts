import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { isToolAllowedForProfile } from './lib/profile.js';
import { registerAgreementsTools } from './tools/agreements/agreements.tool.js';
import { registerCompaniesTools } from './tools/companies/companies.tool.js';
import { registerProjectsTools } from './tools/projects/projects.tool.js';
import { registerSalesTools } from './tools/sales/sales.tool.js';
import { registerServiceTools } from './tools/service/service.tool.js';
import { registerSetupTools } from './tools/setup/setup.tool.js';
import { registerTimeTools } from './tools/time/time.tool.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: process.env['npm_package_name'] ?? 'mcp-connectwise-manage',
    version: process.env['npm_package_version'] ?? '0.0.0',
  });

  // Register tool modules in alphabetical order, gated by active profile
  if (isToolAllowedForProfile('agr-')) registerAgreementsTools(server);
  if (isToolAllowedForProfile('co-')) registerCompaniesTools(server);
  if (isToolAllowedForProfile('prj-')) registerProjectsTools(server);
  if (isToolAllowedForProfile('sal-')) registerSalesTools(server);
  if (isToolAllowedForProfile('setup-')) registerSetupTools(server);
  if (isToolAllowedForProfile('svc-')) registerServiceTools(server);
  if (isToolAllowedForProfile('time-')) registerTimeTools(server);

  return server;
}
