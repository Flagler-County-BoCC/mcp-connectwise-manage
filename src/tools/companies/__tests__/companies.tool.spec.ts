import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../errors/index.js';
import { CompaniesService } from '../companies.service.js';

const mockHttp = {
  get: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(() => {
    service = new CompaniesService(mockHttp);
    vi.clearAllMocks();
  });

  describe('listCompanies', () => {
    it('returns company array', async () => {
      const company = { id: 10, identifier: 'ACME', name: 'Acme Corp' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([company]));

      const result = await service.listCompanies({ page: 1, pageSize: 50 });

      expect(result).toEqual([company]);
      expect(mockHttp.get).toHaveBeenCalledWith('/company/companies', expect.anything());
    });

    it('filters by name and status', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listCompanies({ page: 1, pageSize: 50, name: 'Acme', status: 'Active' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('name contains "Acme"');
      expect(params?.['conditions']).toContain('status/name contains "Active"');
    });
  });

  describe('getCompany', () => {
    it('returns the company when found', async () => {
      const company = { id: 10, identifier: 'ACME', name: 'Acme Corp' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse(company));

      const result = await service.getCompany({ companyId: 10 });
      expect(result).toEqual(company);
    });

    it('throws NotFoundError when API call fails', async () => {
      vi.mocked(mockHttp.get).mockRejectedValueOnce(new Error('404'));
      await expect(service.getCompany({ companyId: 9999 })).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('listContacts', () => {
    it('returns contacts for a company', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([{ id: 1, firstName: 'Jane' }]));

      await service.listContacts({ page: 1, pageSize: 50, companyId: 10 });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('company/id = 10');
    });
  });
});
