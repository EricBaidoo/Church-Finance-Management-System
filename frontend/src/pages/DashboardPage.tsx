import { useEffect, useState } from 'react';
import apiService from '../services';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiService.getDashboard();
        setStats(response.data);
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Donations</p>
              <p className="text-3xl font-bold text-green-600">
                ${stats?.totalDonations?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-4xl">💝</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">
                ${stats?.totalExpenses?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-4xl">💸</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Balance</p>
              <p className="text-3xl font-bold text-blue-600">
                ${(stats?.totalDonations - stats?.totalExpenses)?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Breakdown by Type */}
      {stats?.donationsByType && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Donations by Type</h2>
          <div className="space-y-3">
            {Object.entries(stats.donationsByType).map(([type, amount]: any) => (
              <div key={type} className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-700 capitalize font-medium">{type}</span>
                <span className="text-lg font-bold text-green-600">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses by Category */}
      {stats?.expensesByCategory && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Expenses by Category</h2>
          <div className="space-y-3">
            {Object.entries(stats.expensesByCategory).map(([category, amount]: any) => (
              <div key={category} className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-700 capitalize font-medium">{category}</span>
                <span className="text-lg font-bold text-red-600">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
