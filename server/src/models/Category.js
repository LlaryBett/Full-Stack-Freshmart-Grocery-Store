import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true }, // e.g. 'fruits', 'vegetables'
  image: String,
  featured: { type: Boolean, default: false }
});

export default mongoose.model('Category', categorySchema);
