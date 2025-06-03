import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticateToken } from '../utils/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/v1/applications - Create application (swipe action)
router.post('/', ApplicationController.createApplication);

// GET /api/v1/applications - Get user's applications
router.get('/', ApplicationController.getUserApplications);

// GET /api/v1/applications/stats - Get application statistics
router.get('/stats', ApplicationController.getApplicationStats);

export default router;