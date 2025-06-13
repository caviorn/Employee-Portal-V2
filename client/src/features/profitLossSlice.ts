import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProfitLossEntry } from '../types';

interface ProfitLossState {
  entries: ProfitLossEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfitLossState = {
  entries: [],
  isLoading: false,
  error: null,
};

export const fetchProfitLoss = createAsyncThunk<ProfitLossEntry[], number>(
  'profitLoss/fetch',
  async (employeeId) => {
    const response = await fetch(`/api/profit-loss/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profit/loss data');
    }
    return response.json();
  }
);

export const addProfitLossEntry = createAsyncThunk<
  ProfitLossEntry,
  Omit<ProfitLossEntry, 'id'>
>(
  'profitLoss/add',
  async (entry) => {
    const response = await fetch('/api/profit-loss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error('Failed to add entry');
    }
    return response.json();
  }
);

export const deleteProfitLossEntry = createAsyncThunk<number, number>(
  'profitLoss/delete',
  async (entryId) => {
    const response = await fetch(`/api/profit-loss/${entryId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete entry');
    }
    return entryId;
  }
);

export const updateProfitLossEntry = createAsyncThunk<
  ProfitLossEntry,
  { id: number; status: ProfitLossEntry['status']; notes?: string }
>(
  'profitLoss/update',
  async ({ id, status, notes }) => {
    const response = await fetch(`/api/profit-loss/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status, notes }),
    });
    if (!response.ok) {
      throw new Error('Failed to update entry');
    }
    return response.json();
  }
);

const profitLossSlice = createSlice({
  name: 'profitLoss',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfitLoss.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfitLoss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
      })
      .addCase(fetchProfitLoss.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(addProfitLossEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      })
      .addCase(deleteProfitLossEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(
          (entry) => entry.id !== action.payload
        );
      })
      .addCase(updateProfitLossEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(
          (entry) => entry.id === action.payload.id
        );
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      });
  },
});

export default profitLossSlice.reducer;
