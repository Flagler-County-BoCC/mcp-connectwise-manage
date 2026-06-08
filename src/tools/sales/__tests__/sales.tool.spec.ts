import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../errors/index.js';
import { SalesService } from '../sales.service.js';

const mockHttp = {
  get: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(() => {
    service = new SalesService(mockHttp);
    vi.clearAllMocks();
  });

  describe('listOpportunities', () => {
    it('returns opportunities array', async () => {
      const opp = { id: 400, name: 'New Deal' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([opp]));

      const result = await service.listOpportunities({ page: 1, pageSize: 50 });

      expect(result).toEqual([opp]);
      expect(mockHttp.get).toHaveBeenCalledWith('/sales/opportunities', expect.anything());
    });

    it('includes status in conditions when provided', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listOpportunities({ page: 1, pageSize: 50, status: 'Open' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('status/name = "Open"');
    });
  });

  describe('getOpportunity', () => {
    it('returns the opportunity when found', async () => {
      const opp = { id: 400, name: 'New Deal' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse(opp));
      const result = await service.getOpportunity({ opportunityId: 400 });
      expect(result).toEqual(opp);
    });

    it('throws NotFoundError when not found', async () => {
      vi.mocked(mockHttp.get).mockRejectedValueOnce(new Error('404'));
      await expect(service.getOpportunity({ opportunityId: 9999 })).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('listQuotes', () => {
    it('calls /sales/quotes endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listQuotes({ page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith('/sales/quotes', expect.anything());
    });
  });
});
