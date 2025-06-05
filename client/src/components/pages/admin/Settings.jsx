import { useState } from 'react';
import { 
  Save,
  User,
  Store,
  CreditCard,
  Bell,
  Lock,
  Mail,
  Smartphone,
  Globe,
  AlertTriangle,
  Send
} from 'lucide-react';
import Sidebar from './Sidebar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState('');
  const [broadcastError, setBroadcastError] = useState('');

  // Handler for broadcasting message
  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastLoading(true);
    setBroadcastSuccess('');
    setBroadcastError('');
    try {
      // Replace with your backend API endpoint for broadcasting notifications
      const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
      const res = await fetch(`${backendUrl}/api/admin/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: broadcastMessage })
      });
      if (!res.ok) {
        const data = await res.json();
        setBroadcastError(data.message || 'Failed to broadcast message');
      } else {
        setBroadcastSuccess('Message broadcasted to all users!');
        setBroadcastMessage('');
      }
    } catch {
      setBroadcastError('Network error');
    }
    setBroadcastLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>

          {/* Broadcast Message Section - only show when notifications tab is active */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Send className="mr-2" size={20} /> Broadcast Notification
              </h2>
              <form onSubmit={handleBroadcast} className="space-y-4">
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Type your message to broadcast to all users..."
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  required
                />
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    disabled={broadcastLoading || !broadcastMessage.trim()}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <Send size={18} className="mr-2" />
                    {broadcastLoading ? 'Sending...' : 'Send Broadcast'}
                  </button>
                  {broadcastSuccess && (
                    <span className="text-green-600 text-sm">{broadcastSuccess}</span>
                  )}
                  {broadcastError && (
                    <span className="text-red-600 text-sm">{broadcastError}</span>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm">
                <nav className="p-4">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${
                      activeTab === 'profile'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('store')}
                    className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${
                      activeTab === 'store'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Store size={18} className="mr-3" />
                    Store Settings
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${
                      activeTab === 'payment'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard size={18} className="mr-3" />
                    Payment Methods
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${
                      activeTab === 'notifications'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Bell size={18} className="mr-3" />
                    Notifications
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${
                      activeTab === 'security'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Lock size={18} className="mr-3" />
                    Security
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={32} className="text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            Upload Photo
                          </button>
                          <p className="text-sm text-gray-500 mt-1">
                            JPG, GIF or PNG. Max size of 800K
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Store Settings */}
                {activeTab === 'store' && (
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Store Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Store Name
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Store URL
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            https://
                          </span>
                          <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Store Description
                        </label>
                        <textarea
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Hours
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                            <input
                              type="time"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                            <input
                              type="time"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Store Location
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter store address"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Settings */}
                {activeTab === 'payment' && (
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                              alt="Visa" 
                              className="h-8"
                            />
                            <div className="ml-4">
                              <p className="font-medium text-gray-800">Visa ending in 4242</p>
                              <p className="text-sm text-gray-500">Expires 12/24</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Default
                            </span>
                            <button className="ml-4 text-gray-400 hover:text-gray-500">
                              <MoreVertical size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button className="flex items-center text-green-500 hover:text-green-600">
                        <CreditCard size={20} className="mr-2" />
                        Add New Payment Method
                      </button>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Payment Settings</h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              Save payment information for future purchases
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              Enable automatic payments for subscriptions
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail size={20} className="text-gray-400 mr-3" />
                              <span className="text-gray-600">Order updates</span>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                              defaultChecked
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail size={20} className="text-gray-400 mr-3" />
                              <span className="text-gray-600">Customer messages</span>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                              defaultChecked
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail size={20} className="text-gray-400 mr-3" />
                              <span className="text-gray-600">Promotional emails</span>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone size={20} className="text-gray-400 mr-3" />
                              <span className="text-gray-600">Order status</span>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                              defaultChecked
                            />
                          </label>
                          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone size={20} className="text-gray-400 mr-3" />
                              <span className="text-gray-600">New messages</span>
                            </div>
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                              defaultChecked
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            
                            <label className="block text-sm text-gray-600 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Lock size={20} className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-gray-600">Protect your account with 2FA</p>
                              <p className="text-sm text-gray-500">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                          </div>
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            Enable
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Login History</h3>
                        <div className="space-y-4">
                          {[
                            { device: 'Chrome on Windows', location: 'New York, USA', time: '2 hours ago' },
                            { device: 'Safari on iPhone', location: 'Los Angeles, USA', time: '1 day ago' }
                          ].map((login, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-800">{login.device}</p>
                                <p className="text-sm text-gray-500">{login.location}</p>
                              </div>
                              <span className="text-sm text-gray-500">{login.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">
                                Delete Account
                              </h3>
                              <div className="mt-2 text-sm text-red-700">
                                <p>
                                  Once you delete your account, there is no going back.
                                  Please be certain.
                                </p>
                              </div>
                              <div className="mt-4">
                                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                                  Delete Account
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center">
                    <Save size={20} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;