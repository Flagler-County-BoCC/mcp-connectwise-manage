export interface CwSetupTable {
  id: number;
  tableName: string;
  description?: string;
}

export interface CwLocation {
  id: number;
  name: string;
  where?: string;
}

export interface CwDepartment {
  id: number;
  name: string;
  identifier?: string;
}

export interface CwWorkType {
  id: number;
  name: string;
  billTime?: string;
  hoursMin?: number;
  hoursMax?: number;
}

export interface CwWorkRole {
  id: number;
  name: string;
  hoursMin?: number;
  hoursMax?: number;
}
