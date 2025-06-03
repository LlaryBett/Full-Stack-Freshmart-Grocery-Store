import mongoose from 'mongoose';

const notificationPreferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailOrderUpdates: { type: Boolean, default: true },
  emailPromotions: { type: Boolean, default: true },
  emailRecommendations: { type: Boolean, default: false },
  emailNewsletter: { type: Boolean, default: true },
  pushOrderStatus: { type: Boolean, default: true },
  pushDelivery: { type: Boolean, default: true },
  pushPromotions: { type: Boolean, default: false }
});

export default mongoose.model('NotificationPreference', notificationPreferenceSchema);
