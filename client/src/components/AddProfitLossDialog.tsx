import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../features/store';
import { addProfitLossEntry } from '../features/profitLossSlice';
import { fetchEmployees } from '../features/employeeSlice';
import { ProfitLossEntry, UserRole } from '../types';

interface AddProfitLossDialogProps {
  open: boolean;
  onClose: () => void;
}

type FormData = {
  date: string;
  type: ProfitLossEntry['type'];
  hours: string;
  rate: string;
  amount: string;
  otherAmount: string;
  totalAmount: string;
  status: ProfitLossEntry['status'];
  notes: string;
};

const AddProfitLossDialog: React.FC<AddProfitLossDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const { employees } = useAppSelector((state) => state.employees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('');

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    type: 'Revenue',
    hours: '',
    rate: '',
    amount: '',
    otherAmount: '',
    totalAmount: '',
    status: 'Pending',
    notes: '',
  });

  useEffect(() => {
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'amount' || name === 'otherAmount') {
      const amount = parseFloat(name === 'amount' ? value : formData.amount) || 0;
      const otherAmount = parseFloat(name === 'otherAmount' ? value : formData.otherAmount) || 0;
      setFormData((prev) => ({
        ...prev,
        totalAmount: (amount + otherAmount).toString(),
      }));
    }

    if (name === 'hours' || name === 'rate') {
      const hours = parseFloat(name === 'hours' ? value : formData.hours) || 0;
      const rate = parseFloat(name === 'rate' ? value : formData.rate) || 0;
      const amount = (hours * rate).toString();
      setFormData((prev) => ({
        ...prev,
        amount,
        totalAmount: (parseFloat(amount) + (parseFloat(prev.otherAmount) || 0)).toString(),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const employeeId = user.role === UserRole.EMPLOYEE 
      ? user.id 
      : selectedEmployeeId;

    if (!employeeId) {
      alert('Please select an employee');
      return;
    }

    const entry: Omit<ProfitLossEntry, 'id'> = {
      employeeId,
      date: formData.date,
      type: formData.type,
      hours: parseFloat(formData.hours) || 0,
      rate: parseFloat(formData.rate) || 0,
      amount: parseFloat(formData.amount) || 0,
      otherAmount: parseFloat(formData.otherAmount) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      status: formData.status,
      notes: formData.notes,
    };

    dispatch(addProfitLossEntry(entry));
    setSelectedEmployeeId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Profit/Loss Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={selectedEmployeeId}
                    label="Employee"
                    onChange={(e) => setSelectedEmployeeId(e.target.value as number)}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="type"
                label="Type"
                select
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Revenue">Revenue</MenuItem>
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="hours"
                label="Hours"
                type="number"
                value={formData.hours}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="rate"
                label="Rate"
                type="number"
                value={formData.rate}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="otherAmount"
                label="Other Amount"
                type="number"
                value={formData.otherAmount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="totalAmount"
                label="Total Amount"
                type="number"
                value={formData.totalAmount}
                onChange={handleChange}
                fullWidth
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="status"
                label="Status"
                select
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Entry
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProfitLossDialog;
