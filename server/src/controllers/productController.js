import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, search, inStock, onSale } = req.query;
    let filter = {};
    let sortOption = {};

    // Category filter (case-insensitive, exact match)
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // In Stock filter
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // On Sale filter (discount > 0)
    if (onSale === 'true') {
      filter.discount = { $gt: 0 };
    }

    // Sorting and Featured filter
    switch (sort) {
      case 'price-low':
        sortOption.price = 1;
        break;
      case 'price-high':
        sortOption.price = -1;
        break;
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'rating':
        sortOption.rating = -1;
        break;
      case 'featured':
        filter.featured = true;
        break;
      default:
        // no special sort/filter
        break;
    }

    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    // To add a featured product, include "featured": true in the POST body
    // Example:
    // {
    //   "name": "Banana",
    //   ...,
    //   "featured": true
    // }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // You can also update the "featured" field via PUT/PATCH
    // Example:
    // { "featured": true }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product' });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews.push({ user, rating, comment });

    // Update average rating and count
    product.reviewsCount = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({
      message: 'Review added',
      reviews: product.reviews,
      rating: product.rating,
      reviewsCount: product.reviewsCount
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding review' });
  }
};
