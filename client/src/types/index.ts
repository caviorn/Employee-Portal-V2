export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  managerId?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface EmployeeState {
  employees: User[];
  isLoading: boolean;
  error: string | null;
}

export interface ProfitLossState {
  entries: ProfitLossEntry[];
  isLoading: boolean;
  error: string | null;
}

export interface ProfitLossEntry {
  id: number;
  employeeId: number;
  date: string;
  hours: number;
  rate: number;
  amount: number;
  otherAmount: number;
  totalAmount: number;
  type: 'Revenue' | 'Payment' | 'Expense';
  status: 'Received' | 'Pending' | 'Paid';
  notes?: string;
}
