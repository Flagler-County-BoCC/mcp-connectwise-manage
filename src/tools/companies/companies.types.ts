export interface CwCompany {
  id: number;
  identifier: string;
  name: string;
  status?: { id: number; name: string };
  type?: { id: number; name: string };
  phoneNumber?: string;
  website?: string;
  territory?: { id: number; name: string };
}

export interface CwContact {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: { id: number; name: string };
  defaultContactFlag?: boolean;
  inactiveFlag?: boolean;
}
