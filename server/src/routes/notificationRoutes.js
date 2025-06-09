import express from 'express';
import {
  getNotifications,
  markAsRead,
  getPreferences,
  updatePreferences,
  hideNotificationForUser
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getNotifications);

// FIX: Use PATCH instead of PUT for markAsRead, and match the frontend route
router.patch('/:userId/:notificationId/read', markAsRead);

router.get('/preferences/:userId', getPreferences);
router.put('/preferences/:userId', updatePreferences);
router.patch('/:userId/:notificationId/hide', hideNotificationForUser);

export default router;
