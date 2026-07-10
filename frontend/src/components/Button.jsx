import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md',        // sm, md, lg
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-900 text-white hover:bg-primary-800 focus:ring-primary-900 border border-transparent shadow-sm',
    secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200 focus:ring-primary-200 border border-transparent',
    outline: 'bg-transparent text-primary-900 hover:bg-primary-50 focus:ring-primary-900 border border-primary-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
