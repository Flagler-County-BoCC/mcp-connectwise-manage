import { z } from 'zod';

// ─── agr-list-agreements ──────────────────────────────────────────────────────

export const ListAgreementsSchema = z.object({
  page:       z.coerce.number().int().min(1).default(1),
  pageSize:   z.coerce.number().int().min(1).max(100).default(50),
  company:    z.string().optional(),
  name:       z.string().optional(),
  type:       z.string().optional(),
  conditions:  z.string().optional(),
  orderBy:    z.string().optional(),
});

export type ListAgreementsInput = z.infer<typeof ListAgreementsSchema>;

// ─── agr-get-agreement ────────────────────────────────────────────────────────

export const GetAgreementSchema = z.object({
  agreementId: z.coerce.number().int().positive(),
});

export type GetAgreementInput = z.infer<typeof GetAgreementSchema>;

// ─── agr-list-additions ───────────────────────────────────────────────────────

export const ListAgreementAdditionsSchema = z.object({
  agreementId: z.coerce.number().int().positive(),
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
});

export type ListAgreementAdditionsInput = z.infer<typeof ListAgreementAdditionsSchema>;
