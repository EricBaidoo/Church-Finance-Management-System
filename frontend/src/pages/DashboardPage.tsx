import { useEffect, useState } from 'react';
import apiService from '../services';

interface DashboardStats {
  totalDonations: number;
  totalExpenses: number;
  balance: number;
  donationsByType?: Record<string, number>;
  donationsByOfferingType?: Array<{ name: string; total: number; count: number }>;
  expensesByCategory?: Record<string, number>;
  recentDonations?: any[];
  recentExpenses?: any[];
  monthlyTrend?: Array<{ month: string; donations: number; expenses: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [offeringTypes, setOfferingTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all data with proper error handling
        const [donationsRes, expensesRes, offeringTypesRes] = await Promise.all([
          apiService.listDonations(1, 5).catch(() => ({ data: { data: [] } })),
          apiService.listExpenses(1, 5).catch(() => ({ data: { data: [] } })),
          apiService.listActiveOfferingTypes().catch(() => ({ data: { data: [] } })),
        ]);

        const donations = donationsRes.data.data || donationsRes.data || [];
        const expenses = expensesRes.data.data || expensesRes.data || [];
        const offerings = offeringTypesRes.data.data || offeringTypesRes.data || [];

        // Calculate stats from donations and expenses
        const totalDonations = donations.reduce((sum: number, d: any) => sum + parseFloat(d.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount || 0), 0);

        // Group by offering type
        const offeringMap = new Map();
        donations.forEach((d: any) => {
          const typeName = d.offeringType?.name || d.donationType || 'Other';
          const current = offeringMap.get(typeName) || { total: 0, count: 0 };
          offeringMap.set(typeName, {
            total: current.total + parseFloat(d.amount || 0),
            count: current.count + 1
          });
        });

        // Group expenses by category
        const expenseMap: Record<string, number> = {};
        expenses.forEach((e: any) => {
          const cat = e.category || 'other';
          expenseMap[cat] = (expenseMap[cat] || 0) + parseFloat(e.amount || 0);
        });

        setStats({
          totalDonations,
          totalExpenses,
          balance: totalDonations - totalExpenses,
          recentDonations: donations.slice(0, 5),
          recentExpenses: expenses.slice(0, 5),
          expensesByCategory: expenseMap,
        });

        // Enrich offering types with totals
        const enrichedOfferings = offerings.map((type: any) => ({
          ...type,
          total: offeringMap.get(type.name)?.total || 0,
          count: offeringMap.get(type.name)?.count || 0,
        }));

        setOfferingTypes(enrichedOfferings);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
        // Set empty state to prevent blank screen
        setStats({
          totalDonations: 0,
          totalExpenses: 0,
          balance: 0,
          recentDonations: [],
          recentExpenses: [],
          expensesByCategory: {},
        });
        setOfferingTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalDonations = stats?.totalDonations || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  const balance = totalDonations - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-yellow-800 font-semibold">Limited Data Available</h3>
              <p className="text-yellow-600 text-sm">{error}. Showing available information.</p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Financial Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of church financial activities</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 rounded-lg transition ${
              timeFilter === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 rounded-lg transition ${
              timeFilter === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeFilter('year')}
            className={`px-4 py-2 rounded-lg transition ${
              timeFilter === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">💝</div>
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">Income</div>
          </div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">Total Donations</p>
          <p className="text-4xl font-bold">${totalDonations.toFixed(2)}</p>
          <p className="text-green-100 text-sm mt-2">
            {stats?.recentDonations?.length || 0} recent transactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">💸</div>
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">Expenses</div>
          </div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">Total Expenses</p>
          <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
          <p className="text-red-100 text-sm mt-2">
            {stats?.recentExpenses?.length || 0} pending items
          </p>
        </div>

        <div className={`bg-gradient-to-br ${
          balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
        } rounded-xl shadow-lg p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">💰</div>
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">Balance</div>
          </div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">Net Position</p>
          <p className="text-4xl font-bold">${Math.abs(balance).toFixed(2)}</p>
          <p className="text-blue-100 text-sm mt-2">
            {balance >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">📈</div>
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">Growth</div>
          </div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">Offering Types</p>
          <p className="text-4xl font-bold">{offeringTypes.length}</p>
          <p className="text-purple-100 text-sm mt-2">Active categories</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations by Offering Type */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">💝 Donations by Type</h2>
            <span className="text-sm text-gray-500">This {timeFilter}</span>
          </div>
          <div className="space-y-4">
            {offeringTypes.length > 0 ? (
              offeringTypes.map((type, index) => {
                const percentage = totalDonations > 0 ? ((type.total || 0) / totalDonations) * 100 : 0;
                const colors = [
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-yellow-500',
                  'bg-pink-500',
                  'bg-indigo-500',
                  'bg-red-500',
                ];
                return (
                  <div key={type.id || index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{type.name}</span>
                      <span className="text-gray-900 font-bold">${(type.total || 0).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No offering data available</p>
            )}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">💸 Expenses by Category</h2>
            <span className="text-sm text-gray-500">This {timeFilter}</span>
          </div>
          <div className="space-y-4">
            {stats?.expensesByCategory && Object.keys(stats.expensesByCategory).length > 0 ? (
              Object.entries(stats.expensesByCategory).map(([category, amount]: any, index) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                const colors = [
                  'bg-red-500',
                  'bg-orange-500',
                  'bg-amber-500',
                  'bg-yellow-500',
                  'bg-lime-500',
                ];
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 capitalize">{category}</span>
                      <span className="text-gray-900 font-bold">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No expense data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Donations</h2>
          <div className="space-y-3">
            {stats?.recentDonations && stats.recentDonations.length > 0 ? (
              stats.recentDonations.map((donation: any) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {donation.member?.name || `Member #${donation.memberId}`}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {donation.offeringType?.name || donation.donationType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${donation.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent donations</p>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {stats?.recentExpenses && stats.recentExpenses.length > 0 ? (
              stats.recentExpenses.map((expense: any) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 capitalize">{expense.category}</p>
                    <p className="text-sm text-gray-500">{expense.description?.substring(0, 50)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">${expense.amount.toFixed(2)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        expense.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : expense.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {expense.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent expenses</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
