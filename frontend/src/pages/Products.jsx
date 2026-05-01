import { useState, useEffect } from "react";
import { getProducts } from "../api";
import { useToast } from "../ToastContext";
import { motion } from "framer-motion";

const comingSoonProducts = [
  { name: "AI Analytics Pro", category: "Software", description: "Advanced AI-powered analytics dashboard with predictive insights.", releaseDate: "Q2 2026", image: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { name: "CloudSync Enterprise", category: "Cloud", description: "Seamless cloud synchronization for enterprise teams.", releaseDate: "Q3 2026", image: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { name: "SecureVault", category: "Security", description: "Zero-knowledge encrypted file storage with biometric access.", releaseDate: "Q4 2026", image: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

export default function Products() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-createdAt");

  useEffect(() => {
    fetchProducts();
  }, [search, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page: 1, limit: 50, search, sortBy });
      setProducts(res.data.products || res.data.data || []);
    } catch {
      addToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const filteredProducts = categoryFilter === "all" ? products : products.filter((p) => p.category === categoryFilter);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Product Catalog</h2>
        <p className="text-white/80 text-lg">Discover our range of high-quality products</p>
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl border transition-all ${viewMode === "grid" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl border transition-all ${viewMode === "list" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-xl mb-4" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-16 bg-gray-200 rounded mb-4" />
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Check back later for new arrivals.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={product.icon || "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"} />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{product.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xl font-bold text-emerald-600">${Number(product.price).toFixed(2)}</span>
                  <span className={`text-sm font-medium ${product.stock < 5 ? "text-red-500" : "text-gray-500"}`}>Stock: {product.stock || 0}</span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="pt-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Upcoming Releases</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonProducts.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gradient-brand text-white text-xs font-semibold rounded-full">Coming Soon</span>
              </div>
              <div className="h-40 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={product.image} />
                </svg>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">{product.category}</span>
                <h3 className="font-bold text-gray-900 mt-3 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Expected:</span>
                  <span className="text-sm font-semibold text-indigo-600">{product.releaseDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
