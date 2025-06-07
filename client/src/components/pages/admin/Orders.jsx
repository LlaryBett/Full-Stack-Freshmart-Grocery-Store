import { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Truck,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Sidebar from './Sidebar';

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${backendUrl}/api/orders/orders`, { // <-- update endpoint to /api/orders/orders
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          throw new Error('API endpoint /api/orders/orders not found or not implemented on backend');
        }
        return res.json();
      })
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Helper functions
  const getOrderStatus = (order) =>
    order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending';

  const getCustomerName = (order) =>
    order.deliveryInfo
      ? `${order.deliveryInfo.firstName || ''} ${order.deliveryInfo.lastName || ''}`.trim()
      : order.user?.name || order.user?.email || 'N/A';

  const getPaymentStatus = (order) =>
    order.paymentStatus || (order.paymentMethod === 'cod' ? 'Pending' : 'Paid');

  const getOrderTotal = (order) =>
    typeof order.totals?.total === 'number' ? order.totals.total : 0;

  const getOrderDate = (order) =>
    order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '';

  const getOrderId = (order) =>
    order._id ? `#${order._id.slice(-6).toUpperCase()}` : order.id || '';

  // Analytics: compute stats from orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => getOrderStatus(o).toLowerCase() === 'pending').length;
  const processingOrders = orders.filter(o => getOrderStatus(o).toLowerCase() === 'processing').length;
  const deliveredOrders = orders.filter(o => getOrderStatus(o).toLowerCase() === 'delivered').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <Filter size={20} />
                  <span>Filters</span>
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Pending</p>
                  <h3 className="text-2xl font-bold text-gray-800">{pendingOrders}</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Package className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Processing</p>
                  <h3 className="text-2xl font-bold text-gray-800">{processingOrders}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Delivered</p>
                  <h3 className="text-2xl font-bold text-gray-800">{deliveredOrders}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={orders.length > 0 && selectedOrders.length === orders.length}
                        onChange={handleSelectAll}
                        className="rounded text-green-500 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
                            className="rounded text-green-500 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {getOrderId(order)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{getCustomerName(order)}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {getOrderDate(order)}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          ksh {getOrderTotal(order).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getOrderStatus(order) === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : getOrderStatus(order) === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getOrderStatus(order)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getPaymentStatus(order) === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getPaymentStatus(order)}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {order.paymentMethod?.toUpperCase() || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {/* Hamburger menu: fixed, not hover-based */}
                          <div className="relative">
                            <button
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedOrders([order._id]); // Optionally track which menu is open
                                setOpenMenu(openMenu === order._id ? null : order._id);
                              }}
                              aria-label="Actions"
                            >
                              <MoreVertical size={20} className="text-gray-400" />
                            </button>
                            {openMenu === order._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <div className="py-1">
                                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                                    <Eye size={16} className="mr-2" />
                                    View Details
                                  </button>
                                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                                    <Truck size={16} className="mr-2" />
                                    Update Status
                                  </button>
                                  <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full">
                                    <XCircle size={16} className="mr-2" />
                                    Cancel Order
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center">
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>10 per page</option>
                  <option>25 per page</option>
                  <option>50 per page</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;