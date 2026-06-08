import type { AxiosInstance } from 'axios';
import { ForbiddenError } from '../../errors/index.js';
import { createLogger } from '../../lib/logger.js';
import { config } from '../../config/index.js';
import { assertOperationAllowed } from '../../lib/write-allowlist.js';
import type {
  CreateTimeEntryInput,
  ListTimeEntriesInput,
  ListTimePeriodsInput,
  UpdateTimeEntryInput,
} from './time.schema.js';
import type { CwTimeEntry, CwTimePeriod, DryRunResult } from './time.types.js';

export class TimeService {
  private readonly log = createLogger({ module: 'timeService' });

  constructor(private readonly http: AxiosInstance) {}

  async listEntries(input: ListTimeEntriesInput): Promise<CwTimeEntry[]> {
    const conditions = this.buildEntryConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing time entries');
    const { data } = await this.http.get<CwTimeEntry[]>('/time/entries', { params });
    return data;
  }

  async listPeriods(input: ListTimePeriodsInput): Promise<CwTimePeriod[]> {
    const params = { page: input.page, pageSize: input.pageSize };
    const { data } = await this.http.get<CwTimePeriod[]>('/time/timePeriods', { params });
    return data;
  }

  async createEntry(input: CreateTimeEntryInput): Promise<CwTimeEntry | DryRunResult> {
    this.assertWritePermitted(input.confirm, input.dryRun, 'POST', '/time/entries');

    const payload = {
      chargeToId: input.ticketId,
      chargeToType: 'ServiceTicket',
      member: { id: input.memberId },
      timeStart: input.timeStart.toISOString(),
      timeEnd: input.timeEnd.toISOString(),
      hoursDeduct: input.hoursDeduct,
      billableOption: input.billableOption,
      ...(input.actualHours !== undefined && { actualHours: input.actualHours }),
      ...(input.notes !== undefined && { notes: input.notes }),
    };

    if (input.dryRun) {
      this.log.info({ payload }, '[DRY RUN] Would create time entry');
      return { dryRun: true, payload };
    }

    this.log.info({ ticketId: input.ticketId, memberId: input.memberId }, 'Creating time entry');
    const { data } = await this.http.post<CwTimeEntry>('/time/entries', payload);
    return data;
  }

  async updateEntry(input: UpdateTimeEntryInput): Promise<CwTimeEntry | DryRunResult> {
    this.assertWritePermitted(
      input.confirm,
      input.dryRun,
      'PATCH',
      `/time/entries/${input.entryId}`,
    );

    const body: Record<string, unknown> = {};
    if (input.notes !== undefined) body['notes'] = input.notes;
    if (input.hoursDeduct !== undefined) body['hoursDeduct'] = input.hoursDeduct;
    if (input.actualHours !== undefined) body['actualHours'] = input.actualHours;
    if (input.billableOption !== undefined) body['billableOption'] = input.billableOption;

    if (input.dryRun) {
      this.log.info({ entryId: input.entryId, body }, '[DRY RUN] Would update time entry');
      return { dryRun: true, payload: body };
    }

    this.log.info({ entryId: input.entryId }, 'Updating time entry');
    const { data } = await this.http.patch<CwTimeEntry>(`/time/entries/${input.entryId}`, body);
    return data;
  }

  private assertWritePermitted(
    confirm: boolean,
    dryRun: boolean,
    method: string,
    path: string,
  ): void {
    assertOperationAllowed(`${method} ${path}`);
    if (!dryRun && config.mcp.requireConfirm && !confirm) {
      throw new ForbiddenError(
        `Write operation requires confirm=true or dryRun=true (CW_REQUIRE_CONFIRM_WRITES is enabled)`,
        { method, path },
      );
    }
  }

  private buildEntryConditions(input: ListTimeEntriesInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.memberId !== undefined) parts.push(`member/id = ${input.memberId}`);
    if (input.ticketId !== undefined) parts.push(`chargeToId = ${input.ticketId}`);
    if (input.dateStart !== undefined) parts.push(`timeStart >= [${input.dateStart.toISOString()}]`);
    if (input.dateEnd !== undefined) parts.push(`timeEnd <= [${input.dateEnd.toISOString()}]`);
    return parts.join(' and ');
  }
}
