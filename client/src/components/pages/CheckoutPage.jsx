import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  });
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate order totals
  const shipping = deliveryOption === 'express' ? 5.99 : 0;
  const tax = cartTotal * 0.1;
  const orderTotal = cartTotal + shipping + tax;

  // Available delivery dates (next 7 days)
  const deliveryDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  // Available delivery time slots
  const deliveryTimeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00'
  ];

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'Checkout - FreshMart';
    
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Set default delivery date and time
    setDeliveryDate(deliveryDates[0]);
    setDeliveryTime(deliveryTimeSlots[0]);
    
    // Prefill user info if available
    if (user) {
      setDeliveryInfo(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || ''
      }));
    }
  }, [cartItems.length, navigate, user]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const validateDeliveryInfo = () => {
    const newErrors = {};
    
    if (!deliveryInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!deliveryInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!deliveryInfo.email.trim()) newErrors.email = 'Email is required';
    if (!deliveryInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!deliveryInfo.address.trim()) newErrors.address = 'Address is required';
    if (!deliveryInfo.city.trim()) newErrors.city = 'City is required';
    if (!deliveryInfo.state.trim()) newErrors.state = 'State is required';
    if (!deliveryInfo.zip.trim()) newErrors.zip = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is filled
    if (value.trim() && errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const goToNextStep = () => {
    if (activeStep === 1 && !validateDeliveryInfo()) {
      return;
    }
    
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }
    setPlacingOrder(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || user.id })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to place order');
        setPlacingOrder(false);
        return;
      }
      clearCart();
      toast.success('Order placed successfully!');
      // Optionally redirect or show order details
    } catch {
      toast.error('Network error');
    }
    setPlacingOrder(false);
  };

  return (
    <div className="pt-16 md:pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex items-center mb-6">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                activeStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="font-medium">Delivery</span>
            </div>
            
            <ChevronRight size={20} className="mx-2 text-gray-300" />
            
            <div className={`flex items-center ${activeStep >= 2 ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                activeStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="font-medium">Schedule</span>
            </div>
            
            <ChevronRight size={20} className="mx-2 text-gray-300" />
            
            <div className={`flex items-center ${activeStep >= 3 ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                activeStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Step 1: Delivery Information */}
              {activeStep === 1 && (
                <div>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center mb-4">
                      <MapPin size={20} className="text-green-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800">Delivery Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={deliveryInfo.firstName}
                          onChange={handleDeliveryInfoChange}
                          className={`w-full border ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={deliveryInfo.lastName}
                          onChange={handleDeliveryInfoChange}
                          className={`w-full border ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                          } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={deliveryInfo.email}
                          onChange={handleDeliveryInfoChange}
                          className={`w-full border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Phone*
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={deliveryInfo.phone}
                          onChange={handleDeliveryInfoChange}
                          className={`w-full border ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Address*
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={deliveryInfo.address}
                          onChange={handleDeliveryInfoChange}
                          className={`w-full border ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                          } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={deliveryInfo.city}
                          onChange={handleDeliveryInfoChange}
                          className={`w-full border ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            State*
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={deliveryInfo.state}
                            onChange={handleDeliveryInfoChange}
                            className={`w-full border ${
                              errors.state ? 'border-red-500' : 'border-gray-300'
                            } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                          />
                          {errors.state && (
                            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            ZIP Code*
                          </label>
                          <input
                            type="text"
                            name="zip"
                            value={deliveryInfo.zip}
                            onChange={handleDeliveryInfoChange}
                            className={`w-full border ${
                              errors.zip ? 'border-red-500' : 'border-gray-300'
                            } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500`}
                          />
                          {errors.zip && (
                            <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Delivery Notes (Optional)
                        </label>
                        <textarea
                          name="notes"
                          value={deliveryInfo.notes}
                          onChange={handleDeliveryInfoChange}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Special instructions for delivery"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex justify-between">
                    <Link 
                      to="/cart" 
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Back to Cart
                    </Link>
                    <button
                      onClick={goToNextStep}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors"
                    >
                      Continue to Delivery Schedule
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Delivery Schedule */}
              {activeStep === 2 && (
                <div>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center mb-6">
                      <Calendar size={20} className="text-green-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800">Delivery Schedule</h2>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-3">Delivery Options</h3>
                      <div className="space-y-3">
                        <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-green-200 transition-colors">
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="standard"
                            checked={deliveryOption === 'standard'}
                            onChange={() => setDeliveryOption('standard')}
                            className="mt-1 text-green-500 focus:ring-green-500"
                          />
                          <div className="ml-3">
                            <span className="block font-medium text-gray-800">Standard Delivery</span>
                            <span className="block text-sm text-gray-500">Free delivery on orders over ksh 1000</span>
                          </div>
                          <span className="ml-auto font-medium text-gray-800">ksh 0.00</span>
                        </label>
                        
                        <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-green-200 transition-colors">
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="express"
                            checked={deliveryOption === 'express'}
                            onChange={() => setDeliveryOption('express')}
                            className="mt-1 text-green-500 focus:ring-green-500"
                          />
                          <div className="ml-3">
                            <span className="block font-medium text-gray-800">Express Delivery</span>
                            <span className="block text-sm text-gray-500">Same-day delivery (order before 2PM)</span>
                          </div>
                          <span className="ml-auto font-medium text-gray-800">ksh 128</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Delivery Date
                        </label>
                        <div className="relative">
                          <select
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {deliveryDates.map(date => (
                              <option key={date} value={date}>
                                {new Date(date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Delivery Time
                        </label>
                        <div className="relative">
                          <select
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {deliveryTimeSlots.map(slot => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                      <Clock size={20} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 font-medium">Delivery Time Information</p>
                        <p className="text-amber-700 text-sm mt-1">
                          Please note that all deliveries are subject to availability and weather conditions.
                          You'll receive a confirmation email with tracking information once your order is on its way.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex justify-between">
                    <button
                      onClick={goToPreviousStep}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Back to Delivery Information
                    </button>
                    <button
                      onClick={goToNextStep}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment */}
              {activeStep === 3 && (
                <div>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center mb-6">
                      <CreditCard size={20} className="text-green-500 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-green-200 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mt-1 text-green-500 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-800">Credit/Debit Card</span>
                          <span className="block text-sm text-gray-500">
                            Pay with Visa, Mastercard, or American Express
                          </span>
                        </div>
                        <div className="ml-auto flex space-x-2">
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
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_(2018).svg" 
                            alt="American Express" 
                            className="h-6"
                          />
                        </div>
                      </label>
                      
                      <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-green-200 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mt-1 text-green-500 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-800">PayPal</span>
                          <span className="block text-sm text-gray-500">
                            Pay with your PayPal account
                          </span>
                        </div>
                        <div className="ml-auto">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                            alt="PayPal" 
                            className="h-6"
                          />
                        </div>
                      </label>
                      
                      <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-green-200 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="applepay"
                          checked={paymentMethod === 'applepay'}
                          onChange={() => setPaymentMethod('applepay')}
                          className="mt-1 text-green-500 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-800">Apple Pay</span>
                          <span className="block text-sm text-gray-500">
                            Fast, secure checkout with Apple Pay
                          </span>
                        </div>
                        <div className="ml-auto">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" 
                            alt="Apple Pay" 
                            className="h-6"
                          />
                        </div>
                      </label>
                      
                      <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-green-200 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 text-green-500 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-800">Cash on Delivery</span>
                          <span className="block text-sm text-gray-500">
                            Pay when you receive your order
                          </span>
                        </div>
                      </label>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="mt-6 border-t border-gray-100 pt-6">
                        <h3 className="font-medium text-gray-700 mb-4">Card Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                      <AlertCircle size={20} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 font-medium">Secure Payments</p>
                        <p className="text-amber-700 text-sm mt-1">
                          All transactions are secure and encrypted. Your payment information is never stored on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 flex justify-between">
                    <button
                      onClick={goToPreviousStep}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Back to Delivery Schedule
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors"
                    >
                      {placingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex py-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ksh {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-800">
                        ksh {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">ksh {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">ksh {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">ksh {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    ksh {orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Delivery Method */}
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Delivery Method</h3>
                <p className="text-gray-600 text-sm">
                  {deliveryOption === 'standard' ? 'Standard Delivery (1-2 days)' : 'Express Delivery (Same day)'}
                </p>
                {activeStep >= 2 && deliveryDate && deliveryTime && (
                  <p className="text-gray-600 text-sm mt-1">
                    Scheduled for {new Date(deliveryDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })} between {deliveryTime}
                  </p>
                )}
              </div>
              
              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-r-md transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;