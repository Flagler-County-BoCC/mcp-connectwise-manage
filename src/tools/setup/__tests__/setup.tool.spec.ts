import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SetupService } from '../setup.service.js';

const mockHttp = {
  get: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('SetupService', () => {
  let service: SetupService;

  beforeEach(() => {
    service = new SetupService(mockHttp);
    vi.clearAllMocks();
  });

  describe('listSetupTables', () => {
    it('calls /system/setupTables endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listSetupTables({ page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith('/system/setupTables', expect.anything());
    });

    it('applies name filter as conditions', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listSetupTables({ page: 1, pageSize: 50, name: 'Holiday' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('Holiday');
    });
  });

  describe('listLocations', () => {
    it('calls /system/locations endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([{ id: 1, name: 'Main Office' }]));

      const result = await service.listLocations({ page: 1, pageSize: 50 });

      expect(result).toHaveLength(1);
      expect(mockHttp.get).toHaveBeenCalledWith('/system/locations', expect.anything());
    });
  });

  describe('listWorkTypes', () => {
    it('calls /time/workTypes endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listWorkTypes({ page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith('/time/workTypes', expect.anything());
    });
  });

  describe('listWorkRoles', () => {
    it('calls /time/workRoles endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listWorkRoles({ page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith('/time/workRoles', expect.anything());
    });
  });
});
