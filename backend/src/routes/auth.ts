import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../utils/auth';

const router = Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);

export default router;