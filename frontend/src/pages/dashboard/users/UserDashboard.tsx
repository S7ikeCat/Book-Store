import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import type { IOrder } from '../../../types/types';

// Пример API функции для получения заказов пользователя
const fetchOrdersByEmail = async (email: string): Promise<IOrder[]> => {
  const res = await fetch(`/api/orders?email=${email}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    fetchOrdersByEmail(currentUser.email)
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (!currentUser) return <div>Please log in to see your dashboard</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Welcome, {currentUser.email}! Here are your recent orders:
        </p>

        {orders.length > 0 ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-1"
              >
                <p className="font-medium">Order ID: {order.id}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total: ${order.totalPrice}</p>
                {order.productIds.map((pid) => (
                  <p key={pid} className="ml-1">
                    Product ID: {pid}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">You have no recent orders.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
