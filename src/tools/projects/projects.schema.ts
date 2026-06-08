import { z } from 'zod';

// ─── prj-list-projects ────────────────────────────────────────────────────────

export const ListProjectsSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
  name:        z.string().optional(),
  status:      z.string().optional(),
  company:     z.string().optional(),
  manager:     z.string().optional(),
  conditions:  z.string().optional(),
  orderBy:     z.string().optional(),
});

export type ListProjectsInput = z.infer<typeof ListProjectsSchema>;

// ─── prj-get-project ──────────────────────────────────────────────────────────

export const GetProjectSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export type GetProjectInput = z.infer<typeof GetProjectSchema>;

// ─── prj-list-phases ──────────────────────────────────────────────────────────

export const ListProjectPhasesSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  page:      z.coerce.number().int().min(1).default(1),
  pageSize:  z.coerce.number().int().min(1).max(100).default(50),
});

export type ListProjectPhasesInput = z.infer<typeof ListProjectPhasesSchema>;

// ─── prj-list-tickets ─────────────────────────────────────────────────────────

export const ListProjectTicketsSchema = z.object({
  projectId:  z.coerce.number().int().positive(),
  page:       z.coerce.number().int().min(1).default(1),
  pageSize:   z.coerce.number().int().min(1).max(100).default(50),
  conditions: z.string().optional(),
});

export type ListProjectTicketsInput = z.infer<typeof ListProjectTicketsSchema>;
