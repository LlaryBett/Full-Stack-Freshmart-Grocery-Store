import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use Vite environment variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    fetch(`${backendUrl}/api/products?sort=featured`)
      .then(res => res.json())
      .then(data => {
        // Handle paginated response
        const products = data.products || [];
        // Filter featured products and limit to 8
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 8));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('featured-products-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(scrollPosition - scrollAmount, 0)
        : Math.min(scrollPosition + scrollAmount, container.scrollWidth - container.clientWidth);
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No featured products found.
          </div>
        ) : (
          <div 
            id="featured-products-container"
            className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <div key={product._id || product.id} className="flex-shrink-0 w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;