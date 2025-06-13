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
} from '@mui/material';
import { User, UserRole } from '../types';

interface EditEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  employee: User | null;
}

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  onClose,
  employee,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.EMPLOYEE,
    managerId: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: '',
        role: employee.role,
        managerId: employee.managerId?.toString() || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: UserRole.EMPLOYEE,
        managerId: '',
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = employee ? `/api/employees/${employee.id}` : '/api/auth/register';
    const method = employee ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Failed to save employee');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {!employee && (
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                name="role"
                label="Role"
                select
                value={formData.role}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                <MenuItem value={UserRole.MANAGER}>Manager</MenuItem>
                <MenuItem value={UserRole.EMPLOYEE}>Employee</MenuItem>
              </TextField>
            </Grid>
            {formData.role === UserRole.EMPLOYEE && (
              <Grid item xs={12}>
                <TextField
                  name="managerId"
                  label="Manager ID"
                  value={formData.managerId}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {employee ? 'Save Changes' : 'Add Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditEmployeeDialog;
