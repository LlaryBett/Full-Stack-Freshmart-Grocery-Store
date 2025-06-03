import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchBar = ({ onClose, isScrolled }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      // eslint-disable-next-line no-undef
      const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CLIENT_URL;
      fetch(`${backendUrl}/api/products?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(Array.isArray(data) ? data.slice(0, 5) : []);
        })
        .catch(() => setSearchResults([]));
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Search size={20} className={isScrolled ? 'text-gray-400' : 'text-white'} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full px-4 py-2 bg-transparent outline-none ${
            isScrolled 
              ? 'text-gray-800 placeholder:text-gray-400' 
              : 'text-white placeholder:text-white/70'
          }`}
        />
        {query && (
          <button 
            onClick={handleClear}
            className={`p-1 rounded-full ${
              isScrolled 
                ? 'text-gray-400 hover:text-gray-600' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10">
          <ul className="divide-y divide-gray-100">
            {searchResults.map(product => (
              <li key={product._id || product.id}>
                <Link
                  to={`/products/${product._id || product.id}`}
                  className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded-md mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="ml-auto text-sm font-medium text-green-600">
                    ${product.price?.toFixed(2)}
                  </div>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={`/products?search=${query}`}
                className="block p-3 text-center text-green-500 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                View all results
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;