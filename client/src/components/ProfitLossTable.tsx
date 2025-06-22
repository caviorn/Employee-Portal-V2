import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  Typography,
  Tooltip,
  InputLabel,
  TableSortLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../features/store';
import { ProfitLossEntry, UserRole } from '../types';
import {
  addProfitLossEntry,
  updateProfitLossEntry,
  deleteProfitLossEntry,
  fetchProfitLoss,
} from '../features/profitLossSlice';
import { fetchEmployees } from '../features/employeeSlice';

interface EditableRow extends Omit<ProfitLossEntry, 'id'> {
  isNew?: boolean;
  isEditing?: boolean;
}

const ProfitLossTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const { entries } = useAppSelector((state) => state.profitLoss);
  const { employees } = useAppSelector((state) => state.employees);
  const [editableRows, setEditableRows] = useState<(EditableRow & { id?: number })[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | 'all'>('all');
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number>(user?.id || 0);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
        dispatch(fetchEmployees());
        setCurrentEmployeeId(user.id);
      }
      dispatch(fetchProfitLoss(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setEditableRows(entries
      .filter(entry => selectedEmployee === 'all' || entry.employeeId === selectedEmployee)
      .map(entry => ({
        ...entry,
        isEditing: false,
      }))
    );
  }, [entries, selectedEmployee]);

  const handleAddRow = () => {
    const newRow: EditableRow = {
      employeeId: currentEmployeeId,
      date: new Date().toISOString().split('T')[0],
      type: 'Revenue',
      hours: 0,
      rate: 0,
      amount: 0,
      otherAmount: 0,
      totalAmount: 0,
      status: 'Pending',
      notes: '',
      isNew: true,
      isEditing: true,
    };
    setEditableRows([...editableRows, newRow]);
  };

  const handleSaveRow = async (index: number) => {
    const row = editableRows[index];
    if (row.isNew) {
      await dispatch(addProfitLossEntry(row));
    } else if (row.id) {
      await dispatch(updateProfitLossEntry({
        id: row.id,
        status: row.status,
        notes: row.notes,
      }));
    }
    const updatedRows = [...editableRows];
    updatedRows[index] = { ...row, isEditing: false, isNew: false };
    setEditableRows(updatedRows);
  };

  const handleDeleteRow = async (index: number) => {
    const row = editableRows[index];
    if (!row.isNew && row.id && window.confirm('Are you sure you want to delete this entry?')) {
      await dispatch(deleteProfitLossEntry(row.id));
      setEditableRows(editableRows.filter((_, i) => i !== index));
    } else if (row.isNew) {
      setEditableRows(editableRows.filter((_, i) => i !== index));
    }
  };

  const handleCancelEdit = (index: number) => {
    const row = editableRows[index];
    if (row.isNew) {
      setEditableRows(editableRows.filter((_, i) => i !== index));
    } else {
      const originalEntry = entries.find(entry => entry.id === row.id);
      if (originalEntry) {
        const updatedRows = [...editableRows];
        updatedRows[index] = { ...originalEntry, isEditing: false };
        setEditableRows(updatedRows);
      }
    }
  };

  const handleCellChange = (index: number, field: keyof EditableRow, value: any) => {
    const updatedRows = [...editableRows];
    const row = { ...updatedRows[index], [field]: value };

    // Calculate totals if needed
    if (field === 'hours' || field === 'rate') {
      const hours = field === 'hours' ? parseFloat(value) || 0 : parseFloat(row.hours.toString()) || 0;
      const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(row.rate.toString()) || 0;
      row.amount = hours * rate;
      row.totalAmount = row.amount + (parseFloat(row.otherAmount.toString()) || 0);
    } else if (field === 'amount' || field === 'otherAmount') {
      const amount = field === 'amount' ? parseFloat(value) || 0 : parseFloat(row.amount.toString()) || 0;
      const otherAmount = field === 'otherAmount' ? parseFloat(value) || 0 : parseFloat(row.otherAmount.toString()) || 0;
      row.totalAmount = amount + otherAmount;
    }

    updatedRows[index] = row;
    setEditableRows(updatedRows);
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const filteredRows = editableRows.filter(row => 
    selectedEmployee === 'all' || row.employeeId === selectedEmployee
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Profit & Loss Table</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
            <>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Current Employee</InputLabel>
                <Select
                  value={currentEmployeeId}
                  label="Current Employee"
                  onChange={(e) => setCurrentEmployeeId(Number(e.target.value))}
                  size="small"
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  label="Filter by Employee"
                  onChange={(e) => setSelectedEmployee(e.target.value as number | 'all')}
                  size="small"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
          >
            Add Row
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel>
                  Hours
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel>
                  Rate
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel>
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel>
                  Other Amount
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel>
                  Total Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Notes
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Actions
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id || index}>
                <TableCell>
                  {row.isEditing ? (
                    <TextField
                      type="date"
                      size="small"
                      value={row.date}
                      onChange={(e) => handleCellChange(index, 'date', e.target.value)}
                    />
                  ) : (
                    new Date(row.date).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell>
                  {row.isEditing ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.type}
                        onChange={(e) => handleCellChange(index, 'type', e.target.value)}
                      >
                        <MenuItem value="Revenue">Revenue</MenuItem>
                        <MenuItem value="Payment">Payment</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    row.type
                  )}
                </TableCell>
                <TableCell align="right">
                  {row.isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={row.hours}
                      onChange={(e) => handleCellChange(index, 'hours', e.target.value)}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  ) : (
                    row.hours
                  )}
                </TableCell>
                <TableCell align="right">
                  {row.isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={row.rate}
                      onChange={(e) => handleCellChange(index, 'rate', e.target.value)}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  ) : (
                    `$${row.rate}`
                  )}
                </TableCell>
                <TableCell align="right">
                  {row.isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={row.amount}
                      onChange={(e) => handleCellChange(index, 'amount', e.target.value)}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  ) : (
                    `$${row.amount.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell align="right">
                  {row.isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={row.otherAmount}
                      onChange={(e) => handleCellChange(index, 'otherAmount', e.target.value)}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  ) : (
                    `$${row.otherAmount?.toFixed(2) || '0.00'}`
                  )}
                </TableCell>
                <TableCell align="right">
                  {`$${row.totalAmount.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {row.isEditing ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.status}
                        onChange={(e) => handleCellChange(index, 'status', e.target.value)}
                      >
                        <MenuItem value="Received">Received</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    row.status
                  )}
                </TableCell>
                <TableCell>
                  {row.isEditing ? (
                    <TextField
                      size="small"
                      value={row.notes}
                      onChange={(e) => handleCellChange(index, 'notes', e.target.value)}
                    />
                  ) : (
                    row.notes
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {row.isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSaveRow(index)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelEdit(index)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              const updatedRows = [...editableRows];
                              updatedRows[index] = { ...row, isEditing: true };
                              setEditableRows(updatedRows);
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProfitLossTable;
