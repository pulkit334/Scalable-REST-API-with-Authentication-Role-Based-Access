import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { getProducts } from "../api";
import { useToast } from "../ToastContext";
import { motion } from "framer-motion";

const mockUsers = [
  { _id: "1", name: "Alice Johnson", email: "alice@example.com", role: "user", createdAt: "2026-01-15", lastLogin: "2026-04-30" },
  { _id: "2", name: "Bob Smith", email: "bob@example.com", role: "user", createdAt: "2026-02-20", lastLogin: "2026-04-28" },
  { _id: "3", name: "Charlie Davis", email: "charlie@example.com", role: "admin", createdAt: "2026-03-10", lastLogin: "2026-05-01" },
  { _id: "4", name: "Diana Martinez", email: "diana@example.com", role: "user", createdAt: "2026-03-25", lastLogin: "2026-04-25" },
  { _id: "5", name: "Eve Wilson", email: "eve@example.com", role: "user", createdAt: "2026-04-01", lastLogin: "2026-04-29" },
];

const systemLogs = [
  { id: 1, type: "info", message: "System backup completed successfully", time: "2 min ago" },
  { id: 2, type: "warning", message: "API rate limit threshold reached (85%)", time: "15 min ago" },
  { id: 3, type: "error", message: "Failed login attempt from IP 192.168.1.100", time: "1 hour ago" },
  { id: 4, type: "info", message: "Database optimization completed", time: "3 hours ago" },
  { id: 5, type: "success", message: "SSL certificate renewed successfully", time: "1 day ago" },
];

export default function Admin() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState(mockUsers);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ page: 1, limit: 100 });
      setProducts(res.data.products || res.data.data || []);
    } catch {
      addToast("Failed to load product data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    addToast(`User role updated to ${newRole}`, "success");
    setEditingUser(null);
  };

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const activeUsers = users.filter((u) => u.lastLogin).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
            <p className="text-white/70 text-lg">System management and monitoring</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-100 px-6">
          <nav className="flex gap-6">
            {["overview", "users", "system"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Products", value: totalProducts, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "indigo", change: "+12%" },
                  { label: "Total Users", value: totalUsers, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "emerald", change: "+5%" },
                  { label: "Product Value", value: `$${totalValue.toFixed(2)}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber", change: "+23%" },
                  { label: "Active Users", value: activeUsers, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "purple", change: "+8%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-50 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <svg className={`w-5 h-5 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {systemLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 py-2">
                      <div className={`w-2 h-2 rounded-full ${log.type === "error" ? "bg-red-500" : log.type === "warning" ? "bg-amber-500" : log.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                      <p className="text-sm text-gray-700 flex-1">{log.message}</p>
                      <span className="text-xs text-gray-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                <span className="text-sm text-gray-500">{totalUsers} total users</span>
              </div>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-brand rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{u.name}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.lastLogin).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setEditingUser(u._id)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium transition-colors"
                          >
                            Edit Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">System Status</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "API Status", status: "Operational", uptime: "99.98%" },
                  { label: "Database", status: "Connected", uptime: "99.99%" },
                  { label: "Redis Cache", status: "Active", uptime: "99.95%" },
                  { label: "Background Jobs", status: "Running", uptime: "100%" },
                ].map((service) => (
                  <div key={service.label} className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{service.label}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm text-green-600 font-medium">{service.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Uptime</span>
                      <span className="font-semibold text-gray-900">{service.uptime}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Logs */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Logs</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 py-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.type === "error" ? "bg-red-500" : log.type === "warning" ? "bg-amber-500" : log.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                      <p className="text-sm text-gray-700 flex-1">{log.message}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change Role</h3>
            <p className="text-sm text-gray-500 mb-6">
              Update role for <span className="font-semibold text-gray-900">{users.find((u) => u._id === editingUser)?.name}</span>
            </p>
            <div className="space-y-2">
              {["user", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(editingUser, role)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${users.find((u) => u._id === editingUser)?.role === role ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent"}`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setEditingUser(null)}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
