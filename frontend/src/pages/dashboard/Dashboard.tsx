import React, { useEffect, useState } from 'react';
import type { IDashboardData } from '../../types/types';
import Loading from '../../components/Loading';
//import RevenueChart from './RevenueChart';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // пример fetch к вашему backend на PostgreSQL
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((json: IDashboardData) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return <div>Error loading dashboard data</div>;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="flex items-center p-8 bg-white shadow rounded-lg">
        <div className="inline-flex h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
          <span className="text-xl font-bold">📚</span>
        </div>
        <div>
          <span className="block text-2xl font-bold">{data.totalBooks}</span>
          <span className="block text-gray-500">Products</span>
        </div>
      </div>

      <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow rounded-lg p-4">
        <div className="font-semibold border-b border-gray-100 mb-4">
          The number of orders per month
        </div>
        {/* <RevenueChart /> */}
      </div>
    </div>
  );
};

export default Dashboard;
