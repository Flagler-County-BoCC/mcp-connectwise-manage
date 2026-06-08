import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../errors/index.js';
import { ProjectsService } from '../projects.service.js';

const mockHttp = {
  get: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    service = new ProjectsService(mockHttp);
    vi.clearAllMocks();
  });

  describe('listProjects', () => {
    it('returns project array', async () => {
      const project = { id: 300, name: 'Test Project' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([project]));

      const result = await service.listProjects({ page: 1, pageSize: 50 });

      expect(result).toEqual([project]);
      expect(mockHttp.get).toHaveBeenCalledWith('/project/projects', expect.anything());
    });

    it('filters by name, status, and company', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listProjects({
        page: 1, pageSize: 50, name: 'Cloud', status: 'Open', company: 'Acme',
      });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('name contains "Cloud"');
      expect(params?.['conditions']).toContain('status/name contains "Open"');
      expect(params?.['conditions']).toContain('company/name contains "Acme"');
    });
  });

  describe('getProject', () => {
    it('returns the project when found', async () => {
      const project = { id: 300, name: 'Test Project' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse(project));
      const result = await service.getProject({ projectId: 300 });
      expect(result).toEqual(project);
    });

    it('throws NotFoundError when not found', async () => {
      vi.mocked(mockHttp.get).mockRejectedValueOnce(new Error('404'));
      await expect(service.getProject({ projectId: 9999 })).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('listPhases', () => {
    it('calls project-scoped phases endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listPhases({ projectId: 300, page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith('/project/projects/300/phases', expect.anything());
    });
  });

  describe('listProjectTickets', () => {
    it('calls project-scoped tickets endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listProjectTickets({ projectId: 300, page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith(
        '/project/projects/300/tickets',
        expect.anything(),
      );
    });
  });
});
