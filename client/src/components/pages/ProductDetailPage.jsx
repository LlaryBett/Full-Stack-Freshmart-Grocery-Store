import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star,
  Truck, 
  RefreshCw, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import ProductCard from '../products/ProductCard';
import Loader from '../common/Loader';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id || id === "undefined") return;
    setLoading(true);
    // Use Vite env variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    fetch(`${backendUrl}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        document.title = `${data.name} - FreshMart`;
        if (data.category) {
          return fetch(`${backendUrl}/api/products?category=${encodeURIComponent(data.category)}`);
        } else {
          setRelatedProducts([]);
          setLoading(false);
          return Promise.resolve({ json: () => [] });
        }
      })
      .then(res => res.json && typeof res.json === 'function' ? res.json() : res)
      .then(data => {
        if (Array.isArray(data)) {
          setRelatedProducts(
            data.filter(p => String(p._id || p.id) !== String(id)).slice(0, 4)
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
        navigate('/products');
      });
    window.scrollTo(0, 0);
  }, [id, navigate]);

  useEffect(() => {
    // Check if product is in wishlist on mount
    if (user && product?._id) {
      // Use Vite env variables
      const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
      fetch(`${backendUrl}/api/wishlist/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.items) && data.items.some(item => item._id === product._id)) {
            setIsWishlisted(true);
          }
        });
    }
  }, [user, product?._id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to add to wishlist.');
      return;
    }
    // Use Vite env variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    try {
      const res = await fetch(`${backendUrl}/api/wishlist/${user._id || user.id}`, {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });
      if (!res.ok) throw new Error();
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  // Use product.images array if available, else fallback to single image
  const productImages = product && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product && product.image
    ? [product.image]
    : [];

  if (!id || id === "undefined") {
    return <div className="container mx-auto px-4 py-16">Invalid product link.</div>;
  }

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div className="p-8 text-center text-gray-500">Product not found.</div>;
  }

  return (
    <div className="pt-16 md:pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li className="flex items-center">
              <Link to="/" className="hover:text-green-500 transition-colors">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/products" className="hover:text-green-500 transition-colors">Products</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link 
                to={`/products?category=${product.category}`} 
                className="hover:text-green-500 transition-colors"
              >
                {product.category}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-700 font-medium">{product.name}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-4 h-80 md:h-96 lg:h-[500px]">
              <img 
                src={productImages[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 border-2 rounded-md overflow-hidden flex-shrink-0 ${
                    activeImageIndex === index ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-2 text-sm text-gray-500">{product.category}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < product.rating ? 'currentColor' : 'none'}
                    className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({Array.isArray(product.reviews) ? product.reviews.length : product.reviewsCount || 0} reviews)
              </span>
            </div>
            {/* Price */}
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-800">${product.price?.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="ml-3 text-lg text-gray-400 line-through">
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
            <div className="mb-6">
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            {/* Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 rounded-md mr-4">
                  <button 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
            {/* Extra Actions */}
            <div className="flex space-x-4 mb-8">
              <button 
                onClick={handleWishlist}
                className={`p-2 rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-600`}
                aria-label="Add to wishlist"
              >
                <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 size={20} className="mr-2" />
                Share
              </button>
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
                <Truck className="text-green-500" size={20} />
                <span className="text-sm">Free delivery over $50</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
                <RefreshCw className="text-green-500" size={20} />
                <span className="text-sm">14-day returns</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
                <ShieldCheck className="text-green-500" size={20} />
                <span className="text-sm">Quality guaranteed</span>
              </div>
            </div>
            {/* Extra Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">SKU:</span>
                  <span className="ml-2 text-gray-700">{product.sku || `PRD-${product._id || product.id}`}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-700">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Origin:</span>
                  <span className="ml-2 text-gray-700">{product.origin || "Local Farm"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Delivery:</span>
                  <span className="ml-2 text-gray-700">{product.delivery || "1-2 Days"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-6 font-medium transition-colors ${
                activeTab === 'description'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`py-3 px-6 font-medium transition-colors ${
                activeTab === 'nutrition'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Nutrition Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-6 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Reviews ({Array.isArray(product.reviews) ? product.reviews.length : product.reviewsCount || 0})
            </button>
          </div>
          
          {/* Tab content */}
          <div className="mb-16">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p>
                  {product.description} Our {product.name?.toLowerCase()} is carefully sourced from local farms to ensure the highest quality and freshness. Each {product.name?.toLowerCase()} is handpicked at the peak of ripeness and delivered to your doorstep within 24 hours of harvesting.
                </p>
                <p className="mt-4">
                  We pride ourselves on sustainable farming practices that respect the environment and support local communities. Our farmers use organic methods to grow produce that is not only delicious but also nutritious and free from harmful pesticides.
                </p>
                <p className="mt-4">
                  Perfect for {product.category === 'Fruits' ? 'snacking, smoothies, or desserts' : 'cooking, salads, or side dishes'}, our {product.name?.toLowerCase()} will elevate your meals with fresh flavor and vital nutrients.
                </p>
              </div>
            )}
            
            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Nutrition Information</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <p className="text-lg font-bold">
                      Serving Size: {product.nutrition?.servingSize || '100g'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Calories</span>
                      <span className="font-medium">{product.nutrition?.calories ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Total Fat</span>
                      <span className="font-medium">{product.nutrition?.totalFat ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Saturated Fat</span>
                      <span className="font-medium">{product.nutrition?.saturatedFat ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Cholesterol</span>
                      <span className="font-medium">{product.nutrition?.cholesterol ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Sodium</span>
                      <span className="font-medium">{product.nutrition?.sodium ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Total Carbohydrate</span>
                      <span className="font-medium">{product.nutrition?.totalCarbohydrate ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Dietary Fiber</span>
                      <span className="font-medium">{product.nutrition?.dietaryFiber ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Sugars</span>
                      <span className="font-medium">{product.nutrition?.sugars ?? '-'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Protein</span>
                      <span className="font-medium">{product.nutrition?.protein ?? '-'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
                </p>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors">
                    Write a Review
                  </button>
                </div>
                <div className="space-y-6">
                  {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                      <div key={review._id || idx} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.comment}</span>
                        </div>
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{review.user}</span>
                          {review.createdAt && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No reviews yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related._id || related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;