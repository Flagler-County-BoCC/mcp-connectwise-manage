import { z } from 'zod';

// ─── Shared ───────────────────────────────────────────────────────────────────

const PaginationSchema = z.object({
  page:       z.coerce.number().int().min(1).default(1),
  pageSize:   z.coerce.number().int().min(1).max(100).default(50),
  conditions: z.string().optional(),
  orderBy:    z.string().optional(),
});

// ─── svc-list-tickets ─────────────────────────────────────────────────────────

export const ListTicketsSchema = PaginationSchema.extend({
  board:        z.string().optional(),
  status:       z.string().optional(),
  priority:     z.string().optional(),
  assignedTo:   z.string().optional(),
  company:      z.string().optional(),
  summary:      z.string().optional(),
});

export type ListTicketsInput = z.infer<typeof ListTicketsSchema>;

// ─── svc-get-ticket ───────────────────────────────────────────────────────────

export const GetTicketSchema = z.object({
  ticketId: z.coerce.number().int().positive(),
});

export type GetTicketInput = z.infer<typeof GetTicketSchema>;

// ─── svc-list-boards ──────────────────────────────────────────────────────────

export const ListBoardsSchema = PaginationSchema.pick({ page: true, pageSize: true }).extend({
  name: z.string().optional(),
});

export type ListBoardsInput = z.infer<typeof ListBoardsSchema>;

// ─── svc-list-statuses ────────────────────────────────────────────────────────

export const ListStatusesSchema = z.object({
  boardId:  z.coerce.number().int().positive(),
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListStatusesInput = z.infer<typeof ListStatusesSchema>;

// ─── svc-list-priorities ──────────────────────────────────────────────────────

export const ListPrioritiesSchema = PaginationSchema.pick({ page: true, pageSize: true });

export type ListPrioritiesInput = z.infer<typeof ListPrioritiesSchema>;

// ─── svc-list-impacts ─────────────────────────────────────────────────────────

export const ListImpactsSchema = PaginationSchema.pick({ page: true, pageSize: true });

export type ListImpactsInput = z.infer<typeof ListImpactsSchema>;

// ─── svc-list-members ─────────────────────────────────────────────────────────

export const ListMembersSchema = PaginationSchema.pick({ page: true, pageSize: true }).extend({
  identifier:  z.string().optional(),
  firstName:   z.string().optional(),
  lastName:    z.string().optional(),
});

export type ListMembersInput = z.infer<typeof ListMembersSchema>;
