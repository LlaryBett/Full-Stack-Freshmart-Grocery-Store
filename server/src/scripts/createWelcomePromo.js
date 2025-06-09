import mongoose from 'mongoose';
import PromoCode from '../models/PromoCode.js';

await mongoose.connect(process.env.MONGO_URI);

await PromoCode.updateOne(
  { code: 'WELCOME10' },
  {
    $set: {
      discountType: 'percentage',
      discountAmount: 10,
      minOrderAmount: 0,
      maxUses: null,
      usedCount: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365*24*60*60*1000),
      isActive: true
    }
  },
  { upsert: true }
);

console.log('WELCOME10 promo code created/updated.');
process.exit();
