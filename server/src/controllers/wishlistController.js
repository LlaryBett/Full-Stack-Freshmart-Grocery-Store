import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId }).populate('items');
    res.json(wishlist || { items: [] });
  } catch {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = new Wishlist({ user: userId, items: [] });
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
      await wishlist.save();
    }
    res.json(wishlist);
  } catch {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(id => id.toString() !== productId);
    await wishlist.save();
    res.json(wishlist);
  } catch {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};
