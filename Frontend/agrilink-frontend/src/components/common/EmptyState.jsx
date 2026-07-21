import React from 'react';

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
      {/* Animated floating illustration */}
      <div className="animate-float mb-6">
        <div className="w-24 h-24 rounded-3xl bg-stone-100 flex items-center justify-center text-4xl">
          {icon || '📦'}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-stone-800 mb-1">{title || 'Nothing here yet'}</h3>
      <p className="text-sm text-stone-400 font-medium max-w-xs mb-6">
        {description || 'This section is empty. Content will appear here once data is available.'}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition btn-press shadow-lg shadow-primary/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
