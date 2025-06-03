import { X, Minus, Plus, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-[400px] object-contain rounded-lg"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-2 text-sm text-gray-500">{product.category}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < product.rating ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({Array.isArray(product.reviews) ? product.reviews.length : product.reviewsCount || 0} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="ml-2 text-gray-400 line-through">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
              {product.unit && (
                <span className="ml-2 text-gray-500">/ {product.unit}</span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            {/* Stock */}
            <div className="mb-4">
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-gray-700 mr-3">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 py-1 border-l border-r border-gray-300">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
              
              <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center">
                <Heart size={18} className="mr-2" />
                Add to Wishlist
              </button>
            </div>
            
            {/* Extra Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">SKU:</span>
                <span className="text-sm text-gray-700">{product.sku || `PRD-${product.id}`}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Categories:</span>
                <span className="text-sm text-gray-700">{product.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Share:</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* View Full Details Link */}
            <div className="mt-4 text-center">
              <Link 
                to={`/products/${product._id || product.id}`} 
                className="text-green-500 hover:text-green-600 font-medium"
                onClick={onClose}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h3>
          {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={review._id || idx} className="mb-4">
                <div className="flex items-center mb-2">
                  <strong className="text-gray-800">{review.user}</strong>
                  <div className="flex ml-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="text-gray-700 mb-2">{review.comment}</div>
                <div className="text-sm text-gray-500">
                  {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;