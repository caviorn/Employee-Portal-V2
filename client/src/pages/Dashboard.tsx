import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { entries } = useSelector((state: RootState) => state.profitLoss);

  // Calculate summary data
  const totalRevenue = entries
    .filter((entry) => entry.type === 'Revenue')
    .reduce((sum, entry) => sum + entry.totalAmount, 0);

  const totalExpenses = entries
    .filter((entry) => entry.type === 'Expense')
    .reduce((sum, entry) => sum + entry.totalAmount, 0);

  const netProfit = totalRevenue - totalExpenses;

  // Prepare chart data
  const monthlyData = entries.reduce((acc: any[], entry) => {
    const date = new Date(entry.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find((item) => item.month === month);

    if (existing) {
      if (entry.type === 'Revenue') {
        existing.revenue += entry.totalAmount;
      } else if (entry.type === 'Expense') {
        existing.expenses += entry.totalAmount;
      }
      existing.profit = existing.revenue - existing.expenses;
    } else {
      acc.push({
        month,
        revenue: entry.type === 'Revenue' ? entry.totalAmount : 0,
        expenses: entry.type === 'Expense' ? entry.totalAmount : 0,
        profit: entry.type === 'Revenue' ? entry.totalAmount : -entry.totalAmount,
      });
    }

    return acc;
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName} {user?.lastName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.error.main,
              color: 'white',
            }}
          >
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h4">${totalExpenses.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.success.main,
              color: 'white',
            }}
          >
            <Typography variant="h6">Net Profit</Typography>
            <Typography variant="h4">${netProfit.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill={theme.palette.primary.main} name="Revenue" />
                <Bar dataKey="expenses" fill={theme.palette.error.main} name="Expenses" />
                <Bar dataKey="profit" fill={theme.palette.success.main} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
