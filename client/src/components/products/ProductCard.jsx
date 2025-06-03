import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductQuickView from './ProductQuickView';

const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // Show added confirmation
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <Link to={`/products/${product._id || product.id}`} className="block">
          <div className="relative">
            {/* Product image */}
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* Discount badge */}
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
            
            {/* Quick actions */}
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
              <button 
                className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={16} className="text-gray-600" />
              </button>
              
              <button 
                onClick={openQuickView}
                className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                aria-label="Quick view"
              >
                <Eye size={16} className="text-gray-600" />
              </button>
            </div>
            
            {/* Stock indicator */}
            {product.stock <= 5 && (
              <div className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                Only {product.stock} left
              </div>
            )}
          </div>
          
          <div className="p-4">
            {/* Category */}
            <div className="text-xs text-gray-500 mb-1">{product.category}</div>
            
            {/* Product Name */}
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
            
            {/* Price */}
            <div className="flex items-center mb-3">
              <span className="font-semibold text-lg text-gray-800">${product.price.toFixed(2)}</span>
              
              {product.discount > 0 && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
              
              {product.unit && (
                <span className="ml-2 text-sm text-gray-500">/ {product.unit}</span>
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center mb-3">
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
              <span className="ml-2 text-xs text-gray-500">
                ({Array.isArray(product.reviews) ? product.reviews.length : product.reviewsCount || 0})
              </span>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 rounded-lg flex items-center justify-center transition-colors ${
                isAddedToCart 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-green-500 hover:text-white'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check size={16} className="mr-1" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-1" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </Link>
      </div>
      
      {isQuickViewOpen && (
        <ProductQuickView 
          product={product} 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;