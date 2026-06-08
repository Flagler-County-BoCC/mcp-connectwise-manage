export interface CwOpportunity {
  id: number;
  name: string;
  status?: { id: number; name: string };
  company?: { id: number; name: string };
  primarySalesRep?: { id: number; identifier: string; name: string };
  expectedCloseDate?: string;
  closedDate?: string;
  probability?: { id: number; name: string; probability: number };
}

export interface CwQuote {
  id: number;
  name: string;
  status?: string;
  company?: { id: number; name: string };
  effectiveDate?: string;
  expirationDate?: string;
}
