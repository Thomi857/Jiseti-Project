import React from 'react'; // Ensure React is imported if not already

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, accent (new)
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jisefi-green-light/50 disabled:opacity-50 disabled:cursor-not-allowed';

  // Mapping variants to Jisefi-specific Tailwind classes
  const variants = {
    primary: 'bg-jisefi-green-dark hover:bg-jisefi-green-light text-white focus:ring-jisefi-green-dark',
    secondary: 'bg-jisefi-dark-grey hover:bg-gray-700 text-white focus:ring-jisefi-dark-grey', // Using a dark grey for a distinct secondary
    outline: 'border border-jisefi-green-dark bg-white hover:bg-jisefi-green-dark text-jisefi-green-dark hover:text-white focus:ring-jisefi-green-dark',
    danger: 'bg-jisefi-red-flag hover:bg-red-700 text-white focus:ring-jisefi-red-flag', // red-700 is a default Tailwind color, adjust if needed
    accent: 'bg-jisefi-yellow-accent hover:bg-jisefi-yellow-hover text-jisefi-green-dark focus:ring-jisefi-yellow-accent', // New accent variant
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm', // Slightly more padding
    md: 'px-5 py-2.5 text-base', // Increased padding for md
    lg: 'px-7 py-3.5 text-lg', // Increased padding for lg
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> // Spinner color changed to white for visibility
      )}
      {children}
    </button>
  );
};

export default Button;
// // Button.jsx
// import React from 'react';
// import { twMerge } from 'tailwind-merge';

// const Button = ({ children, onClick, type = 'button', variant = 'primary', loading, icon, className, ...props }) => {
//   const baseClasses = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

//   const variantClasses = {
//     primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
//     outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
//     danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
//   };

//   const finalClasses = twMerge(baseClasses, variantClasses[variant], className);

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       className={finalClasses}
//       disabled={loading}
//       {...props}
//     >
//       {loading ? (
//         <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//       ) : (
//         <>
//           {icon && <span className="mr-2">{icon}</span>}
//           {children}
//         </>
//       )}
//     </button>
//   );
// };

// export default Button;
