import express from 'express';
import { getEmployees, updateEmployee } from '../controllers/employees';

const router = express.Router();

router.get('/', getEmployees);
router.put('/:id', updateEmployee);

export default router;
