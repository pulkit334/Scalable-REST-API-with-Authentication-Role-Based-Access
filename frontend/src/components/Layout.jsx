import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Products", path: "/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 0 }}
        className={`fixed lg:relative inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "shadow-xl lg:shadow-sm" : "lg:border-0"}`}
      >
        <div className="flex-shrink-0" style={{ minWidth: 256 }}>
          {/* Sidebar Header with Logo and Close Button */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-brand rounded-xl flex items-center justify-center shadow-brand">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Product<span className="text-gradient">API</span></span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Profile Section at Top of Sidebar */}
          <div className="p-4 border-b border-gray-100">
            <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-11 h-11 bg-gradient-brand rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white group-hover:ring-indigo-100 transition-all">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" style={{ minWidth: 256 }}>
          <p className="px-3 pt-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <div className="pt-3">
              <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
              <Link
                to="/admin"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === "/admin" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Panel
                {location.pathname === "/admin" && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
              </Link>
            </div>
          )}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0" style={{ minWidth: 256 }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 hover:border-gray-300"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900 capitalize">{location.pathname.split("/").filter(Boolean)[0] || "Dashboard"}</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Profile Link in Header */}
              <Link
                to="/profile"
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${location.pathname === "/profile" ? "bg-indigo-50" : "hover:bg-gray-100"}`}
                title="Profile"
              >
                <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name?.split(" ")[0] || "User"}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-brand rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">© 2026 ProductAPI. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Home</Link>
              <Link to="/products" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Products</Link>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
