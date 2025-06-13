import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../types';

interface EmployeeState {
  employees: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  isLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async () => {
    const response = await fetch('/api/employees', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return response.json();
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async (employee: Partial<User> & { id: number }) => {
    const response = await fetch(`/api/employees/${employee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      throw new Error('Failed to update employee');
    }
    return response.json();
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      });
  },
});

export default employeeSlice.reducer;
