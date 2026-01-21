import { useEffect, useState } from 'react';
import apiService from '../services';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [formData, setFormData] = useState({
    type: 'monthly',
    startDate: '',
    endDate: '',
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.listReports();
      setReports(response.data);
    } catch (err: any) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGeneratingReport(true);
      await apiService.generateReport({
        ...formData,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      });
      setFormData({ type: 'monthly', startDate: '', endDate: '' });
      fetchReports();
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading && reports.length === 0) {
    return <div className="text-center text-gray-500">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">📄 Financial Reports</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Generate Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Generate New Report</h2>
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>

            {formData.type === 'custom' && (
              <>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={formData.type === 'custom'}
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={formData.type === 'custom'}
                />
              </>
            )}
          </div>
          <button
            type="submit"
            disabled={generatingReport}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Previous Reports</h2>
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 capitalize">{report.type} Report</h3>
                <p className="text-sm text-gray-500">
                  Generated: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-xs text-gray-500">Total Donations</p>
                <p className="text-2xl font-bold text-green-600">
                  ${report.totalDonations?.toFixed(2) || '0.00'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <p className="text-xs text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${report.totalExpenses?.toFixed(2) || '0.00'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <p className="text-xs text-gray-500">Net</p>
                <p
                  className={`text-2xl font-bold ${
                    (report.totalDonations || 0) - (report.totalExpenses || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  ${((report.totalDonations || 0) - (report.totalExpenses || 0)).toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <p className="text-xs text-gray-500">Period</p>
                <p className="text-sm font-semibold text-gray-900">
                  {report.startDate && report.endDate
                    ? `${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            {report.data && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {report.data.donationsByType && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Donations by Type</p>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(report.data.donationsByType).map(([type, amount]: any) => (
                          <li key={type} className="flex justify-between">
                            <span className="capitalize">{type}:</span>
                            <span>${amount.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.data.expensesByCategory && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Expenses by Category</p>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(report.data.expensesByCategory).map(([category, amount]: any) => (
                          <li key={category} className="flex justify-between">
                            <span className="capitalize">{category}:</span>
                            <span>${amount.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">No reports yet</div>
        )}
      </div>
    </div>
  );
}
