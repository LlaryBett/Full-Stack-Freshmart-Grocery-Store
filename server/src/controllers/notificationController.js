import Notification from '../models/Notification.js';
import NotificationPreference from '../models/NotificationPreference.js';

export const getNotifications = async (req, res) => {
  try {
    // Make sure to filter out hidden notifications for this user
    const notifications = await Notification.find({
      user: req.params.userId,
      $or: [{ hidden: { $exists: false } }, { hidden: false }]
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateOne({ _id: req.params.notificationId, user: req.params.userId }, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch {
    res.status(500).json({ message: 'Error updating notification' });
  }
};

export const getPreferences = async (req, res) => {
  try {
    let prefs = await NotificationPreference.findOne({ user: req.params.userId });
    if (!prefs) {
      prefs = new NotificationPreference({ user: req.params.userId });
      await prefs.save();
    }
    res.json(prefs);
  } catch {
    res.status(500).json({ message: 'Error fetching preferences' });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const prefs = await NotificationPreference.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(prefs);
  } catch {
    res.status(500).json({ message: 'Error updating preferences' });
  }
};

// Utility to check if a notification should be sent based on preferences
export const shouldSendNotification = async (userId, type, channel) => {
  // type: 'order', 'promo', 'recommendation', 'newsletter', etc.
  // channel: 'email' or 'push'
  const prefs = await NotificationPreference.findOne({ user: userId });
  if (!prefs) return true; // default: send

  if (channel === 'email') {
    if (type === 'order') return prefs.emailOrderUpdates;
    if (type === 'promo') return prefs.emailPromotions;
    if (type === 'recommendation') return prefs.emailRecommendations;
    if (type === 'newsletter') return prefs.emailNewsletter;
  }
  if (channel === 'push') {
    if (type === 'order') return prefs.pushOrderStatus;
    if (type === 'delivery') return prefs.pushDelivery;
    if (type === 'promo') return prefs.pushPromotions;
  }
  return true;
};

// Example usage in your backend when creating a notification:
export const createNotification = async (userId, type, message, channel = 'push') => {
  if (await shouldSendNotification(userId, type, channel)) {
    await Notification.create({ user: userId, type, message });
    // Optionally, send email or push notification here as well
  }
};

/**
 * Allow a user to "delete" (hide) a notification for themselves,
 * but not delete the notification document from the system.
 * This is done by marking it as "deleted" for that user.
 */
export const hideNotificationForUser = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    // Only update the notification for this user, not delete it globally
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { $set: { hidden: true } }, // Add a "hidden" field
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found for this user' });
    }
    res.json({ message: 'Notification hidden for user' });
  } catch {
    res.status(500).json({ message: 'Error hiding notification' });
  }
};
