import { Router } from 'express';
import { getTaskActivity } from '../controllers/activityController';
import { auth } from '../middleware/auth';

const router = Router();
router.get('/task/:taskId', auth, getTaskActivity);

export default router;
