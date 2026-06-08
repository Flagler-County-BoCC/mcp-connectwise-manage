import type { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../errors/index.js';
import { ServiceDeskService } from '../service.service.js';

const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
} as unknown as AxiosInstance;

const makeResponse = <T>(data: T) => ({ data });

describe('ServiceDeskService', () => {
  let service: ServiceDeskService;

  beforeEach(() => {
    service = new ServiceDeskService(mockHttp);
    vi.clearAllMocks();
  });

  // ─── listTickets ──────────────────────────────────────────────────────────

  describe('listTickets', () => {
    it('returns ticket array from API', async () => {
      const ticket = { id: 1001, summary: 'Test ticket' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([ticket]));

      const result = await service.listTickets({ page: 1, pageSize: 25 });

      expect(result).toEqual([ticket]);
      expect(mockHttp.get).toHaveBeenCalledWith('/service/tickets', expect.objectContaining({
        params: expect.objectContaining({ page: 1, pageSize: 25 }),
      }));
    });

    it('builds conditions from named filters', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listTickets({ page: 1, pageSize: 50, board: 'Managed Services', status: 'Open' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('board/name contains "Managed Services"');
      expect(params?.['conditions']).toContain('status/name contains "Open"');
    });

    it('passes raw conditions string through unchanged', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listTickets({ page: 1, pageSize: 50, conditions: 'id > 500' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toBe('id > 500');
    });
  });

  // ─── getTicket ────────────────────────────────────────────────────────────

  describe('getTicket', () => {
    it('returns the ticket when found', async () => {
      const ticket = { id: 1001, summary: 'Test ticket' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse(ticket));

      const result = await service.getTicket({ ticketId: 1001 });

      expect(result).toEqual(ticket);
      expect(mockHttp.get).toHaveBeenCalledWith('/service/tickets/1001');
    });

    it('throws NotFoundError when API call fails', async () => {
      vi.mocked(mockHttp.get).mockRejectedValueOnce(new Error('404'));

      const result = service.getTicket({ ticketId: 9999 });
      await expect(result).rejects.toBeInstanceOf(NotFoundError);
      await expect(result).rejects.toMatchObject({
        code: 'NOT_FOUND',
        statusCode: 404,
      });
    });
  });

  // ─── listBoards ───────────────────────────────────────────────────────────

  describe('listBoards', () => {
    it('returns boards array', async () => {
      const board = { id: 1, name: 'Managed Services' };
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([board]));

      const result = await service.listBoards({ page: 1, pageSize: 50 });

      expect(result).toEqual([board]);
    });

    it('filters by name when provided', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listBoards({ page: 1, pageSize: 50, name: 'Managed' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('name contains "Managed"');
    });
  });

  // ─── listStatuses ─────────────────────────────────────────────────────────

  describe('listStatuses', () => {
    it('calls board-specific statuses endpoint', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([{ id: 1, name: 'Open' }]));

      await service.listStatuses({ boardId: 5, page: 1, pageSize: 50 });

      expect(mockHttp.get).toHaveBeenCalledWith(
        '/service/boards/5/statuses',
        expect.anything(),
      );
    });
  });

  // ─── listMembers ──────────────────────────────────────────────────────────

  describe('listMembers', () => {
    it('combines multiple member filters with AND', async () => {
      vi.mocked(mockHttp.get).mockResolvedValueOnce(makeResponse([]));

      await service.listMembers({ page: 1, pageSize: 50, firstName: 'John', lastName: 'Doe' });

      const call = vi.mocked(mockHttp.get).mock.calls[0];
      const params = (call?.[1] as { params: Record<string, unknown> })?.params;
      expect(params?.['conditions']).toContain('firstName contains "John"');
      expect(params?.['conditions']).toContain('lastName contains "Doe"');
      expect(params?.['conditions']).toContain(' and ');
    });
  });
});
