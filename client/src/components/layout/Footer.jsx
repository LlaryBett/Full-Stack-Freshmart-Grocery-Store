import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">FreshMart</h3>
            <p className="text-gray-600 mb-4">
              Your one-stop shop for fresh groceries delivered at your doorstep. We source the best quality products directly from farmers and producers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-green-500 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="#deals" className="text-gray-600 hover:text-green-500 transition-colors">
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-600 hover:text-green-500 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="#about" className="text-gray-600 hover:text-green-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#blog" className="text-gray-600 hover:text-green-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#help" className="text-gray-600 hover:text-green-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#faq" className="text-gray-600 hover:text-green-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="#shipping" className="text-gray-600 hover:text-green-500 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="#returns" className="text-gray-600 hover:text-green-500 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="#privacy" className="text-gray-600 hover:text-green-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-green-500 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  123 Grocery Street, Market City, MC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-green-500 mr-2" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-green-500 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-green-500 mr-2" />
                <a href="mailto:support@freshmart.com" className="text-gray-600 hover:text-green-500 transition-colors">
                  support@freshmart.com
                </a>
              </li>
            </ul>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Download Our App</h4>
              <div className="flex space-x-2">
                <a href="#" className="block">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                    alt="App Store" 
                    className="h-10"
                  />
                </a>
                <a href="#" className="block">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                    alt="Google Play" 
                    className="h-10"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FreshMart. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              className="h-6"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
              alt="Mastercard" 
              className="h-6"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
              alt="PayPal" 
              className="h-6"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" 
              alt="Apple Pay" 
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;