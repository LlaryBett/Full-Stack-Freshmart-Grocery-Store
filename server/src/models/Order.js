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
    status: { 
      type: String, 
      enum: [
        'pending',          // Initial state when order is placed
        'confirmed',        // Order is confirmed but not yet processing
        'processing',       // Order is being prepared
        'ready',           // Order is ready for delivery/pickup
        'out_for_delivery', // Order is out for delivery
        'delivered',        // Order has been delivered
        'cancelled',        // Order was cancelled
        'refunded'         // Order was refunded
      ],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
