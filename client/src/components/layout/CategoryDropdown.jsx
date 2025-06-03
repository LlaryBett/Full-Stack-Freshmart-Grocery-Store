import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { categories } from '../data/categories';

const CategoryDropdown = ({ isScrolled, isHomePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClass = `flex items-center font-medium transition-colors ${
    isScrolled || !isHomePage
      ? 'text-gray-700 hover:text-green-500'
      : 'text-white hover:text-green-300'
  }`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={buttonClass}
        onClick={() => setIsOpen(!isOpen)}
      >
        Categories <ChevronDown size={16} className="ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-60 bg-white shadow-xl rounded-lg overflow-hidden z-50">
          <div className="p-2 grid grid-cols-1 gap-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-green-500 mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;