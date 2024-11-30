import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware'

const router = Router();

router.post('/login', authController.login);
router.get('/auth-check', authenticateToken, authController.authCheck);

export default router;
