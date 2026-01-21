import { useEffect, useState } from 'react';
import apiService from '../services';

interface OfferingType {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [offeringTypes, setOfferingTypes] = useState<OfferingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    offeringTypeId: '',
    memberId: '',
    startDate: '',
    endDate: '',
    paymentMethod: '',
  });
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    offeringTypeId: '',
    donationType: 'tithe',
    paymentMethod: 'cash',
    donationDate: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    average: 0,
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiService.listDonations();
      const donationData = response.data.data || response.data;
      setDonations(donationData);
      
      // Calculate stats
      const total = donationData.reduce((sum: number, d: any) => sum + parseFloat(d.amount), 0);
      const count = donationData.length;
      setStats({
        total,
        count,
        average: count > 0 ? total / count : 0,
      });
    } catch (err: any) {
      setError('Failed to load donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferingTypes = async () => {
    try {
      const response = await apiService.listActiveOfferingTypes();
      setOfferingTypes(response.data.data || []);
    } catch (err) {
      console.error('Failed to load offering types:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchOfferingTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createDonation({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        memberId: '',
        amount: '',
        offeringTypeId: '',
        donationType: 'tithe',
        paymentMethod: 'cash',
        donationDate: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowForm(false);
      fetchDonations();
    } catch (err) {
      setError('Failed to create donation');
    }
  };

  if (loading && donations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading donations...</p>
        </div>
      </div>
    );
  }

  const filteredDonations = donations.filter((donation) => {
    if (filters.offeringTypeId && donation.offeringTypeId !== Number(filters.offeringTypeId)) return false;
    if (filters.memberId && donation.memberId !== Number(filters.memberId)) return false;
    if (filters.paymentMethod && donation.paymentMethod !== filters.paymentMethod) return false;
    if (filters.startDate && new Date(donation.donationDate) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(donation.donationDate) > new Date(filters.endDate)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">💝 Donations</h1>
            <p className="text-green-100 mt-1">Track and manage all church donations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold shadow-md"
          >
            {showForm ? '✕ Cancel' : '+ New Donation'}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-green-100 text-sm">Total Amount</p>
            <p className="text-3xl font-bold mt-1">${stats.total.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-green-100 text-sm">Total Donations</p>
            <p className="text-3xl font-bold mt-1">{stats.count}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-green-100 text-sm">Average Donation</p>
            <p className="text-3xl font-bold mt-1">${stats.average.toFixed(2)}</p>
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
          <span>🔍</span> Filter Donations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.offeringTypeId}
            onChange={(e) => setFilters({ ...filters, offeringTypeId: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Offering Types</option>
            {offeringTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Member ID"
            value={filters.memberId}
            onChange={(e) => setFilters({ ...filters, memberId: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <input
            type="date"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <input
            type="date"
            placeholder="End Date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="online">Online</option>
            <option value="transfer">Bank Transfer</option>
          </select>
        </div>

        {(filters.offeringTypeId || filters.memberId || filters.startDate || filters.endDate || filters.paymentMethod) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredDonations.length} of {donations.length} donations
            </p>
            <button
              onClick={() =>
                setFilters({
                  offeringTypeId: '',
                  memberId: '',
                  startDate: '',
                  endDate: '',
                  paymentMethod: '',
                })
              }
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Member ID"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                value={formData.offeringTypeId}
                onChange={(e) => setFormData({ ...formData, offeringTypeId: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Offering Type</option>
                {offeringTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="online">Online</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
            <input
              type="date"
              value={formData.donationDate}
              onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Record Offering
            </button>
          </form>
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Offering Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ref #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-green-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{donation.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {donation.member?.name || `Member #${donation.memberId}`}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${parseFloat(donation.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {donation.offeringType?.name || donation.donationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {donation.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {donation.referenceNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No donations found</p>
              <p className="text-gray-400 text-sm mt-2">
                {donations.length === 0
                  ? 'Start by adding your first donation'
                  : 'Try adjusting your filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
