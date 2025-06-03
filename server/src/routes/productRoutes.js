import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct); // Protect with admin middleware in production
router.put('/:id', updateProduct); // Protect with admin middleware in production
router.delete('/:id', deleteProduct); // Protect with admin middleware in production
router.post('/:id/reviews', addProductReview); // POST /api/products/:id/reviews

export default router;
