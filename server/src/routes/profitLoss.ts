import express from 'express';
import { getProfitLoss, addProfitLossEntry, deleteProfitLossEntry, updateProfitLossEntry } from '../controllers/profitLoss';

const router = express.Router();

router.get('/:employeeId', getProfitLoss);
router.post('/', addProfitLossEntry);
router.delete('/:id', deleteProfitLossEntry);
router.patch('/:id', updateProfitLossEntry);

export default router;
