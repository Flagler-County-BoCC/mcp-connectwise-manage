import type { CwTicket } from '../service/service.types.js';

export interface CwProject {
  id: number;
  name: string;
  status?: { id: number; name: string };
  company?: { id: number; name: string };
  manager?: { id: number; identifier: string; name: string };
  estimatedStart?: string;
  estimatedEnd?: string;
  closedFlag?: boolean;
  percentComplete?: number;
}

export interface CwProjectPhase {
  id: number;
  description: string;
  projectId?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  wbsCode?: string;
}

export type { CwTicket as CwProjectTicket };
