import type { AxiosInstance } from 'axios';
import { NotFoundError } from '../../errors/index.js';
import { createLogger } from '../../lib/logger.js';
import type {
  GetCompanyInput,
  ListCompaniesInput,
  ListContactsInput,
} from './companies.schema.js';
import type { CwCompany, CwContact } from './companies.types.js';

export class CompaniesService {
  private readonly log = createLogger({ module: 'companiesService' });

  constructor(private readonly http: AxiosInstance) {}

  async listCompanies(input: ListCompaniesInput): Promise<CwCompany[]> {
    const conditions = this.buildCompanyConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing companies');
    const { data } = await this.http.get<CwCompany[]>('/company/companies', { params });
    return data;
  }

  async getCompany(input: GetCompanyInput): Promise<CwCompany> {
    this.log.debug({ companyId: input.companyId }, 'Getting company');
    const { data } = await this.http
      .get<CwCompany>(`/company/companies/${input.companyId}`)
      .catch(() => {
        throw new NotFoundError(`Company #${input.companyId} not found`);
      });
    return data;
  }

  async listContacts(input: ListContactsInput): Promise<CwContact[]> {
    const conditions = this.buildContactConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing contacts');
    const { data } = await this.http.get<CwContact[]>('/company/contacts', { params });
    return data;
  }

  private buildCompanyConditions(input: ListCompaniesInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.name) parts.push(`name contains "${input.name}"`);
    if (input.identifier) parts.push(`identifier contains "${input.identifier}"`);
    if (input.status) parts.push(`status/name contains "${input.status}"`);
    if (input.type) parts.push(`type/name contains "${input.type}"`);
    return parts.join(' and ');
  }

  private buildContactConditions(input: ListContactsInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.companyId !== undefined) parts.push(`company/id = ${input.companyId}`);
    if (input.firstName) parts.push(`firstName contains "${input.firstName}"`);
    if (input.lastName) parts.push(`lastName contains "${input.lastName}"`);
    if (input.email) parts.push(`communicationItems/value = "${input.email}"`);
    return parts.join(' and ');
  }
}
