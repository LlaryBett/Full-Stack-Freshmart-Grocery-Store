import { Link } from 'react-router-dom';
import { X, User, Heart, Home, Package, Tag, Headphones } from 'lucide-react';
import { categories } from '../data/categories';

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="flex items-center text-gray-700 hover:text-green-500 py-2"
                onClick={onClose}
              >
                <Home size={20} className="mr-3" />
                Home
              </Link>
            </li>
            
            <li className="py-2">
              <p className="text-gray-500 font-medium mb-2">Categories</p>
              <ul className="pl-3 space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link 
                      to={`/products?category=${category.id}`} 
                      className="flex items-center text-gray-700 hover:text-green-500 py-1"
                      onClick={onClose}
                    >
                      <span className="text-green-500 mr-2">{category.icon}</span>
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center text-green-500 font-medium py-1"
                    onClick={onClose}
                  >
                    View All Categories
                  </Link>
                </li>
              </ul>
            </li>
            
            <li>
              <Link 
                to="#deals" 
                className="flex items-center text-gray-700 hover:text-green-500 py-2"
                onClick={onClose}
              >
                <Tag size={20} className="mr-3" />
                Deals & Offers
              </Link>
            </li>
            
            <li>
              <Link 
                to="/account" 
                className="flex items-center text-gray-700 hover:text-green-500 py-2"
                onClick={onClose}
              >
                <User size={20} className="mr-3" />
                My Account
              </Link>
            </li>
            
            <li>
              <Link 
                to="/account/wishlist" 
                className="flex items-center text-gray-700 hover:text-green-500 py-2"
                onClick={onClose}
              >
                <Heart size={20} className="mr-3" />
                Wishlist
              </Link>
            </li>
            
            <li>
              <Link 
                to="/account/orders" 
                className="flex items-center text-gray-700 hover:text-green-500 py-2"
                onClick={onClose}
              >
                <Package size={20} className="mr-3" />
                My Orders
              </Link>
            </li>
            
            <li>
              <Link 
                to="#support" 
                className="flex items-center text-gray-700 hover:text-green-500 py-2"
                onClick={onClose}
              >
                <Headphones size={20} className="mr-3" />
                Help & Support
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;