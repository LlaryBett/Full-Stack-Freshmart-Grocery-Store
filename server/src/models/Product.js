import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  category: String, // <-- Category: Fruits
  price: { type: Number, required: true },
  unit: String,
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  sku: String, // <-- SKU: PRD-1
  description: String,
  nutrition: {
    servingSize: String,
    calories: Number,
    totalFat: String,
    saturatedFat: String,
    cholesterol: String,
    sodium: String,
    totalCarbohydrate: String,
    dietaryFiber: String,
    sugars: String,
    protein: String
  },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 }, // average rating
  reviewsCount: { type: Number, default: 0 },
  origin: { type: String, default: 'Local Farm' }, // <-- add this
  delivery: { type: String, default: '1-2 Days' }, // <-- add this
  featured: { type: Boolean, default: false } // <-- add this line
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
