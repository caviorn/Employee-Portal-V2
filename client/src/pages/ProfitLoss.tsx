import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../features/store';
import { ProfitLossEntry, UserRole } from '../types';
import { fetchProfitLoss, deleteProfitLossEntry } from '../features/profitLossSlice';
import { fetchEmployees } from '../features/employeeSlice';
import AddProfitLossDialog from '../components/AddProfitLossDialog';
import EditProfitLossDialog from '../components/EditProfitLossDialog';

const ProfitLoss: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ProfitLossEntry | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | 'all'>('all');
  const dispatch = useDispatch<AppDispatch>();
  
  const { entries, isLoading, error } = useAppSelector(state => state.profitLoss);
  const { user } = useAppSelector(state => state.auth);
  const { employees } = useAppSelector(state => state.employees);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
        dispatch(fetchEmployees());
      }
      dispatch(fetchProfitLoss(user.id));
    }
  }, [dispatch, user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmployeeChange = (event: any) => {
    const employeeId = event.target.value;
    setSelectedEmployee(employeeId);
    if (employeeId !== 'all') {
      dispatch(fetchProfitLoss(employeeId));
    }
  };

  const filteredEntries = selectedEmployee === 'all' 
    ? entries 
    : entries.filter(entry => entry.employeeId === selectedEmployee);

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const handleDelete = (entryId: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteProfitLossEntry(entryId));
    }
  };

  const handleEdit = (entry: ProfitLossEntry) => {
    setSelectedEntry(entry);
    setEditOpen(true);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Profit & Loss Entries</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Employee</InputLabel>
              <Select
                value={selectedEmployee}
                label="Filter by Employee"
                onChange={handleEmployeeChange}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Add Entry
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Hours</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Other Amount</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.map((entry: ProfitLossEntry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{getEmployeeName(entry.employeeId)}</TableCell>
                <TableCell>{entry.type}</TableCell>
                <TableCell align="right">{entry.hours}</TableCell>
                <TableCell align="right">${entry.rate}</TableCell>
                <TableCell align="right">${entry.amount.toFixed(2)}</TableCell>
                <TableCell align="right">
                  ${entry.otherAmount?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell align="right">${entry.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{entry.status}</TableCell>
                <TableCell>{entry.notes}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit status and notes">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(entry)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete entry">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(entry.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProfitLossDialog open={open} onClose={() => setOpen(false)} />
      {selectedEntry && (
        <EditProfitLossDialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
        />
      )}
    </Box>
  );
};

export default ProfitLoss;
