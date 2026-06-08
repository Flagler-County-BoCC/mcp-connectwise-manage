import { z } from 'zod';

// ─── sal-list-opportunities ───────────────────────────────────────────────────

const OpportunityStatuses = ['Open', 'Won', 'Lost', 'NoDecision'] as const;
export const OpportunityStatusEnum = z.enum(OpportunityStatuses);

export const ListOpportunitiesSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
  name:        z.string().optional(),
  company:     z.string().optional(),
  status:      OpportunityStatusEnum.optional(),
  assignedTo:  z.string().optional(),
  conditions:  z.string().optional(),
  orderBy:     z.string().optional(),
});

export type ListOpportunitiesInput = z.infer<typeof ListOpportunitiesSchema>;

// ─── sal-get-opportunity ──────────────────────────────────────────────────────

export const GetOpportunitySchema = z.object({
  opportunityId: z.coerce.number().int().positive(),
});

export type GetOpportunityInput = z.infer<typeof GetOpportunitySchema>;

// ─── sal-list-quotes ──────────────────────────────────────────────────────────

export const ListQuotesSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(50),
  name:        z.string().optional(),
  conditions:  z.string().optional(),
  orderBy:     z.string().optional(),
});

export type ListQuotesInput = z.infer<typeof ListQuotesSchema>;
