import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });

  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page, limit: 9, search, sortBy });
      setProducts(res.data.products || res.data.data);
      setPagination(res.data.pagination);
    } catch {
      addToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, form);
        addToast("Product updated successfully", "success");
      } else {
        await createProduct(form);
        addToast("Product created successfully", "success");
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm);
      addToast("Product deleted successfully", "success");
      fetchProducts();
      setDeleteConfirm(null);
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category: "", stock: "" });
    setEditId(null);
    setShowForm(false);
  };

  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h2>
          <p className="text-white/80 text-lg mb-6">Here's what's happening with your products today.</p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { resetForm(); setShowForm(true); }}
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Product
            </motion.button>
            <a href="/products" className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2H4zm10 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zM4 16a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H4zm10 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" /></svg>
              View Catalog
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: pagination.total || 0, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", gradient: "from-indigo-500 to-purple-600", bg: "bg-indigo-50", textColor: "text-indigo-600" },
          { label: "Total Value", value: `$${totalValue.toFixed(2)}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", textColor: "text-emerald-600" },
          { label: "Total Stock", value: totalStock.toLocaleString(), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", textColor: "text-amber-600" },
          { label: "Categories", value: categories.length, icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50", textColor: "text-pink-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <span className={`text-xs font-semibold ${stat.textColor} bg-opacity-10 px-2 py-1 rounded-full`}>Live</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-xl border transition-all ${viewMode === "grid" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode("table")} className={`p-2.5 rounded-xl border transition-all ${viewMode === "table" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Product" : "New Product"}</h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" required rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="flex-1 py-3 bg-gradient-brand text-white font-semibold rounded-xl shadow-brand">
                    {editId ? "Update" : "Create"}
                  </motion.button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-16 bg-gray-200 rounded mb-4" />
              <div className="flex justify-between"><div className="h-6 bg-gray-200 rounded w-20" /><div className="h-4 bg-gray-200 rounded w-16" /></div>
              <div className="flex gap-2 mt-4"><div className="h-10 bg-gray-200 rounded flex-1" /><div className="h-10 bg-gray-200 rounded flex-1" /></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Create your first product to get started.</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-6 py-3 bg-gradient-brand text-white font-semibold rounded-xl shadow-brand">Add Product</button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center relative">
                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${product.stock < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {product.stock < 5 ? "Low Stock" : "In Stock"}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{product.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mb-4">
                  <span className="text-xl font-bold text-emerald-600">${Number(product.price).toFixed(2)}</span>
                  <span className={`text-sm font-medium ${product.stock < 5 ? "text-red-500" : "text-gray-500"}`}>Stock: {product.stock || 0}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="flex-1 py-2.5 bg-amber-50 text-amber-600 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-sm">Edit</button>
                  <button onClick={() => setDeleteConfirm(product._id)} className="flex-1 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors text-sm">Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock < 5 ? "text-red-500" : "text-gray-700"}`}>{product.stock || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(product)} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 text-sm font-medium transition-colors">Edit</button>
                      <button onClick={() => setDeleteConfirm(product._id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-300 transition-all text-sm font-medium">Previous</button>
          <span className="text-sm text-gray-500 px-3">Page {page} of {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-300 transition-all text-sm font-medium">Next</button>
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-gray-500 mb-8">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">Delete</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
