import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Enterprise Security", desc: "JWT authentication with bcrypt hashing, rate limiting, and Helmet security headers.", gradient: "from-emerald-500 to-teal-600" },
    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Role-Based Access", desc: "Granular user/admin permissions with middleware-enforced authorization.", gradient: "from-blue-500 to-indigo-600" },
    { icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", title: "MongoDB Atlas", desc: "Scalable cloud database with Mongoose ODM and text search indexing.", gradient: "from-purple-500 to-pink-600" },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Redis Caching", desc: "Upstash Redis integration for sub-100ms API responses with TTL support.", gradient: "from-amber-500 to-orange-600" },
    { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Swagger Docs", desc: "Auto-generated OpenAPI documentation at /api/v1/docs endpoint.", gradient: "from-cyan-500 to-blue-600" },
    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "26 API Tests", desc: "Comprehensive Jest + Supertest suite covering all endpoints and edge cases.", gradient: "from-rose-500 to-red-600" },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime SLA", suffix: "" },
    { value: "<50", label: "Avg Response (ms)", suffix: "ms" },
    { value: "256", label: "Bit Encryption", suffix: "-bit" },
    { value: "10K+", label: "Requests/min", suffix: "" },
  ];

  const faqs = [
    { q: "How does authentication work?", a: "We use JWT (JSON Web Tokens) with bcrypt password hashing. Tokens expire after 7 days and are validated on every API request through middleware." },
    { q: "Can I deploy this to production?", a: "Absolutely. The project includes environment variable configuration, Redis caching, rate limiting, and follows security best practices ready for production deployment." },
    { q: "What database is supported?", a: "MongoDB via Mongoose ODM. The project works with both local MongoDB and MongoDB Atlas cloud instances." },
    { q: "Is the frontend connected to the backend?", a: "Yes. The React frontend uses Axios with interceptors to communicate with the Express backend. Authentication tokens are automatically attached to requests." },
  ];

  const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Product<span className="text-gradient">API</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Performance</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-brand text-white text-sm font-semibold rounded-xl shadow-brand hover:shadow-brand-lg transition-all hover:scale-105">Get Started</Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-indigo-500 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-indigo-600" />
                </span>
                <span className="text-sm font-semibold text-indigo-700">Production Ready v1.0</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
                Build APIs with
                <br />
                <span className="text-gradient">Enterprise Security</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
                Scalable REST API platform with JWT authentication, role-based access, Redis caching, and a polished React dashboard. Ready for production.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="group px-8 py-4 bg-gradient-brand text-white font-bold rounded-2xl shadow-brand hover:shadow-brand-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  Start Building Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a href="http://localhost:5000/api/v1/docs" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View API Docs
                </a>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-emerald-500"].map((c, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {["JD", "AK", "MR", "SL"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Trusted by developers worldwide</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative">
              <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-1 overflow-hidden">
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-400 font-mono">terminal</span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> <span className="text-white">curl -X POST</span></p>
                    <p className="text-gray-400">http://localhost:5000/api/v1/auth/register \</p>
                    <p className="text-gray-400">  -H "Content-Type: application/json" \</p>
                    <p className="text-gray-400">{`  -d '{"name":"John","email":"john@example.com"}'`}</p>
                    <p className="mt-4"><span className="text-green-400">✓</span> <span className="text-white">201 Created</span></p>
                    <p className="text-gray-400">{`{ "success": true, "token": "eyJhbG..." }`}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-brand rounded-2xl opacity-20 blur-xl" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2">{stat.value}{stat.suffix}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Everything you need to <span className="text-gradient">scale</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Built with modern technologies and production-grade security practices.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">Common Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand animate-gradient-x" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to build?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Start building secure, scalable APIs today. No credit card required.</p>
            <Link to="/register" className="inline-block px-10 py-5 bg-white text-indigo-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Create Free Account →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Product<span className="text-gradient">API</span></span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed">Production-ready REST API platform with authentication, role-based access, and modern frontend.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="http://localhost:5000/api/v1/docs" className="hover:text-white transition-colors">API Docs</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tech Stack</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Node.js + Express</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />MongoDB + Mongoose</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />React + Vite</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Redis + BullMQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 ProductAPI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.606.977.756-.21 1.572-.316 2.391-.322.82.006 1.638.112 2.394.322 1.598-1.3 2.607-.978 2.607-.978.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
              <a href="#" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


