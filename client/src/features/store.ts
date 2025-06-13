import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
// Make sure employeeSlice.ts exists in the same folder, or update the path if it's located elsewhere.
import employeeReducer from './employeeSlice';
import profitLossReducer from './profitLossSlice';
import { AuthState, EmployeeState, ProfitLossState } from '../types';

// Define the shape of your entire store
export interface RootState {
  auth: AuthState;
  employees: EmployeeState;
  profitLoss: ProfitLossState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    profitLoss: profitLossReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
