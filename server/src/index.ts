import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import profitLossRoutes from './routes/profitLoss';
import exportRoutes from './routes/export';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/employees', authenticateToken, employeeRoutes);
app.use('/api/profit-loss', authenticateToken, profitLossRoutes);
app.use('/api/export', exportRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
