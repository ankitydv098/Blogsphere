import React from 'react';

const Loader = ({ type = 'card' }) => {
  if (type === 'category') {
    return (
      <div className="flex flex-wrap gap-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-80 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 animate-pulse mb-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="h-36 w-full sm:w-56 bg-slate-200 dark:bg-slate-800 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full pt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
