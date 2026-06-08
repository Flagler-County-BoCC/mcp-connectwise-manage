export interface CwTimeEntry {
  id: number;
  chargeToId?: number;
  chargeToType?: string;
  member?: { id: number; identifier: string };
  timeStart?: string;
  timeEnd?: string;
  hoursDeduct?: number;
  actualHours?: number;
  billableOption?: string;
  notes?: string;
  dateEntered?: string;
}

export interface CwTimePeriod {
  id: number;
  identifier?: string;
  dateStart?: string;
  dateEnd?: string;
  description?: string;
}

export interface DryRunResult {
  dryRun: true;
  payload: unknown;
}
