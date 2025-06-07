import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../ui/SearchBar';
import CategoryDropdown from './CategoryDropdown';

const Header = ({ toggleCart, toggleMobileMenu }) => {
  const { cartItems } = useCart(); // Always use this for cart items
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // When you need to fetch or reference the backend URL, use:
  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
  // Example usage:
  // fetch(`${backendUrl}/api/some-endpoint`)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch wishlist count when user changes
    if (user) {
      fetch(`${backendUrl}/api/wishlist/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => setWishlistCount(Array.isArray(data.items) ? data.items.length : 0))
        .catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  }, [user, backendUrl]);

  // Calculate cart item count from CartContext
  const cartItemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const isHomePage = location.pathname === '/';
  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage 
      ? 'bg-white shadow-md' 
      : 'bg-transparent border-b border-white/10'
  }`;

  const linkClass = `font-medium transition-colors ${
    isScrolled || !isHomePage
      ? 'text-gray-700 hover:text-green-500'
      : 'text-white hover:text-green-300'
  }`;

  const iconClass = `transition-colors ${
    isScrolled || !isHomePage
      ? 'text-gray-600 hover:text-green-500'
      : 'text-white hover:text-green-300'
  }`;

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    // Connects search to backend by navigating to products page with search param
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    // This is a frontend route, not a backend endpoint.
    // The actual backend endpoint called will be something like:
    
    setIsSearchOpen(false);
  };

  return (
    <header className={headerClass}>
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16 md:h-20 ml-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className={`font-bold text-2xl ${isScrolled || !isHomePage ? 'text-green-500' : 'text-white'}`}>
              FreshMart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            <CategoryDropdown isScrolled={isScrolled} isHomePage={isHomePage} />
            <Link to="/products" className={linkClass}>
              All Products
            </Link>
            <Link to="/deals" className={linkClass}>
              Deals
            </Link>
          </nav>

          {/* Desktop Tools */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className={`p-2 ${iconClass}`}
            >
              <Search size={20} />
            </button>
            
            <Link to="/account" className={`p-2 ${iconClass}`}>
              <User size={20} />
            </Link>
            <Link to="/account" state={{ tab: 'wishlist' }} className={`p-2 relative ${iconClass}`}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={toggleCart} 
              className={`p-2 relative ${iconClass}`}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={toggleCart} 
              className={`p-2 relative ${iconClass}`}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={toggleMobileMenu} 
              className={`p-2 ${iconClass}`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar Expanded (Desktop) */}
        {isSearchOpen && (
          <div className={`hidden md:block py-3 border-t ml-4 ${
            isScrolled || !isHomePage 
              ? 'border-gray-100' 
              : 'border-white/10 bg-black/30 backdrop-blur-md rounded-lg'
          }`}>
            <SearchBar 
              onClose={() => setIsSearchOpen(false)} 
              isScrolled={isScrolled || !isHomePage} 
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;