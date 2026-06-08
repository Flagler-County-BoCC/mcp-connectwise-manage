import { z } from 'zod';

// ─── time-list-entries ────────────────────────────────────────────────────────

export const ListTimeEntriesSchema = z.object({
  page:          z.coerce.number().int().min(1).default(1),
  pageSize:      z.coerce.number().int().min(1).max(100).default(50),
  memberId:      z.coerce.number().int().positive().optional(),
  ticketId:      z.coerce.number().int().positive().optional(),
  dateStart:     z.coerce.date().optional(),
  dateEnd:       z.coerce.date().optional(),
  conditions:    z.string().optional(),
  orderBy:       z.string().optional(),
});

export type ListTimeEntriesInput = z.infer<typeof ListTimeEntriesSchema>;

// ─── time-list-periods ────────────────────────────────────────────────────────

export const ListTimePeriodsSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListTimePeriodsInput = z.infer<typeof ListTimePeriodsSchema>;

// ─── time-create-entry ────────────────────────────────────────────────────────

const TimeEntryStatuses = ['Billable', 'DoNotBill', 'NoCharge', 'NoDefault'] as const;
export const TimeEntryStatusEnum = z.enum(TimeEntryStatuses);

export const CreateTimeEntrySchema = z.object({
  ticketId:    z.coerce.number().int().positive(),
  memberId:    z.coerce.number().int().positive(),
  timeStart:   z.coerce.date(),
  timeEnd:     z.coerce.date(),
  hoursDeduct: z.coerce.number().min(0).default(0),
  actualHours: z.coerce.number().min(0).optional(),
  notes:       z.string().optional(),
  billableOption: TimeEntryStatusEnum.default('Billable'),
  confirm:     z.coerce.boolean().default(false),
  dryRun:      z.coerce.boolean().default(false),
});

export type CreateTimeEntryInput = z.infer<typeof CreateTimeEntrySchema>;

// ─── time-update-entry ────────────────────────────────────────────────────────

export const UpdateTimeEntrySchema = z.object({
  entryId:        z.coerce.number().int().positive(),
  notes:          z.string().optional(),
  hoursDeduct:    z.coerce.number().min(0).optional(),
  actualHours:    z.coerce.number().min(0).optional(),
  billableOption: TimeEntryStatusEnum.optional(),
  confirm:        z.coerce.boolean().default(false),
  dryRun:         z.coerce.boolean().default(false),
});

export type UpdateTimeEntryInput = z.infer<typeof UpdateTimeEntrySchema>;
