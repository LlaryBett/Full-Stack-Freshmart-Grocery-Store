import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  // Download order details as PDF
  const handleDownloadPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Order #${order._id.slice(-6).toUpperCase()}`, 14, 16);
    doc.setFontSize(10);
    doc.text(`Placed on: ${new Date(order.createdAt).toLocaleString()}`, 14, 24);
    doc.text(`Status: ${order.status}`, 14, 30);

    doc.setFontSize(12);
    doc.text('Delivery Information:', 14, 40);
    doc.setFontSize(10);
    doc.text(`Name: ${order.deliveryInfo?.firstName || ''} ${order.deliveryInfo?.lastName || ''}`, 14, 46);
    doc.text(`Email: ${order.deliveryInfo?.email || ''}`, 14, 52);
    doc.text(`Phone: ${order.deliveryInfo?.phone || ''}`, 14, 58);
    doc.text(`Address: ${order.deliveryInfo?.address || ''}`, 14, 64);
    doc.text(`City: ${order.deliveryInfo?.city || ''}`, 14, 70);
    doc.text(`State: ${order.deliveryInfo?.state || ''}`, 14, 76);
    doc.text(`ZIP: ${order.deliveryInfo?.zip || ''}`, 14, 82);
    if (order.deliveryInfo?.notes) doc.text(`Notes: ${order.deliveryInfo.notes}`, 14, 88);

    doc.setFontSize(12);
    doc.text('Delivery & Payment:', 14, 98);
    doc.setFontSize(10);
    doc.text(`Delivery Option: ${order.deliveryOption}`, 14, 104);
    doc.text(`Delivery Date: ${order.deliveryDate}`, 14, 110);
    doc.text(`Delivery Time: ${order.deliveryTime}`, 14, 116);
    doc.text(`Payment Method: ${order.paymentMethod?.toUpperCase()}`, 14, 122);

    doc.setFontSize(12);
    doc.text('Items:', 14, 132);

    // Prepare items table
    const itemRows = order.items.map((item, idx) => [
      idx + 1,
      item.product?.name || '',
      item.quantity,
      `ksh ${item.price.toFixed(2)}`,
      `ksh ${(item.price * item.quantity).toFixed(2)}`
    ]);
    autoTable(doc, {
      head: [['#', 'Product', 'Qty', 'Price', 'Total']],
      body: itemRows,
      startY: 136,
      theme: 'grid',
      headStyles: { fillColor: [46, 204, 113] },
      styles: { fontSize: 10 }
    });

    let finalY = doc.lastAutoTable?.finalY || 136 + 8 * order.items.length;

    doc.setFontSize(12);
    doc.text('Order Summary:', 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(`Subtotal: ksh ${order.totals?.subtotal?.toFixed(2) ?? '0.00'}`, 14, finalY + 16);
    doc.text(`Shipping: ksh ${order.totals?.shipping?.toFixed(2) ?? '0.00'}`, 14, finalY + 22);
    doc.text(`Tax: ksh ${order.totals?.tax?.toFixed(2) ?? '0.00'}`, 14, finalY + 28);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ksh ${order.totals?.total?.toFixed(2) ?? '0.00'}`, 14, finalY + 36);

    // Add a diagonal "DELIVERED" stamp if status is delivered
    if (order.status && order.status.toLowerCase() === 'delivered') {
      doc.saveGraphicsState();
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(48);
      doc.setFont(undefined, 'bold');
      doc.text('DELIVERED', 35, 180, {
        angle: 25,
        opacity: 0.18
      });
      doc.setFontSize(18);
      doc.setTextColor(60, 60, 60);
      doc.text('FreshMart', 120, 200, { angle: 25, opacity: 0.18 });
      doc.restoreGraphicsState();
    }

    doc.save(`order-${order._id}.pdf`);
  };

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
          <div className="flex justify-end mb-4 gap-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-4 rounded text-sm"
            >
              Download PDF
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-600 mb-2">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          <p className="text-gray-600 mb-4">Status: <span className="font-medium text-green-600">{order.status}</span></p>
          
          {/* Delivery Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delivery Information</h2>
            <div className="text-gray-700 text-sm space-y-1">
              <div><span className="font-medium">Name:</span> {order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}</div>
              <div><span className="font-medium">Email:</span> {order.deliveryInfo?.email}</div>
              <div><span className="font-medium">Phone:</span> {order.deliveryInfo?.phone}</div>
              <div><span className="font-medium">Address:</span> {order.deliveryInfo?.address}</div>
              <div><span className="font-medium">City:</span> {order.deliveryInfo?.city}</div>
              <div><span className="font-medium">State:</span> {order.deliveryInfo?.state}</div>
              <div><span className="font-medium">ZIP:</span> {order.deliveryInfo?.zip}</div>
              {order.deliveryInfo?.notes && (
                <div><span className="font-medium">Notes:</span> {order.deliveryInfo.notes}</div>
              )}
            </div>
          </div>

          {/* Delivery Option, Date, Time, Payment */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delivery & Payment</h2>
            <div className="text-gray-700 text-sm space-y-1">
              <div><span className="font-medium">Delivery Option:</span> {order.deliveryOption}</div>
              <div><span className="font-medium">Delivery Date:</span> {order.deliveryDate}</div>
              <div><span className="font-medium">Delivery Time:</span> {order.deliveryTime}</div>
              <div><span className="font-medium">Payment Method:</span> {order.paymentMethod?.toUpperCase()}</div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Items</h2>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center mb-3">
                  <img src={item.product?.image} alt={item.product?.name} className="w-12 h-12 object-cover rounded mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.product?.name}</div>
                    <div className="text-gray-500 text-sm">
                      Qty: {item.quantity} &times; ksh {item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium text-gray-800">ksh {(item.price * item.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h2>
            <div className="space-y-1 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>ksh {typeof order.totals?.subtotal === 'number' ? order.totals.subtotal.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>ksh {typeof order.totals?.shipping === 'number' ? order.totals.shipping.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>ksh {typeof order.totals?.tax === 'number' ? order.totals.tax.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">
                  ksh {typeof order.totals?.total === 'number' ? order.totals.total.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
