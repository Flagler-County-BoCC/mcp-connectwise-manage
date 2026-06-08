import { z } from 'zod';

// ─── co-list-companies ────────────────────────────────────────────────────────

export const ListCompaniesSchema = z.object({
  page:         z.coerce.number().int().min(1).default(1),
  pageSize:     z.coerce.number().int().min(1).max(100).default(50),
  name:         z.string().optional(),
  identifier:   z.string().optional(),
  status:       z.string().optional(),
  type:         z.string().optional(),
  conditions:   z.string().optional(),
  orderBy:      z.string().optional(),
});

export type ListCompaniesInput = z.infer<typeof ListCompaniesSchema>;

// ─── co-get-company ───────────────────────────────────────────────────────────

export const GetCompanySchema = z.object({
  companyId: z.coerce.number().int().positive(),
});

export type GetCompanyInput = z.infer<typeof GetCompanySchema>;

// ─── co-list-contacts ─────────────────────────────────────────────────────────

export const ListContactsSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
  companyId:   z.coerce.number().int().positive().optional(),
  firstName:   z.string().optional(),
  lastName:    z.string().optional(),
  email:       z.string().email().optional(),
  conditions:  z.string().optional(),
  orderBy:     z.string().optional(),
});

export type ListContactsInput = z.infer<typeof ListContactsSchema>;
