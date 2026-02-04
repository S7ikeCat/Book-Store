import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersSlice';
import { useAuth } from '../../context/AuthContext';
import type { OrderData } from '../../types/ordersTypes';

const OrderPage: React.FC = () => {
  const { currentUser } = useAuth();

  const email = currentUser?.email || '';
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(email);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found!</div>
      ) : (
        orders.map((order: OrderData, index) => (
          <div key={order.id} className="border-b mb-4 pb-4">
            <p className='p-1 bg-secondary text-white w-10 rounded mb-1'># {index + 1}</p>
            <h2 className="font-bold">Order ID: {order.id}</h2>
            <p className="text-gray-600">Email: {order.user_email}</p>
            <p className="text-gray-600">Total Price: ${order.total_price}</p>

            <h3 className="font-semibold mt-2">Shipping Info:</h3>
            <p>Name: {order.shipping_info.name}</p>
            <p>Phone: {order.shipping_info.phone}</p>
            <p>Address: {order.shipping_info.address}, {order.shipping_info.city}, {order.shipping_info.state}, {order.shipping_info.zipcode}, {order.shipping_info.country}</p>

            <h3 className="font-semibold mt-2">Items:</h3>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.title} x {item.quantity} (${item.newPrice} each)
                </li>
              ))}
            </ul>

            <p className="text-gray-500 text-sm mt-2">Ordered at: {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;
