import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "../../components/Dashboard";

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white text-lg w-8 h-8 rounded-lg flex items-center justify-center font-bold select-none">
                T
              </div>
              <span className="text-xl font-bold text-gray-800">
                TaskManager
              </span>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page heading */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your tasks efficiently
        </p>
      </div>

      {/* Dashboard */}
      <Dashboard />
    </div>
  );
};
