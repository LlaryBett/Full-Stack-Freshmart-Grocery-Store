import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../cart/CartItem';
import ProductCard from '../products/ProductCard';
import { products } from '../data/products';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Get recommended products - featured products that aren't in the cart
  const recommendedProducts = products
    .filter(product => product.featured && !cartItems.some(item => item.id === product.id))
    .slice(0, 4);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'Your Cart - FreshMart';
  }, []);

  return (
    <div className="pt-16 md:pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingCart size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>
                  <button 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Clear Cart
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-4">
                      <CartItem 
                        item={item}
                        onRemove={() => removeFromCart(item.id)}
                        onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <Link 
                    to="/products" 
                    className="text-green-500 hover:text-green-600 flex items-center"
                  >
                    <ArrowLeft size={18} className="mr-1" />
                    Continue Shopping
                  </Link>
                  <button className="text-gray-600 hover:text-gray-800 flex items-center">
                    <RefreshCw size={18} className="mr-1" />
                    Update Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">ksh {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">ksh 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">ksh {(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      ksh {(cartTotal + cartTotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium mb-4 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">We Accept:</h3>
                  <div className="flex space-x-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                      alt="Visa" 
                      className="h-8"
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                      alt="Mastercard" 
                      className="h-8"
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                      alt="PayPal" 
                      className="h-8"
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" 
                      alt="Apple Pay" 
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;