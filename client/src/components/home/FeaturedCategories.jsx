import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedCategories = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('categories-container');
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
    <section className="py-12 bg-white">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Shop by Category</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No categories found. Check your categories data.
          </div>
        ) : (
          <div 
            id="categories-container"
            className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id || category._id}
                to={`/products?category=${category.id || category._id}`}
                className="flex-shrink-0 group"
              >
                <div className="bg-gray-50 rounded-xl overflow-hidden w-56 h-64 relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-2">{category.productCount} Products</p>
                    <span className="text-sm text-green-400 font-medium">Shop Now</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;