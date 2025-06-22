import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { employees } = useSelector((state: RootState) => state.employees);
  const { entries } = useSelector((state: RootState) => state.profitLoss);

  // Metrics
  const totalEmployees = employees.length;
  const yourTeam = user?.role === UserRole.MANAGER
    ? employees.filter(e => e.managerId === user.id)
    : [];
  const yourEntries = user?.role === UserRole.EMPLOYEE
    ? entries.filter(e => e.employeeId === user.id)
    : entries;
  const pendingEntries = entries.filter(e => e.status === 'Pending');

  // Recent activity (last 5 profit/loss entries)
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
        Welcome to Amensys Portal, {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Role: <Chip label={user?.role} color="primary" size="small" />
      </Typography>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Key Metrics</Typography>
            <List>
              {user?.role === UserRole.ADMIN && (
                <ListItem>
                  <ListItemText primary="Total Employees" secondary={totalEmployees} />
                </ListItem>
              )}
              {user?.role === UserRole.MANAGER && (
                <ListItem>
                  <ListItemText primary="Your Team Members" secondary={yourTeam.length} />
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary="Pending Profit/Loss Entries" secondary={pendingEntries.length} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Your Entries" secondary={yourEntries.length} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Profit/Loss Activity</Typography>
            <List>
              {recentEntries.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent activity." />
                </ListItem>
              )}
              {recentEntries.map(entry => (
                <React.Fragment key={entry.id}>
                  <ListItem alignItems="flex-start">
                    <Avatar sx={{ bgcolor: entry.type === 'Revenue' ? 'primary.main' : entry.type === 'Expense' ? 'error.main' : 'warning.main', mr: 2 }}>
                      {entry.type[0]}
                    </Avatar>
                    <ListItemText
                      primary={
                        <>
                          <b>{entry.type}</b> &mdash; {entry.status}
                          <Chip
                            label={entry.status}
                            size="small"
                            color={entry.status === 'Pending' ? 'warning' : entry.status === 'Paid' ? 'success' : 'default'}
                            sx={{ ml: 1 }}
                          />
                        </>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(entry.date).toLocaleDateString()} | Amount: ${entry.totalAmount.toFixed(2)}
                          </Typography>
                          {user?.role !== UserRole.EMPLOYEE && (
                            <>
                              {' '}| Employee: {(() => {
                                const emp = employees.find(e => e.id === entry.employeeId);
                                return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
                              })()}
                            </>
                          )}
                          {entry.notes && (
                            <>
                              <br />Notes: {entry.notes}
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="outlined" color="primary" href="/profit-loss">
                View All Entries
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
