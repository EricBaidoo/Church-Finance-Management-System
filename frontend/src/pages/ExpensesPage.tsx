import { useEffect, useState } from 'react';
import apiService from '../services';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'utilities',
    description: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiService.listExpenses();
      const expenseData = response.data.data || response.data;
      setExpenses(expenseData);
      
      // Calculate stats
      const total = expenseData.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
      const pending = expenseData.filter((e: any) => e.status === 'pending').reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
      const approved = expenseData.filter((e: any) => e.status === 'approved').reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
      const rejected = expenseData.filter((e: any) => e.status === 'rejected').reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
      
      setStats({ total, pending, approved, rejected });
    } catch (err: any) {
      setError('Failed to load expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        amount: '',
        category: 'utilities',
        description: '',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      setError('Failed to create expense');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await apiService.approveExpense(id);
      fetchExpenses();
    } catch (err) {
      setError('Failed to approve expense');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await apiService.rejectExpense(id);
      fetchExpenses();
    } catch (err) {
      setError('Failed to reject expense');
    }
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading expenses...</p>
        </div>
      </div>
    );
  }

  const filteredExpenses = expenses.filter((expense) => {
    if (statusFilter !== 'all' && expense.status !== statusFilter) return false;
    if (categoryFilter && expense.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(expenses.map((e) => e.category)));

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">💸 Expenses</h1>
            <p className="text-orange-100 mt-1">Track and approve all church expenses</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition font-semibold shadow-md"
          >
            {showForm ? '✕ Cancel' : '+ New Expense'}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-orange-100 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold mt-1">${stats.total.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-yellow-100 text-sm">Pending</p>
            <p className="text-3xl font-bold mt-1">${stats.pending.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-green-100 text-sm">Approved</p>
            <p className="text-3xl font-bold mt-1">${stats.approved.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-red-100 text-sm">Rejected</p>
            <p className="text-3xl font-bold mt-1">${stats.rejected.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔍</span> Filter Expenses
        </h3>
        <div className="flex gap-4">
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({expenses.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({expenses.filter((e) => e.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                statusFilter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({expenses.filter((e) => e.status === 'approved').length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                statusFilter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({expenses.filter((e) => e.status === 'rejected').length})
            </button>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Amount"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="utilities">Utilities</option>
                <option value="maintenance">Maintenance</option>
                <option value="programs">Programs</option>
                <option value="staff">Staff</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Save Expense
            </button>
          </form>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{expense.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        expense.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : expense.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {expense.status === 'approved' ? '✓ Approved' : expense.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    {expense.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(expense.id)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition font-medium"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(expense.id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition font-medium"
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    {expense.status !== 'pending' && (
                      <span className="text-gray-400 text-xs italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No expenses found</p>
              <p className="text-gray-400 text-sm mt-2">
                {expenses.length === 0
                  ? 'Start by adding your first expense'
                  : 'Try adjusting your filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
