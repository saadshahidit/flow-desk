import { Router } from 'express';
import {
  getTasks, getTask, createTask, updateTask,
  assignTask, updateStatus, deleteTask,
} from '../controllers/taskController';
import { auth } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();
router.use(auth);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', requireAdmin, createTask);
router.put('/:id', requireAdmin, updateTask);
router.patch('/:id/assign', requireAdmin, assignTask);
router.patch('/:id/status', updateStatus);
router.delete('/:id', requireAdmin, deleteTask);

export default router;
