import type { AxiosInstance } from 'axios';
import { createLogger } from '../../lib/logger.js';
import type {
  ListDepartmentsInput,
  ListLocationsInput,
  ListSetupTablesInput,
  ListWorkRolesInput,
  ListWorkTypesInput,
} from './setup.schema.js';
import type {
  CwDepartment,
  CwLocation,
  CwSetupTable,
  CwWorkRole,
  CwWorkType,
} from './setup.types.js';

export class SetupService {
  private readonly log = createLogger({ module: 'setupService' });

  constructor(private readonly http: AxiosInstance) {}

  async listSetupTables(input: ListSetupTablesInput): Promise<CwSetupTable[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.name) params['conditions'] = `tableName contains "${input.name}"`;
    if (input.conditions) params['conditions'] = input.conditions;
    if (input.orderBy) params['orderBy'] = input.orderBy;

    this.log.debug({ params }, 'Listing setup tables');
    const { data } = await this.http.get<CwSetupTable[]>('/system/setupTables', { params });
    return data;
  }

  async listLocations(input: ListLocationsInput): Promise<CwLocation[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.name) params['conditions'] = `name contains "${input.name}"`;

    const { data } = await this.http.get<CwLocation[]>('/system/locations', { params });
    return data;
  }

  async listDepartments(input: ListDepartmentsInput): Promise<CwDepartment[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.conditions) params['conditions'] = input.conditions;
    else if (input.name) params['conditions'] = `name contains "${input.name}"`;

    const { data } = await this.http.get<CwDepartment[]>('/system/departments', { params });
    return data;
  }

  async listWorkTypes(input: ListWorkTypesInput): Promise<CwWorkType[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.name) params['conditions'] = `name contains "${input.name}"`;

    const { data } = await this.http.get<CwWorkType[]>('/time/workTypes', { params });
    return data;
  }

  async listWorkRoles(input: ListWorkRolesInput): Promise<CwWorkRole[]> {
    const params: Record<string, unknown> = { page: input.page, pageSize: input.pageSize };
    if (input.name) params['conditions'] = `name contains "${input.name}"`;

    const { data } = await this.http.get<CwWorkRole[]>('/time/workRoles', { params });
    return data;
  }
}
