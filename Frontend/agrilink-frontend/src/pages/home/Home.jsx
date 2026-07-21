import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { icon: '🌾', title: 'Farm Fresh Products', desc: 'Buy directly from verified local farmers. No middlemen, no markup.' },
    { icon: '🚚', title: 'Fast Local Delivery', desc: 'OTP-verified deliveries ensuring your produce arrives fresh and safe.' },
    { icon: '🔒', title: 'Secure Payments', desc: 'Multiple payment options with full transaction transparency.' },
    { icon: '📊', title: 'Price Comparison', desc: 'Compare prices across farmers to get the best deal on fresh goods.' },
    { icon: '🌿', title: 'Organic Certified', desc: 'Filter for organic products verified by government certifications.' },
    { icon: '⭐', title: 'Trusted Reviews', desc: 'Real customer ratings help you choose the best farm produce.' },
  ];

  const stats = [
    { value: '500+', label: 'Verified Farmers' },
    { value: '7,800+', label: 'Happy Customers' },
    { value: '15K+', label: 'Orders Delivered' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══════ Hero Section ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,#10b981_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_20%,#f59e0b_0%,transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 animate-fadeIn text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full relative pulse-dot"></span>
              AI-Powered Marketplace
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.08] tracking-tight">
              Farm Fresh,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
                Delivered Fast.
              </span>
            </h1>

            <p className="text-emerald-200/80 text-base md:text-lg max-w-lg font-medium leading-relaxed">
              AgriLink connects you directly with verified local farmers. Skip the middlemen, get fresher produce, and support your local farming community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-2xl text-sm hover:bg-emerald-50 transition shadow-xl shadow-black/20 btn-press"
              >
                Get Started — It's Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-sm hover:bg-white/20 transition backdrop-blur-sm btn-press"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex-1 relative animate-scaleIn">
            <div className="w-72 h-72 md:w-96 md:h-96 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-4 animate-float">
                <div className="text-7xl md:text-8xl">🌾</div>
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Fresh from Farm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Stats Bar ═══════ */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="text-3xl md:text-4xl font-black text-stone-800">{stat.value}</div>
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Features Grid ═══════ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14 animate-fadeIn">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full">Why AgriLink</span>
          <h2 className="text-3xl md:text-4xl font-black text-stone-800 mt-6">Built for Farmers & Customers</h2>
          <p className="text-stone-400 text-sm font-medium mt-3 max-w-md mx-auto">
            A transparent marketplace that ensures fair pricing, fresh produce, and verified quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-stone-100 shadow-sm card-hover animate-fadeIn"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-5">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-2">{feat.title}</h3>
              <p className="text-sm text-stone-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Roles CTA Section ═══════ */}
      <section className="bg-stone-50 border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14 animate-fadeIn">
            <h2 className="text-3xl font-black text-stone-800">Join as</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🛒', role: 'Customer', desc: 'Browse and buy fresh produce directly from local farmers.', color: 'bg-emerald-600' },
              { icon: '🌾', role: 'Farmer', desc: 'List your crops, manage inventory, and reach thousands of customers.', color: 'bg-amber-500' },
              { icon: '🚚', role: 'Delivery Partner', desc: 'Earn by delivering fresh produce from farms to doorsteps.', color: 'bg-blue-600' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm card-hover text-center animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{item.role}</h3>
                <p className="text-sm text-stone-400 mb-6">{item.desc}</p>
                <Link
                  to="/register"
                  className={`inline-block px-6 py-2.5 ${item.color} text-white font-bold text-xs rounded-xl transition btn-press shadow-lg`}
                >
                  Register as {item.role}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg">AL</div>
            <span className="text-white font-bold text-lg">AgriLink</span>
          </div>
          <p className="text-xs font-medium">© 2026 AgriLink — AI Powered Local Farmer Marketplace. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-bold">
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
