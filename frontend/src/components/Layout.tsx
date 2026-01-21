import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import apiService from '../services';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">⛪ Church Finance</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/donations"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                💝 Offerings
              </Link>
            </li>
            <li>
              <Link
                to="/expenses"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                💸 Expenses
              </Link>
            </li>
            <li>
              <Link
                to="/budgets"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                📈 Budgets
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                📄 Reports
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="text-gray-300 text-sm mb-3">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
