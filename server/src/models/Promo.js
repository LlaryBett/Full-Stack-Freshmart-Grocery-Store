import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema({
  bg: { type: String, required: true },
  badge: {
    text: { type: String, required: true },
    color: { type: String, required: true }
  },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  link: { type: String, required: true },
  linkText: { type: String, required: true },
  img: { type: String, required: true },
  alt: { type: String, required: true }
});

export default mongoose.model('Promo', promoSchema);
