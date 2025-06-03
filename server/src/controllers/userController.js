import User from '../models/User.js';

export const addToWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};

export const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};
