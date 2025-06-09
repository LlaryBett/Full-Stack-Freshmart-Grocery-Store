import mongoose from 'mongoose';

const promoEventSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Birthday", "First Order"
  description: { type: String },
  trigger: { type: String, required: true }, // e.g. "on_signup", "on_first_order", "on_birthday"
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  durationDays: { type: Number, default: 7 }, // How long the code is valid
  isActive: { type: Boolean, default: true },
  criteria: { type: Object } // e.g. { categories: ['fruits', 'seafood'] }
}, { timestamps: true });

export default mongoose.model('PromoEvent', promoEventSchema);
