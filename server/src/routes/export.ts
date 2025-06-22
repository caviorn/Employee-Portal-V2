import express from 'express';
import { exportUserLogins } from '../controllers/export';
const router = express.Router();

router.post('/user-logins', exportUserLogins);

export default router;
