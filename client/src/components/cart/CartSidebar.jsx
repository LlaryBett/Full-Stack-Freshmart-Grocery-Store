import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, ChevronRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-md h-full overflow-hidden transform transition-transform duration-300 flex flex-col">
        {/* Cart Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingCart size={20} className="text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ShoppingCart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <button 
                onClick={onClose}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onRemove={() => removeFromCart(item.id)}
                  onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                />
              ))}
              
              {cartItems.length > 0 && (
                <button 
                  onClick={clearCart}
                  className="flex items-center text-red-500 hover:text-red-600 text-sm mt-4"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear cart
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Subtotal */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">ksh {cartTotal.toFixed(2)}</span>
            </div>
            
            {/* Delivery */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery:</span>
              <span className="font-medium">ksh 0.00</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total:</span>
              <span>ksh {cartTotal.toFixed(2)}</span>
            </div>
            
            {/* Checkout Button */}
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
            >
              Proceed to Checkout
            </Link>
            
            {/* Continue Shopping */}
            <button 
              onClick={onClose}
              className="block w-full text-center mt-3 text-gray-600 hover:text-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;