import type { AxiosInstance } from 'axios';
import { NotFoundError } from '../../errors/index.js';
import { createLogger } from '../../lib/logger.js';
import type {
  GetOpportunityInput,
  ListOpportunitiesInput,
  ListQuotesInput,
} from './sales.schema.js';
import type { CwOpportunity, CwQuote } from './sales.types.js';

export class SalesService {
  private readonly log = createLogger({ module: 'salesService' });

  constructor(private readonly http: AxiosInstance) {}

  async listOpportunities(input: ListOpportunitiesInput): Promise<CwOpportunity[]> {
    const conditions = this.buildConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing opportunities');
    const { data } = await this.http.get<CwOpportunity[]>('/sales/opportunities', { params });
    return data;
  }

  async getOpportunity(input: GetOpportunityInput): Promise<CwOpportunity> {
    this.log.debug({ opportunityId: input.opportunityId }, 'Getting opportunity');
    const { data } = await this.http
      .get<CwOpportunity>(`/sales/opportunities/${input.opportunityId}`)
      .catch(() => {
        throw new NotFoundError(`Opportunity #${input.opportunityId} not found`);
      });
    return data;
  }

  async listQuotes(input: ListQuotesInput): Promise<CwQuote[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.name) params['conditions'] = `name contains "${input.name}"`;
    if (input.conditions) params['conditions'] = input.conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    const { data } = await this.http.get<CwQuote[]>('/sales/quotes', { params });
    return data;
  }

  private buildConditions(input: ListOpportunitiesInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.name) parts.push(`name contains "${input.name}"`);
    if (input.company) parts.push(`company/name contains "${input.company}"`);
    if (input.status) parts.push(`status/name = "${input.status}"`);
    if (input.assignedTo) parts.push(`primarySalesRep/identifier = "${input.assignedTo}"`);
    return parts.join(' and ');
  }
}
