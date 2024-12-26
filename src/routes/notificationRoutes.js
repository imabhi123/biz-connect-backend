import express from 'express';
import {
  sendNotificationToAllUsers,
  sendNotificationToUser,
  getAllNotifications,
  getUserNotifications,
  deleteNotification,
} from '../controllers/notificationControllers.js';

const router = express.Router();

// Send notification routes
router.post('/send-to-all', sendNotificationToAllUsers);
router.post('/send-to-user/:userId', sendNotificationToUser);
router.delete('/:id', deleteNotification);

// Get notification routes
router.get('/all', getAllNotifications); // Fetch all notifications
router.get('/user/:userId', getUserNotifications); // Fetch notifications for a specific user

export default router;
