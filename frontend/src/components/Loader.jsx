import React from 'react';

// Spinner for full page or large content loading
export const Spinner = ({ className = '' }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-900"></div>
  </div>
);

// Loading skeleton for home page blog cards
export const BlogCardSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6 py-6 border-b border-primary-100 animate-pulse">
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-primary-200"></div>
        <div className="h-4 w-24 bg-primary-200 rounded"></div>
        <div className="h-4 w-4 bg-primary-200 rounded"></div>
        <div className="h-4 w-16 bg-primary-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-primary-200 rounded"></div>
        <div className="h-4 w-5/6 bg-primary-200 rounded"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 bg-primary-200 rounded-full"></div>
        <div className="h-4 w-12 bg-primary-200 rounded"></div>
      </div>
    </div>
    <div className="w-full md:w-44 h-32 bg-primary-200 rounded-lg"></div>
  </div>
);

// Loading skeleton for category bar
export const CategorySkeleton = () => (
  <div className="flex gap-2 overflow-x-auto pb-3 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-9 w-20 bg-primary-200 rounded-full shrink-0"></div>
    ))}
  </div>
);

// Loading skeleton for the blog reading page
export const BlogDetailsSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-8">
    <div className="space-y-4">
      <div className="h-10 w-4/5 bg-primary-200 rounded"></div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-primary-200 rounded"></div>
          <div className="h-3 w-20 bg-primary-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="h-96 w-full bg-primary-200 rounded-xl"></div>
    <div className="space-y-3">
      <div className="h-4 w-full bg-primary-200 rounded"></div>
      <div className="h-4 w-full bg-primary-200 rounded"></div>
      <div className="h-4 w-4/5 bg-primary-200 rounded"></div>
    </div>
  </div>
);

const Loader = ({ type = 'spinner', className = '' }) => {
  if (type === 'card') return <BlogCardSkeleton />;
  if (type === 'details') return <BlogDetailsSkeleton />;
  if (type === 'category') return <CategorySkeleton />;
  return <Spinner className={className} />;
};

export default Loader;
