import type { AxiosInstance } from 'axios';
import { NotFoundError } from '../../errors/index.js';
import { createLogger } from '../../lib/logger.js';
import type {
  GetProjectInput,
  ListProjectPhasesInput,
  ListProjectTicketsInput,
  ListProjectsInput,
} from './projects.schema.js';
import type { CwProject, CwProjectPhase, CwProjectTicket } from './projects.types.js';

export class ProjectsService {
  private readonly log = createLogger({ module: 'projectsService' });

  constructor(private readonly http: AxiosInstance) {}

  async listProjects(input: ListProjectsInput): Promise<CwProject[]> {
    const conditions = this.buildConditions(input);
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (conditions) params['conditions'] = conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing projects');
    const { data } = await this.http.get<CwProject[]>('/project/projects', { params });
    return data;
  }

  async getProject(input: GetProjectInput): Promise<CwProject> {
    this.log.debug({ projectId: input.projectId }, 'Getting project');
    const { data } = await this.http
      .get<CwProject>(`/project/projects/${input.projectId}`)
      .catch(() => {
        throw new NotFoundError(`Project #${input.projectId} not found`);
      });
    return data;
  }

  async listPhases(input: ListProjectPhasesInput): Promise<CwProjectPhase[]> {
    const params = { page: input.page, pageSize: input.pageSize };
    const { data } = await this.http.get<CwProjectPhase[]>(
      `/project/projects/${input.projectId}/phases`,
      { params },
    );
    return data;
  }

  async listProjectTickets(input: ListProjectTicketsInput): Promise<CwProjectTicket[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.conditions) params['conditions'] = input.conditions;
    const { data } = await this.http.get<CwProjectTicket[]>(
      `/project/projects/${input.projectId}/tickets`,
      { params },
    );
    return data;
  }

  private buildConditions(input: ListProjectsInput): string {
    if (input.conditions) return input.conditions;
    const parts: string[] = [];
    if (input.name) parts.push(`name contains "${input.name}"`);
    if (input.status) parts.push(`status/name contains "${input.status}"`);
    if (input.company) parts.push(`company/name contains "${input.company}"`);
    if (input.manager) parts.push(`manager/identifier contains "${input.manager}"`);
    return parts.join(' and ');
  }
}
