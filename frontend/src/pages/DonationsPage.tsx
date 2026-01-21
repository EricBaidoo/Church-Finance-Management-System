import { useEffect, useState } from 'react';
import apiService from '../services';

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    type: 'tithe',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiService.listDonations();
      setDonations(response.data);
    } catch (err: any) {
      setError('Failed to load donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
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
        type: 'tithe',
        paymentMethod: 'cash',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      fetchDonations();
    } catch (err) {
      setError('Failed to create donation');
    }
  };

  if (loading && donations.length === 0) {
    return <div className="text-center text-gray-500">Loading donations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">💝 Donations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {showForm ? 'Cancel' : '+ New Donation'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

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
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="building_fund">Building Fund</option>
                <option value="other">Other</option>
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Donation
            </button>
          </form>
        </div>
      )}

      {/* Donations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{donation.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{donation.memberId}</td>
                <td className="px-6 py-4 text-sm font-bold text-green-600">
                  ${donation.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{donation.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{donation.paymentMethod}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(donation.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && (
          <div className="text-center py-8 text-gray-500">No donations yet</div>
        )}
      </div>
    </div>
  );
}
