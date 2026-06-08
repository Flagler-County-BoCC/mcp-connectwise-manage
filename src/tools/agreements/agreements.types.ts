export interface CwAgreement {
  id: number;
  name: string;
  type?: { id: number; name: string };
  company?: { id: number; name: string };
  startDate?: string;
  endDate?: string;
  cancelledFlag?: boolean;
  noEndingDateFlag?: boolean;
}

export interface CwAgreementAddition {
  id: number;
  product?: { id: number; identifier: string; description: string };
  quantity?: number;
  billCustomer?: string;
  effectiveDate?: string;
  cancelledDate?: string;
}
