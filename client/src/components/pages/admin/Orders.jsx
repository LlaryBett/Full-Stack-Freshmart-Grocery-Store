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
  XCircle,
  X,
  Pencil
} from 'lucide-react';
import Sidebar from './Sidebar';
import { Toaster, toast } from 'react-hot-toast';

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const orderStatuses = [
    'pending',
    'confirmed',
    'processing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'refunded'
  ];

  // Fetch all orders
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${backendUrl}/api/orders`, {  // Just /api/orders to match the backend route
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setOrders([]);
      })
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

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdatingStatus(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${backendUrl}/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      
      setOrders(orders.map(order => 
        order._id === selectedOrder._id ? data : order
      ));

      setIsUpdateModalOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
      toast.success(data.message || 'Status updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditOrder = async (updatedOrder) => {
    if (!editingOrder) return;
    
    setUpdating(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${backendUrl}/api/orders/${editingOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedOrder)
      });

      if (!res.ok) throw new Error('Failed to update order');
      
      const updated = await res.json();
      setOrders(orders.map(order => 
        order._id === editingOrder._id ? updated : order
      ));

      setIsEditModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    if (!orderId) return;
    setCancellingId(orderId);
    toast(
      (t) => (
        <div>
          <div className="mb-2">Are you sure you want to cancel this order?</div>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => {
                setCancellingId(null);
                toast.dismiss(t.id);
              }}
            >
              No
            </button>
            <button
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              onClick={async () => {
                toast.dismiss(t.id);
                setCancelling(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
                const token = localStorage.getItem('token');
                try {
                  const res = await fetch(`${backendUrl}/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  if (!res.ok) throw new Error('Failed to cancel order');
                  setOrders(orders.filter(order => order._id !== orderId));
                  setOpenMenu(null);
                  toast.success('Order cancelled');
                } catch (error) {
                  toast.error('Error cancelling order');
                  console.error('Error cancelling order:', error);
                } finally {
                  setCancelling(false);
                  setCancellingId(null);
                }
              }}
              disabled={cancelling}
            >
              {cancelling && cancellingId === orderId ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
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
                                  {/* Removed View Details button */}
                                  <button 
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                    onClick={() => {
                                      setEditingOrder(order);
                                      setIsEditModalOpen(true);
                                      setOpenMenu(null);
                                    }}
                                  >
                                    <Pencil size={16} className="mr-2" />
                                    Edit Order
                                  </button>
                                  <button 
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setNewStatus(order.status || 'pending');
                                      setIsUpdateModalOpen(true);
                                      setOpenMenu(null);
                                    }}
                                  >
                                    <Truck size={16} className="mr-2" />
                                    Update Status
                                  </button>
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                    onClick={() => handleCancelOrder(order._id)}
                                    disabled={cancelling && cancellingId === order._id}
                                  >
                                    <XCircle size={16} className="mr-2" />
                                    {cancelling && cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
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

      {/* Status Update Modal */}
      {isUpdateModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" 
               onClick={() => setIsUpdateModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Order Status</h3>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Order ID: {getOrderId(selectedOrder)}</p>
              <p className="text-sm text-gray-600 mb-4">Current Status: {getOrderStatus(selectedOrder)}</p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              >
                <option value="">Select status...</option>
                {orderStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updatingStatus}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Order #{getOrderId(editingOrder)}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Delivery Information */}
              <div>
                <h4 className="font-medium mb-3">Delivery Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingOrder.deliveryInfo?.firstName || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        firstName: e.target.value
                      }
                    })}
                    placeholder="First Name"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={editingOrder.deliveryInfo?.lastName || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        lastName: e.target.value
                      }
                    })}
                    placeholder="Last Name"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="email"
                    value={editingOrder.deliveryInfo?.email || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        email: e.target.value
                      }
                    })}
                    placeholder="Email"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="tel"
                    value={editingOrder.deliveryInfo?.phone || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        phone: e.target.value
                      }
                    })}
                    placeholder="Phone"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={editingOrder.deliveryInfo?.address || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        address: e.target.value
                      }
                    })}
                    placeholder="Address"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500 md:col-span-2"
                  />
                  <input
                    type="text"
                    value={editingOrder.deliveryInfo?.city || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        city: e.target.value
                      }
                    })}
                    placeholder="City"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={editingOrder.deliveryInfo?.state || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        state: e.target.value
                      }
                    })}
                    placeholder="State"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    value={editingOrder.deliveryInfo?.zip || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        zip: e.target.value
                      }
                    })}
                    placeholder="ZIP Code"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <textarea
                    value={editingOrder.deliveryInfo?.notes || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {
                        ...editingOrder.deliveryInfo,
                        notes: e.target.value
                      }
                    })}
                    placeholder="Delivery Notes"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500 md:col-span-2"
                    rows={2}
                  />
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="font-medium mb-3">Delivery Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={editingOrder.deliveryOption || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryOption: e.target.value
                    })}
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Delivery Option</option>
                    <option value="standard">Standard Delivery</option>
                    <option value="express">Express Delivery</option>
                  </select>
                  <input
                    type="date"
                    value={editingOrder.deliveryDate || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryDate: e.target.value
                    })}
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={editingOrder.deliveryTime || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryTime: e.target.value
                    })}
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Time Slot</option>
                    <option value="08:00 - 10:00">08:00 - 10:00</option>
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                  </select>
                  <select
                    value={editingOrder.paymentMethod || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      paymentMethod: e.target.value
                    })}
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Card Payment</option>
                    <option value="mpesa">M-Pesa</option>
                  </select>
                </div>
              </div>

              {/* Order Totals */}
              <div>
                <h4 className="font-medium mb-3">Order Totals</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={editingOrder.totals?.subtotal || 0}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      totals: {
                        ...editingOrder.totals,
                        subtotal: Number(e.target.value)
                      }
                    })}
                    placeholder="Subtotal"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={editingOrder.totals?.shipping || 0}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      totals: {
                        ...editingOrder.totals,
                        shipping: Number(e.target.value)
                      }
                    })}
                    placeholder="Shipping"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={editingOrder.totals?.tax || 0}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      totals: {
                        ...editingOrder.totals,
                        tax: Number(e.target.value)
                      }
                    })}
                    placeholder="Tax"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={editingOrder.totals?.total || 0}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      totals: {
                        ...editingOrder.totals,
                        total: Number(e.target.value)
                      }
                    })}
                    placeholder="Total"
                    className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditOrder(editingOrder)}
                  disabled={updating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Orders;