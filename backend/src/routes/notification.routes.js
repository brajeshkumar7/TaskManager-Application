import express from 'express';
import {
  getAll,
  getUnread,
  markRead,
  markAllRead,
  remove,
  removeAll,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAll);
router.get('/unread', getUnread);
router.put('/:id/read', markRead);
router.put('/read-all', markAllRead);
router.delete('/:id', remove);
router.delete('/', removeAll);

export default router;
