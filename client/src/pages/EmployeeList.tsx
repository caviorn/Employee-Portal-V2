import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { User, UserRole } from '../types';
import EditEmployeeDialog from '../components/EditEmployeeDialog';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleEdit = (employee: User) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setDialogOpen(false);
    fetchEmployees(); // Refresh the list after edit
  };

  // Check if user has permission to view this page
  if (user?.role === UserRole.EMPLOYEE) {
    return (
      <Typography variant="h6" color="error">
        You don't have permission to view this page.
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Employee List</Typography>
        {user?.role === UserRole.ADMIN && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedEmployee(null);
              setDialogOpen(true);
            }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditEmployeeDialog
        open={dialogOpen}
        onClose={handleClose}
        employee={selectedEmployee}
      />
    </Box>
  );
};

export default EmployeeList;
