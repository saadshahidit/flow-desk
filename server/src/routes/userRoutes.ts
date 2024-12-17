import { Router } from 'express';
import { getUsers, updateRole, deleteUser } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();
router.use(auth, requireAdmin);
router.get('/', getUsers);
router.patch('/:id/role', updateRole);
router.delete('/:id', deleteUser);

export default router;
