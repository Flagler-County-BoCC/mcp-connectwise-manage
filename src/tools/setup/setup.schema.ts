import { z } from 'zod';

// ─── setup-list-tables ────────────────────────────────────────────────────────

export const ListSetupTablesSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
  name:        z.string().optional(),
  conditions:  z.string().optional(),
  orderBy:     z.string().optional(),
});

export type ListSetupTablesInput = z.infer<typeof ListSetupTablesSchema>;

// ─── setup-list-locations ─────────────────────────────────────────────────────

export const ListLocationsSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  name:     z.string().optional(),
});

export type ListLocationsInput = z.infer<typeof ListLocationsSchema>;

// ─── setup-list-departments ───────────────────────────────────────────────────

export const ListDepartmentsSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
  name:        z.string().optional(),
  conditions:  z.string().optional(),
});

export type ListDepartmentsInput = z.infer<typeof ListDepartmentsSchema>;

// ─── setup-list-work-types ────────────────────────────────────────────────────

export const ListWorkTypesSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  name:     z.string().optional(),
});

export type ListWorkTypesInput = z.infer<typeof ListWorkTypesSchema>;

// ─── setup-list-work-roles ────────────────────────────────────────────────────

export const ListWorkRolesSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  name:     z.string().optional(),
});

export type ListWorkRolesInput = z.infer<typeof ListWorkRolesSchema>;
