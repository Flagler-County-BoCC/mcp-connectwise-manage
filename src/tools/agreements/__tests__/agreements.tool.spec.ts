import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../errors/index.js';
import { AgreementsService } from '../agreements.service.js';

const mockHttp = {
  get: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('AgreementsService', () => {
  let service: AgreementsService;

  beforeEach(() => {
    service = new AgreementsService(mockHttp);
    vi.clearAllMocks();
  });

  describe('listAgreements', () => {
    it('returns agreements array', async () => {
      const agreement = { id: 200, name: 'Test Agreement' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([agreement]));

      const result = await service.listAgreements({ page: 1, pageSize: 50 });

      expect(result).toEqual([agreement]);
      expect(mockHttp.get).toHaveBeenCalledWith('/finance/agreements', expect.anything());
    });

    it('builds conditions for company and name filters', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listAgreements({ page: 1, pageSize: 50, company: 'Acme', name: 'Support' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('company/name contains "Acme"');
      expect(params?.['conditions']).toContain('name contains "Support"');
    });
  });

  describe('getAgreement', () => {
    it('returns the agreement when found', async () => {
      const agreement = { id: 200, name: 'Test Agreement' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse(agreement));

      const result = await service.getAgreement({ agreementId: 200 });

      expect(result).toEqual(agreement);
    });

    it('throws NotFoundError when API call fails', async () => {
      vi.mocked(mockHttp.get).mockRejectedValueOnce(new Error('404'));

      await expect(service.getAgreement({ agreementId: 9999 })).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('listAdditions', () => {
    it('calls the correct sub-resource endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listAdditions({ agreementId: 200, page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith(
        '/finance/agreements/200/additions',
        expect.anything(),
      );
    });
  });
});
