import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Bell, 
  LogOut, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const AccountPage = () => {
  // eslint-disable-next-line no-undef
  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab from location.state if present
    if (location.state && location.state.tab) {
      return location.state.tab;
    }
    return 'profile';
  });
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });
  const [addressFormLoading, setAddressFormLoading] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'My Account - FreshMart';
    
    // Check if order was just placed
    if (location.state && location.state.orderPlaced) {
      setShowOrderSuccess(true);
      setTimeout(() => {
        setShowOrderSuccess(false);
      }, 5000);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      setOrdersLoading(true);
      fetch(`${backendUrl}/api/orders/user/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => {
          setOrders([]);
          toast.error('Failed to load orders');
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, user, backendUrl]);

  // Fetch wishlist when wishlist tab is active
  useEffect(() => {
    if (activeTab === 'wishlist' && user) {
      setWishlistLoading(true);
      fetch(`${backendUrl}/api/wishlist/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => setWishlist(Array.isArray(data.items) ? data.items : []))
        .catch(() => {
          setWishlist([]);
          toast.error('Failed to load wishlist');
        })
        .finally(() => setWishlistLoading(false));
    }
  }, [activeTab, user, backendUrl]);

  // Fetch addresses when addresses tab is active
  useEffect(() => {
    if (activeTab === 'addresses' && user) {
      setAddressesLoading(true);
      fetch(`${backendUrl}/api/addresses/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => setAddresses(Array.isArray(data) ? data : []))
        .catch(() => {
          setAddresses([]);
          toast.error('Failed to load addresses');
        })
        .finally(() => setAddressesLoading(false));
    }
  }, [activeTab, user, backendUrl]);

  // Fetch notifications when notifications tab is active
  useEffect(() => {
    if (activeTab === 'notifications' && user) {
      setNotificationsLoading(true);
      fetch(`${backendUrl}/api/notifications/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => setNotifications(Array.isArray(data) ? data : []))
        .catch(() => {
          setNotifications([]);
          toast.error('Failed to load notifications');
        })
        .finally(() => setNotificationsLoading(false));
    }
  }, [activeTab, user, backendUrl]);

  const handleLoginChange = e => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed');
        setLoginLoading(false);
        return;
      }
      // Call AuthContext login with the user data from backend
      login(data.user); // <-- this will trigger the console.log in AuthContext
      toast.success('Login successful!');
      window.location.href = '/';
    } catch {
      setLoginError('Network error');
      toast.error('Network error');
    }
    setLoginLoading(false);
  };

  useEffect(() => {
    // If navigated with state.tab, update activeTab
    if (location.state && location.state.tab && location.state.tab !== activeTab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Handler for address form input
  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  // Handler for submitting new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressFormLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/addresses/${user._id || user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAddresses(prev => [...prev, data]);
      setShowAddressForm(false);
      setAddressForm({
        label: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
      });
      toast.success('Address added');
    } catch {
      toast.error('Could not add address');
    }
    setAddressFormLoading(false);
  };

  // Handler for editing address
  const handleEditAddress = (address) => {
    setEditAddressId(address._id);
    setAddressForm({
      label: address.label || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || '',
      phone: address.phone || ''
    });
    setShowAddressForm(true);
  };

  // Handler for submitting edited address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setAddressFormLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/addresses/${user._id || user.id}/${editAddressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAddresses(addresses.map(a => (a._id === editAddressId ? data : a)));
      setShowAddressForm(false);
      setEditAddressId(null);
      setAddressForm({
        label: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
      });
      toast.success('Address updated');
    } catch {
      toast.error('Could not update address');
    }
    setAddressFormLoading(false);
  };

  if (!user) {
    // Show login/signup options if not logged in
    return (
      <div className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              Login to Your Account
            </h1>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="text-green-500 focus:ring-green-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-green-500 hover:text-green-600">
                    Forgot password?
                  </Link>
                </div>
                {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account? 
                  <Link to="/account/register" className="text-green-500 hover:text-green-600 ml-1">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      {showOrderSuccess && (
        <div className="fixed top-20 inset-x-0 flex justify-center z-50 px-4">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <Check size={20} className="mr-2" />
            <p>Your order has been placed successfully! Thank you for shopping with us.</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                    <User size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'profile'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User size={18} className="mr-3" />
                      Profile
                    </button>
                  </li>
                  
                  <li>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'orders'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ShoppingBag size={18} className="mr-3" />
                      Orders
                    </button>
                  </li>
                  
                  <li>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'wishlist'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Heart size={18} className="mr-3" />
                      Wishlist
                    </button>
                  </li>
                  
                  <li>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'addresses'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin size={18} className="mr-3" />
                      Addresses
                    </button>
                  </li>
                  
                  <li>
                    <button
                      onClick={() => setActiveTab('payment')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'payment'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard size={18} className="mr-3" />
                      Payment Methods
                    </button>
                  </li>
                  
                  <li>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'notifications'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Bell size={18} className="mr-3" />
                      Notifications
                    </button>
                  </li>
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.firstName}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.lastName}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={user.phone}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Order History</h2>
                  {ordersLoading ? (
                    <div className="text-gray-500">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-gray-500">No orders found.</div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                            <div>
                              <p className="font-medium text-gray-700">Order #{order._id.slice(-6).toUpperCase()}</p>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {order.status}
                              </span>
                              <p className="text-sm text-gray-500 mt-1">
                                Total: ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-4">
                              {order.items.map((item, idx) => (
                                <img
                                  key={idx}
                                  src={item.product?.image}
                                  alt={item.product?.name}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                              ))}
                            </div>
                            <div className="mt-4 flex justify-between">
                              <button
                                className="text-green-500 hover:text-green-600 font-medium"
                                onClick={() => navigate(`/orders/${order._id}`)}
                              >
                                View Order Details
                              </button>
                              {/* Optionally add reorder functionality */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">My Wishlist</h2>
                  {wishlistLoading ? (
                    <div className="text-gray-500">Loading wishlist...</div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-gray-500">Your wishlist is empty.</div>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map(product => (
                        <div key={product._id || product.id} className="border border-gray-200 rounded-lg p-4 flex">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-24 h-24 object-cover rounded-md"
                          />
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.description || product.category}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="font-medium text-gray-800">${product.price?.toFixed(2)}</span>
                              <div className="flex space-x-2">
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm transition-colors"
                                  onClick={() => {
                                    addToCart(product, 1);
                                    toast.success('Added to cart');
                                  }}
                                >
                                  Add to Cart
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-600 py-1 px-2"
                                  onClick={async () => {
                                    // Remove from wishlist
                                    try {
                                      await fetch(`${backendUrl}/api/wishlist/${user._id || user.id}`, {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ productId: product._id || product.id })
                                      });
                                      setWishlist(wishlist.filter(p => (p._id || p.id) !== (product._id || product.id)));
                                      toast.success('Removed from wishlist');
                                    } catch {
                                      toast.error('Could not remove from wishlist');
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                      onClick={() => setShowAddressForm(true)}
                    >
                      Add New Address
                    </button>
                  </div>
                  {showAddressForm && (
                    <form onSubmit={editAddressId ? handleUpdateAddress : handleAddAddress} className="mb-6 bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Label</label>
                          <input
                            type="text"
                            name="label"
                            value={addressForm.label}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                            placeholder="Home, Work, etc."
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={addressForm.address}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">ZIP</label>
                          <input
                            type="text"
                            name="zip"
                            value={addressForm.zip}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressFormChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={addressFormLoading}
                          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors"
                        >
                          {addressFormLoading
                            ? (editAddressId ? 'Saving...' : 'Saving...')
                            : (editAddressId ? 'Update Address' : 'Save Address')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditAddressId(null);
                            setAddressForm({
                              label: '',
                              address: '',
                              city: '',
                              state: '',
                              zip: '',
                              country: '',
                              phone: ''
                            });
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  {addressesLoading ? (
                    <div className="text-gray-500">Loading addresses...</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-gray-500">No addresses found.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(address => (
                        <div key={address._id} className="border border-gray-200 rounded-lg p-4 relative">
                          {address.isDefault && (
                            <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                          <h3 className="font-medium text-gray-800 mb-1">{address.label || 'Address'}</h3>
                          <p className="text-gray-600 text-sm">
                            {address.address}<br />
                            {address.city && <>{address.city}, </>}
                            {address.state && <>{address.state}, </>}
                            {address.zip && <>{address.zip}<br /></>}
                            {address.country && <>{address.country}<br /></>}
                            {address.phone && <>Phone: {address.phone}</>}
                          </p>
                          <div className="mt-4 flex space-x-3">
                            <button
                              className="text-gray-600 hover:text-gray-800 text-sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </button>
                            {!address.isDefault && (
                              <button
                                className="text-gray-600 hover:text-gray-800 text-sm"
                                onClick={async () => {
                                  // Set as default
                                  try {
                                    await fetch(`${backendUrl}/api/addresses/${user._id || user.id}/${address._id}/default`, {
                                      method: 'PUT'
                                    });
                                    // Refresh addresses
                                    const res = await fetch(`${backendUrl}/api/addresses/${user._id || user.id}`);
                                    const data = await res.json();
                                    setAddresses(Array.isArray(data) ? data : []);
                                    toast.success('Set as default address');
                                  } catch {
                                    toast.error('Could not set default address');
                                  }
                                }}
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              className="text-red-500 hover:text-red-600 text-sm"
                              onClick={async () => {
                                // Delete address
                                try {
                                  await fetch(`${backendUrl}/api/addresses/${user._id || user.id}/${address._id}`, {
                                    method: 'DELETE'
                                  });
                                  setAddresses(addresses.filter(a => a._id !== address._id));
                                  toast.success('Address deleted');
                                } catch {
                                  toast.error('Could not delete address');
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
                    <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm transition-colors">
                      Add New Card
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 relative">
                      <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Default
                      </span>
                      <div className="flex items-center">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                          alt="Visa" 
                          className="h-8 mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 05/25</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-600 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                          alt="Mastercard" 
                          className="h-8 mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">Mastercard ending in 5678</p>
                          <p className="text-sm text-gray-500">Expires 12/26</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Set as Default
                        </button>
                        <button className="text-red-500 hover:text-red-600 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                    <button
                      className="flex items-center text-green-600 hover:text-green-700 font-medium"
                      onClick={() => setShowNotificationSettings(v => !v)}
                    >
                      Notification Settings
                      {showNotificationSettings ? (
                        <ChevronUp size={18} className="ml-1" />
                      ) : (
                        <ChevronDown size={18} className="ml-1" />
                      )}
                    </button>
                  </div>
                  {showNotificationSettings && (
                    <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-3">Email Notifications</h3>
                          <div className="space-y-3">
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Order confirmations and updates</span>
                              <input 
                                type="checkbox" 
                                defaultChecked
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Promotional emails and offers</span>
                              <input 
                                type="checkbox" 
                                defaultChecked
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Product recommendations</span>
                              <input 
                                type="checkbox"
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Newsletter</span>
                              <input 
                                type="checkbox" 
                                defaultChecked
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700 mb-3">Push Notifications</h3>
                          <div className="space-y-3">
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Order status updates</span>
                              <input 
                                type="checkbox" 
                                defaultChecked
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Delivery notifications</span>
                              <input 
                                type="checkbox" 
                                defaultChecked
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-gray-600">Promotions and offers</span>
                              <input 
                                type="checkbox"
                                className="toggle toggle-green rounded-full"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors">
                            Save Preferences
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Notifications List */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">Recent Notifications</h3>
                    {notificationsLoading ? (
                      <div className="text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="text-gray-500">No notifications yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map(n => (
                          <div
                            key={n._id}
                            className={`border rounded-lg p-4 flex items-start space-x-3 ${n.read ? 'bg-gray-50' : 'bg-green-50'}`}
                          >
                            <Bell className="mt-1 text-green-500" size={20} />
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{n.message}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                                {!n.read && (
                                  <button
                                    className="ml-4 text-green-500 hover:underline text-xs"
                                    onClick={async () => {
                                      try {
                                        await fetch(`${backendUrl}/api/notifications/${user._id || user.id}/${n._id}/read`, {
                                          method: 'PUT'
                                        });
                                        setNotifications(notifications.map(x =>
                                          x._id === n._id ? { ...x, read: true } : x
                                        ));
                                      } catch {
                                        toast.error('Could not mark as read');
                                      }
                                    }}
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;