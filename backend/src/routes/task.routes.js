import express from 'express';
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getMyCreatedTasks,
  getMyAssignedTasks,
  getOverdue,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

router.post('/', create);
router.get('/', getAll);
router.get('/my-created', getMyCreatedTasks);
router.get('/my-assigned', getMyAssignedTasks);
router.get('/overdue', getOverdue);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
