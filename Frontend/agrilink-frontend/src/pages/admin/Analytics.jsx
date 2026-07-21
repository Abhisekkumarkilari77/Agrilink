import React, { useState } from 'react';

const Analytics = () => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const revenueData = [
    { month: 'Feb', val: '1.2L', raw: 120000, height: '24%' },
    { month: 'Mar', val: '1.8L', raw: 180000, height: '36%' },
    { month: 'Apr', val: '2.5L', raw: 250000, height: '50%' },
    { month: 'May', val: '3.1L', raw: 310000, height: '62%' },
    { month: 'Jun', val: '4.0L', raw: 400000, height: '80%' },
    { month: 'Jul', val: '4.8L', raw: 480000, height: '96%' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 rounded-3xl p-8 shadow-xl shadow-stone-900/10 relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,#10b981_0%,transparent_50%)]" />
        <h2 className="text-2xl font-black text-white relative z-10 tracking-tight">Platform Growth & Revenue Analytics</h2>
        <p className="text-stone-300 font-medium text-sm mt-1 relative z-10">Real-time data visualization of AgriLink's financial performance.</p>
      </div>

      {/* Chart 1: Interactive Revenue Trends */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">📈</span>
          Monthly Gross Revenue Trend
        </h3>
        
        <div className="h-64 flex items-end space-x-2 sm:space-x-6 pt-10 border-b border-l border-stone-200 pb-3 pl-3 relative">
          {revenueData.map((bar, idx) => (
            <div 
              key={idx} 
              className="flex-1 flex flex-col items-center space-y-3 relative group"
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip */}
              <div className={`absolute -top-12 bg-stone-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 shadow-lg ${hoveredBar === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                ₹{bar.raw.toLocaleString()}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-800 rotate-45" />
              </div>

              <div
                style={{ height: bar.height, animationDelay: `${idx * 0.1}s` }}
                className="w-full max-w-[48px] bg-gradient-to-t from-primary to-primary-light rounded-t-xl hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-sm animate-fadeIn cursor-pointer"
              />
              <span className="text-xs font-bold text-stone-500">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-base font-bold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
            📊 Top Selling Crop Categories
          </h3>
          <div className="space-y-5 text-sm font-semibold text-stone-600">
            {[
              { label: 'Vegetables & Greens', percent: 45, color: 'bg-emerald-500' },
              { label: 'Dairy & Poultry', percent: 30, color: 'bg-amber-500' },
              { label: 'Fruits & Organic Juices', percent: 25, color: 'bg-blue-500' }
            ].map((cat, idx) => (
              <div key={idx} className="space-y-2 animate-fadeIn" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                <div className="flex justify-between text-xs">
                  <span>{cat.label}</span>
                  <span className="font-black text-stone-800">{cat.percent}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${cat.color} h-full rounded-full transition-all duration-1000 ease-out animate-fadeIn`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growths */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-base font-bold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
            🏆 Top Performing Partners
          </h3>
          <div className="space-y-4 text-xs text-stone-500 font-semibold">
            <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:shadow-md transition cursor-pointer card-hover">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg">R</div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">Ramesh Patel</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Green Valley Farms (Vegetables)</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">₹34,250 Revenue</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:shadow-md transition cursor-pointer card-hover">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">A</div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">Abhisek Kundu</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Customer (MG Road)</p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">12 Orders Placed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
