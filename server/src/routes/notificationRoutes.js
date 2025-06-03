import express from 'express';
import {
  getNotifications,
  markAsRead,
  getPreferences,
  updatePreferences
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getNotifications);
router.put('/:userId/:notificationId/read', markAsRead);
router.get('/preferences/:userId', getPreferences);
router.put('/preferences/:userId', updatePreferences);

export default router;
