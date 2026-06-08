export interface CwTicket {
  id: number;
  summary: string;
  status?: { id: number; name: string };
  board?: { id: number; name: string };
  priority?: { id: number; name: string };
  impact?: { id: number; name: string };
  company?: { id: number; name: string };
  assignedTeamMember?: { id: number; identifier: string; name: string };
  dateEntered?: string;
  dateUpdated?: string;
  closedFlag?: boolean;
}

export interface CwBoard {
  id: number;
  name: string;
  locationId?: number;
  departmentId?: number;
}

export interface CwStatus {
  id: number;
  name: string;
  boardId?: number;
  sortOrder?: number;
  closedStatus?: boolean;
}

export interface CwPriority {
  id: number;
  name: string;
  sort?: number;
  color?: string;
}

export interface CwImpact {
  id: number;
  name: string;
}

export interface CwMember {
  id: number;
  identifier: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  licenseClass?: string;
}
