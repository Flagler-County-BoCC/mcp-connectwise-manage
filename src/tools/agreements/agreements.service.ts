import type { AxiosInstance } from 'axios';
import { NotFoundError } from '../../errors/index.js';
import { createLogger } from '../../lib/logger.js';
import type {
  GetAgreementInput,
  ListAgreementAdditionsInput,
  ListAgreementsInput,
} from './agreements.schema.js';
import type { CwAgreement, CwAgreementAddition } from './agreements.types.js';

export class AgreementsService {
  private readonly log = createLogger({ module: 'agreementsService' });

  constructor(private readonly http: AxiosInstance) {}

  async listAgreements(input: ListAgreementsInput): Promise<CwAgreement[]> {
    const conditions = this.buildConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing agreements');
    const { data } = await this.http.get<CwAgreement[]>('/finance/agreements', { params });
    return data;
  }

  async getAgreement(input: GetAgreementInput): Promise<CwAgreement> {
    this.log.debug({ agreementId: input.agreementId }, 'Getting agreement');
    const { data } = await this.http
      .get<CwAgreement>(`/finance/agreements/${input.agreementId}`)
      .catch(() => {
        throw new NotFoundError(`Agreement #${input.agreementId} not found`);
      });
    return data;
  }

  async listAdditions(input: ListAgreementAdditionsInput): Promise<CwAgreementAddition[]> {
    const params = { page: input.page, pageSize: input.pageSize };
    const { data } = await this.http.get<CwAgreementAddition[]>(
      `/finance/agreements/${input.agreementId}/additions`,
      { params },
    );
    return data;
  }

  private buildConditions(input: ListAgreementsInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.company) parts.push(`company/name contains "${input.company}"`);
    if (input.name) parts.push(`name contains "${input.name}"`);
    if (input.type) parts.push(`type/name contains "${input.type}"`);
    return parts.join(' and ');
  }
}
