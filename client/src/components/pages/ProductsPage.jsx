import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import Loader from '../common/Loader';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]); // Initialize as empty array
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    setLoading(true);
    // Use Vite env variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    fetch(`${backendUrl}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Fetch products from backend with filters/sorting
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    document.title = 'Shop All Products - FreshMart';

    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    let url = `${backendUrl}/api/products?`;

    if (categoryParam) {
      url += `category=${encodeURIComponent(categoryParam)}`;
    }

    if (searchParam) {
      url += (url.endsWith('?') ? '' : '&') + `search=${encodeURIComponent(searchParam)}`;
    }

    if (priceRange[0] > 0) url += (url.endsWith('?') ? '' : '&') + `minPrice=${priceRange[0]}`;
    if (priceRange[1] < 1500) url += (url.endsWith('?') ? '' : '&') + `maxPrice=${priceRange[1]}`;

    if (sortBy && sortBy !== 'featured') url += (url.endsWith('?') ? '' : '&') + `sort=${sortBy}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Handle both array and paginated object response
        const products = Array.isArray(data) ? data : data.products || [];
        setFilteredProducts(products);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setFilteredProducts([]);
        setLoading(false);
      });
  }, [searchParams, priceRange, sortBy]);

  const handleCategoryChange = (category) => {
    setIsMobileFilterOpen(false);
    // Remove selectedCategory state, rely only on searchParams for source of truth
    if (category) {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        params.set('category', category);
        return params;
      });
    } else {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        params.delete('category');
        return params;
      });
    }
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="pt-16 md:pt-20">
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {searchParams.get('category') 
              ? `${searchParams.get('category').charAt(0).toUpperCase() + searchParams.get('category').slice(1)}`
              : "All Products"}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">•</span>
            <span>Products</span>
            {searchParams.get('category') && (
              <>
                <span className="mx-2">•</span>
                <span>{searchParams.get('category')}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => handleCategoryChange(null)}
                      className={`text-left w-full py-1 px-2 rounded-md transition-colors ${
                        searchParams.get('category') === null 
                          ? 'bg-green-50 text-green-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id || category._id}>
                      <button 
                        onClick={() => handleCategoryChange(category.id || category._id)}
                        className={`text-left w-full py-1 px-2 rounded-md transition-colors ${
                          searchParams.get('category') === (category.id || category._id)
                            ? 'bg-green-50 text-green-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ksh{priceRange[0]}</span>
                    <span className="text-gray-600">ksh{priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1500" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-green-500"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox text-green-500 rounded" />
                    <span className="ml-2 text-gray-600">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox text-green-500 rounded" />
                    <span className="ml-2 text-gray-600">On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button 
              onClick={toggleMobileFilter}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Best Rating</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          {/* Mobile Filters Sidebar */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex lg:hidden">
              <div className="w-80 bg-white h-full overflow-auto p-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={toggleMobileFilter}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Categories</h4>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => handleCategoryChange(null)}
                        className={`text-left w-full py-1 px-2 rounded-md transition-colors ${
                          searchParams.get('category') === null 
                            ? 'bg-green-50 text-green-600 font-medium' 
                            : 'text-gray-600'
                        }`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map(category => (
                      <li key={category.id}>
                        <button 
                          onClick={() => handleCategoryChange(category.id)}
                          className={`text-left w-full py-1 px-2 rounded-md transition-colors ${
                            searchParams.get('category') === category.id 
                              ? 'bg-green-50 text-green-600 font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ksh{priceRange[0]}</span>
                      <span className="text-gray-600">ksh{priceRange[1]}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1500" 
                      value={priceRange[1]} 
                      onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-green-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Sort By</h4>
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Best Rating</option>
                  </select>
                </div>
                
                <button 
                  onClick={toggleMobileFilter}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-medium">{filteredProducts.length}</span> products
              </p>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Best Rating</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Products */}
            {loading ? (
              <Loader />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={() => handleCategoryChange(null)}
                  className="text-green-500 hover:text-green-600 font-medium"
                >
                  View all products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Pagination - add if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;