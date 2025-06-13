import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Full Name</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {user.firstName} {user.lastName}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography color="textSecondary">Email</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{user.email}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography color="textSecondary">Role</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{user.role}</Typography>
                </Grid>

                {user.managerId && (
                  <>
                    <Grid item xs={4}>
                      <Typography color="textSecondary">Manager ID</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{user.managerId}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Access Level
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography paragraph>
                As a{' '}
                <Typography component="span" color="primary" fontWeight="bold">
                  {user.role}
                </Typography>
                , you have access to:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {user.role === 'ADMIN' && (
                  <>
                    <li>View and manage all employees</li>
                    <li>Add/edit/remove employee records</li>
                    <li>View and manage all profit/loss entries</li>
                    <li>Access system-wide settings</li>
                  </>
                )}
                {user.role === 'MANAGER' && (
                  <>
                    <li>View and manage your team members</li>
                    <li>Add/edit profit/loss entries for your team</li>
                    <li>View team performance metrics</li>
                  </>
                )}
                {user.role === 'EMPLOYEE' && (
                  <>
                    <li>View your personal profile</li>
                    <li>View your profit/loss entries</li>
                    <li>Access your performance metrics</li>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
