import React from 'react';
import { useGetOrdersQuery } from '../../redux/features/orders/ordersSlice';
import { FaTruck, FaDollarSign, FaUser, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa';

const OrderPage: React.FC = () => {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  if (isLoading)
    return <div className="text-center mt-10 text-gray-500">Loading orders...</div>;
  if (isError)
    return <div className="text-center mt-10 text-red-500">Error fetching orders!</div>;
  if (orders.length === 0)
    return <div className="text-center mt-10 text-gray-500">You have no orders yet.</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-black">
        Your Orders
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {/* Gradient stripe on top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-yellow-500"></div>

            <div className="p-6">
              {/* Status badge */}
              <div className="flex justify-end mb-3">
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-600">
                  • Processing
                </span>
              </div>

              {/* Header: Date */}
              <div className="flex items-center justify-between mb-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt /> {new Date(order.created_at).toLocaleDateString('en-US')}
                </div>
                <div className="flex items-center gap-1 font-semibold text-green-600 bg-green-50 px-2 py-1 rounded shadow-sm">
                  <FaDollarSign /> {Number(order.total_price).toFixed(2)}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-4">
                <h4 className="flex items-center gap-2 font-semibold mb-1 text-gray-700">
                  <FaUser /> Shipping Information
                </h4>
                <p className="text-gray-600 text-sm">
                  {order.shipping_info.name}<br />
                  {order.shipping_info.address}, {order.shipping_info.city}, {order.shipping_info.state}, {order.shipping_info.zipcode}<br />
                  {order.shipping_info.phone}
                </p>
              </div>

              {/* Items */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <FaBoxOpen /> Items
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {order.items.map((item) => (
                    <li
                      key={item._id}
                      className="hover:bg-gray-50 p-1 rounded transition-colors"
                    >
                      {item.title} × {item.quantity} (${item.newPrice} each)
                    </li>
                  ))}
                </ul>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                <FaTruck />
                <span>Estimated arrival: within 3-12 days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;