import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-8 text-center">Loading order details...</div>;
  if (!order || order.message) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  return (
    <div className="pt-16 md:pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/account"
          state={{ tab: 'orders' }}
          className="text-green-500 hover:text-green-600 mb-4 inline-block"
        >
          &larr; Back to Orders
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-600 mb-2">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          <p className="text-gray-600 mb-4">Status: <span className="font-medium text-green-600">{order.status}</span></p>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Items</h2>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center mb-3">
                  <img src={item.product?.image} alt={item.product?.name} className="w-12 h-12 object-cover rounded mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.product?.name}</div>
                    <div className="text-gray-500 text-sm">Qty: {item.quantity} &times; ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="font-semibold text-gray-700">Total:</span>
            <span className="font-bold text-green-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
