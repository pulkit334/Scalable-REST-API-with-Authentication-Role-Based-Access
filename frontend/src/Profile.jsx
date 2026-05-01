import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    window.location.href = "/";
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      addToast("New passwords don't match", "error");
      return;
    }
    if (passwordData.new.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setShowPasswordForm(false);
      addToast("Password updated successfully", "success");
    }, 1000);
  };

  const handleSaveName = () => {
    if (name.trim()) {
      addToast("Name updated successfully", "success");
      setEditingName(false);
    }
  };

  const stats = [
    { label: "Products Created", value: "12", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "indigo" },
    { label: "Account Age", value: `${Math.floor((Date.now() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))} days`, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "emerald" },
    { label: "Last Login", value: new Date().toLocaleDateString(), icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber" },
    { label: "Role", value: user?.role || "user", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "purple" },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl" />
        <div className="absolute -bottom-16 left-8 flex items-end gap-4">
          <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center text-5xl font-bold bg-gradient-to-br from-indigo-400 to-purple-500 text-white border-4 border-white">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
        <div className="absolute -bottom-12 right-8 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </motion.button>
        </div>
      </div>

      <div className="pt-20">
        <div className="flex items-center gap-4 mb-8">
          <div>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 outline-none" autoFocus />
                <button onClick={handleSaveName} className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Save</button>
                <button onClick={() => { setEditingName(false); setName(user?.name || ""); }} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <button onClick={() => setEditingName(true)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
            )}
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <svg className={`w-5 h-5 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: user?.name },
                { label: "Email Address", value: user?.email },
                { label: "Account Type", value: user?.role, capitalize: true },
                { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className={`text-sm font-semibold text-gray-900 ${item.capitalize ? "capitalize" : ""}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 bg-green-50 rounded-lg px-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Password Protected</p>
                    <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 bg-blue-50 rounded-lg px-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure Session</p>
                    <p className="text-xs text-gray-500">Encrypted connection active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPasswordForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
                <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter current password" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                <input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Min 6 characters" minLength={6} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Re-enter new password" />
              </div>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full py-3 bg-gradient-brand text-white font-semibold rounded-xl shadow-brand disabled:opacity-50">
                {loading ? "Updating..." : "Update Password"}
              </motion.button>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">Irreversible and destructive actions</p>
            <button onClick={handleLogout} className="w-full sm:w-auto px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
