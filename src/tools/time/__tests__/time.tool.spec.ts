import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForbiddenError } from '../../../errors/index.js';
import { TimeService } from '../time.service.js';

const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    service = new TimeService(mockHttp);
    vi.clearAllMocks();
  });

  // ─── listEntries ──────────────────────────────────────────────────────────

  describe('listEntries', () => {
    it('returns time entries array', async () => {
      const entry = { id: 100, chargeToId: 1001, actualHours: 2.5 };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([entry]));

      const result = await service.listEntries({ page: 1, pageSize: 50 });

      expect(result).toEqual([entry]);
      expect(mockHttp.get).toHaveBeenCalledWith('/time/entries', expect.anything());
    });

    it('builds memberId and ticketId conditions', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listEntries({ page: 1, pageSize: 50, memberId: 42, ticketId: 1001 });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('member/id = 42');
      expect(params?.['conditions']).toContain('chargeToId = 1001');
    });

    it('passes raw conditions through unchanged', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listEntries({ page: 1, pageSize: 50, conditions: 'member/id = 5' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toBe('member/id = 5');
    });
  });

  // ─── listPeriods ──────────────────────────────────────────────────────────

  describe('listPeriods', () => {
    it('returns time periods from correct endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([{ id: 1 }]));

      const result = await service.listPeriods({ page: 1, pageSize: 50 });

      expect(result).toHaveLength(1);
      expect(mockHttp.get).toHaveBeenCalledWith('/time/timePeriods', expect.anything());
    });
  });

  // ─── createEntry ──────────────────────────────────────────────────────────

  describe('createEntry', () => {
    const baseInput = {
      ticketId: 1001,
      memberId: 42,
      timeStart: new Date('2025-01-01T08:00:00Z'),
      timeEnd: new Date('2025-01-01T10:00:00Z'),
      hoursDeduct: 0,
      billableOption: 'Billable' as const,
      confirm: false,
      dryRun: false,
    };

    it('throws ForbiddenError when CW_REQUIRE_CONFIRM_WRITES is on and neither confirm nor dryRun', async () => {
      // default config has requireConfirm: true
      await expect(
        service.createEntry({ ...baseInput, confirm: false, dryRun: false }),
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    it('returns DryRunResult without making HTTP call when dryRun=true', async () => {
      const result = await service.createEntry({ ...baseInput, dryRun: true });

      expect(result).toMatchObject({ dryRun: true });
      expect(mockHttp.post).not.toHaveBeenCalled();
    });

    it('POSTs to /time/entries when confirm=true', async () => {
      const created = { id: 999, chargeToId: 1001 };
      vi.mocked(mockHttp.post).mockResolvedValueOnce(makeResponse(created));

      const result = await service.createEntry({ ...baseInput, confirm: true });

      expect(result).toEqual(created);
      expect(mockHttp.post).toHaveBeenCalledWith('/time/entries', expect.objectContaining({
        chargeToId: 1001,
        member: { id: 42 },
      }));
    });
  });

  // ─── updateEntry ──────────────────────────────────────────────────────────

  describe('updateEntry', () => {
    const baseInput = { entryId: 999, confirm: false, dryRun: false };

    it('throws ForbiddenError without confirm or dryRun', async () => {
      await expect(service.updateEntry(baseInput)).rejects.toBeInstanceOf(ForbiddenError);
    });

    it('returns DryRunResult without HTTP call when dryRun=true', async () => {
      const result = await service.updateEntry({ ...baseInput, notes: 'fixed', dryRun: true });

      expect(result).toMatchObject({ dryRun: true });
      expect(mockHttp.patch).not.toHaveBeenCalled();
    });

    it('PATCHes only the provided fields when confirm=true', async () => {
      const updated = { id: 999, notes: 'fixed' };
      vi.mocked(mockHttp.patch).mockResolvedValueOnce(makeResponse(updated));

      await service.updateEntry({ ...baseInput, notes: 'fixed', confirm: true });

      const body = vi.mocked(mockHttp.patch).mock.calls[0]?.[1] as Record<string, unknown>;
      expect(body).toHaveProperty('notes', 'fixed');
      expect(body).not.toHaveProperty('actualHours');
    });
  });
});
