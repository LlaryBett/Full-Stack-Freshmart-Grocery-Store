import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    // Count products using category name instead of id
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: { $regex: `^${cat.name}$`, $options: 'i' }
        });
        return { ...cat.toObject(), productCount };
      })
    );
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    // Count products using category name
    const productCount = await Product.countDocuments({
      category: { $regex: `^${category.name}$`, $options: 'i' }
    });
    res.json({ ...category.toObject(), productCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting category' });
  }
};