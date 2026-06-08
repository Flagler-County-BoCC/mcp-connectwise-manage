import type { AxiosInstance } from 'axios';
import { NotFoundError } from '../../errors/index.js';
import { createLogger } from '../../lib/logger.js';
import type {
  GetTicketInput,
  ListBoardsInput,
  ListImpactsInput,
  ListMembersInput,
  ListPrioritiesInput,
  ListStatusesInput,
  ListTicketsInput,
} from './service.schema.js';
import type { CwBoard, CwImpact, CwMember, CwPriority, CwStatus, CwTicket } from './service.types.js';

export class ServiceDeskService {
  private readonly log = createLogger({ module: 'serviceDeskService' });

  constructor(private readonly http: AxiosInstance) {}

  async listTickets(input: ListTicketsInput): Promise<CwTicket[]> {
    const conditions = this.buildTicketConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing service tickets');
    const { data } = await this.http.get<CwTicket[]>('/service/tickets', { params });
    return data;
  }

  async getTicket(input: GetTicketInput): Promise<CwTicket> {
    this.log.debug({ ticketId: input.ticketId }, 'Getting service ticket');
    const { data } = await this.http
      .get<CwTicket>(`/service/tickets/${input.ticketId}`)
      .catch(() => {
        throw new NotFoundError(`Ticket #${input.ticketId} not found`);
      });
    return data;
  }

  async listBoards(input: ListBoardsInput): Promise<CwBoard[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.name) params['conditions'] = `name contains "${input.name}"`;

    const { data } = await this.http.get<CwBoard[]>('/service/boards', { params });
    return data;
  }

  async listStatuses(input: ListStatusesInput): Promise<CwStatus[]> {
    const params = { page: input.page, pageSize: input.pageSize };
    const { data } = await this.http.get<CwStatus[]>(
      `/service/boards/${input.boardId}/statuses`,
      { params },
    );
    return data;
  }

  async listPriorities(input: ListPrioritiesInput): Promise<CwPriority[]> {
    const params = { page: input.page, pageSize: input.pageSize };
    const { data } = await this.http.get<CwPriority[]>('/service/priorities', { params });
    return data;
  }

  async listImpacts(input: ListImpactsInput): Promise<CwImpact[]> {
    const params = { page: input.page, pageSize: input.pageSize };
    const { data } = await this.http.get<CwImpact[]>('/service/tickets/impacts', { params });
    return data;
  }

  async listMembers(input: ListMembersInput): Promise<CwMember[]> {
    const parts: string[] = [];
    if (input.identifier) parts.push(`identifier contains "${input.identifier}"`);
    if (input.firstName) parts.push(`firstName contains "${input.firstName}"`);
    if (input.lastName) parts.push(`lastName contains "${input.lastName}"`);

    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (parts.length > 0) params['conditions'] = parts.join(' and ');

    const { data } = await this.http.get<CwMember[]>('/system/members', { params });
    return data;
  }

  private buildTicketConditions(input: ListTicketsInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.board) parts.push(`board/name contains "${input.board}"`);
    if (input.status) parts.push(`status/name contains "${input.status}"`);
    if (input.priority) parts.push(`priority/name contains "${input.priority}"`);
    if (input.company) parts.push(`company/name contains "${input.company}"`);
    if (input.summary) parts.push(`summary contains "${input.summary}"`);
    if (input.assignedTo) parts.push(`assignedTeamMember/identifier = "${input.assignedTo}"`);
    return parts.join(' and ');
  }
}
