import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    deliveryInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      notes: String
    },
    deliveryOption: String,
    deliveryDate: String,
    deliveryTime: String,
    paymentMethod: String,
    totals: {
      subtotal: Number,
      shipping: Number,
      tax: Number,
      total: Number
    },
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
