import React, { useState } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('SALES');
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownload = (format) => {
    setDownloadMsg(`Preparing ${reportType} report download in ${format} format...`);
    setTimeout(() => {
      setDownloadMsg(`Success! ${reportType} report exported as AgriLink_${reportType}_Summary.${format.toLowerCase()}`);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Financial Reports & Exports</h2>
        <select
          value={reportType}
          onChange={(e) => {
            setReportType(e.target.value);
            setDownloadMsg('');
          }}
          className="px-3 py-2 border rounded-xl text-xs text-gray-500 font-bold"
        >
          <option value="SALES">Daily & Monthly Sales Summary</option>
          <option value="REVENUE">Farmer Revenue Settlement</option>
          <option value="GROWTH">Customer & Registrations Growth</option>
        </select>
      </div>

      {downloadMsg && (
        <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold text-center">
          {downloadMsg}
        </div>
      )}

      {/* Reports metrics summary */}
      <div className="p-5 border rounded-2xl bg-gray-50/50 space-y-4 text-xs font-semibold text-gray-600">
        <p className="font-bold text-gray-800 text-sm">{reportType} Overview Table</p>
        <div className="grid grid-cols-3 gap-4 border-b pb-2 text-[10px] text-gray-400 font-bold uppercase">
          <div>Report Category</div>
          <div>Total Metrics</div>
          <div>Period Range</div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div>Platform Gross Sales</div>
            <div className="font-bold text-gray-800">₹4,85,000</div>
            <div>Last 30 Days</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>Platform Commission (15%)</div>
            <div className="font-bold text-primary">₹72,750</div>
            <div>Last 30 Days</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>Completed Deliveries</div>
            <div className="font-bold text-gray-800">145 Orders</div>
            <div>Last 30 Days</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t flex space-x-3 justify-end">
        <button
          onClick={() => handleDownload('PDF')}
          className="px-4 py-2.5 bg-red-655 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          Export as PDF Document
        </button>
        <button
          onClick={() => handleDownload('CSV')}
          className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          Export as CSV Sheet
        </button>
      </div>
    </div>
  );
};

export default Reports;
