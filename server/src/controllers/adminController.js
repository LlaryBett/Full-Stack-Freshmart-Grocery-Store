import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const broadcastNotification = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    // Find all users
    const users = await User.find({}, '_id');
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    // Create a notification for each user
    const notifications = users.map(user => ({
      user: user._id,
      type: 'broadcast',
      message,
      read: false,
      createdAt: new Date()
    }));
    await Notification.insertMany(notifications);
    res.json({ message: 'Broadcast sent to all users' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to broadcast notification' });
  }
};
