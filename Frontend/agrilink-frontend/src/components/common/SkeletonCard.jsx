import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm">
    <div className="h-48 skeleton" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 skeleton" />
      <div className="h-3 w-1/2 skeleton" />
      <div className="flex justify-between items-center pt-3 border-t border-stone-100">
        <div className="h-5 w-16 skeleton" />
        <div className="h-9 w-24 skeleton rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4">
    <div className="h-6 w-48 skeleton" />
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 flex-1 skeleton" />
          <div className="h-4 w-24 skeleton" />
          <div className="h-4 w-16 skeleton" />
          <div className="h-8 w-20 skeleton rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-8 animate-fadeIn">
    <div className="h-36 skeleton rounded-3xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 skeleton rounded-2xl" />
      ))}
    </div>
    <div className="h-48 skeleton rounded-3xl" />
  </div>
);

export default SkeletonCard;
