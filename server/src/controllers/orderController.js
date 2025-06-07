import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const placeOrder = async (req, res) => {
  const { 
    userId, 
    deliveryInfo, 
    deliveryOption, 
    deliveryDate, 
    deliveryTime, 
    paymentMethod,
    items: itemsFromClient,
    totals: totalsFromClient
  } = req.body;

  try {
    // Defensive: ensure userId is present and valid
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required for order.' });
    }

    // Defensive: flatten deliveryInfo if it is nested or has missing fields
    const safeDeliveryInfo = {
      firstName: deliveryInfo?.firstName ?? '',
      lastName: deliveryInfo?.lastName ?? '',
      email: deliveryInfo?.email ?? '',
      phone: deliveryInfo?.phone ?? '',
      address: deliveryInfo?.address ?? '',
      city: deliveryInfo?.city ?? '',
      state: deliveryInfo?.state ?? '',
      zip: deliveryInfo?.zip ?? '',
      notes: deliveryInfo?.notes ?? ''
    };

    let items = [];
    let subtotal = 0;

    if (Array.isArray(itemsFromClient) && itemsFromClient.length > 0) {
      items = itemsFromClient.map(item => ({
        product: item.product?._id || item.product || item.productId,
        quantity: item.quantity,
        price: item.price || (item.product?.price ?? 0)
      }));
      subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    } else {
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));
      subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.updateOne({ items: [] });
    }

    if (!items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const shipping = deliveryOption === 'express' ? 129 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const totals = totalsFromClient && typeof totalsFromClient === 'object'
      ? {
          subtotal: totalsFromClient.subtotal ?? subtotal,
          shipping: totalsFromClient.shipping ?? shipping,
          tax: totalsFromClient.tax ?? tax,
          total: totalsFromClient.total ?? total
        }
      : { subtotal, shipping, tax, total };

    // Fix: Ensure user field is set to userId and deliveryInfo is always complete
    const order = new Order({
      user: userId,
      items,
      deliveryInfo: safeDeliveryInfo,
      deliveryOption,
      deliveryDate,
      deliveryTime,
      paymentMethod,
      totals,
      status: 'pending'
    });
    await order.save();

    res.status(201).json({
      success: true,
      orderId: order._id,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error placing order'
    });
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ user: userId }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Admin: Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' });
  }
};

// Admin: Update order details (optional, for editing delivery info, etc.)
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, update, { new: true }).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
};
