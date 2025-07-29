import React from 'react'; // Ensure React is imported if not already

const Select = ({
  label,
  error,
  children,
  className = '',
  required = false,
  ...props
}) => {
  const selectClasses = `block w-full rounded-lg border border-jisefi-light-grey shadow-sm px-4 py-2.5 text-base text-jisefi-dark-grey focus:outline-none focus:border-jisefi-green-light focus:ring-2 focus:ring-jisefi-green-light/20 transition-all duration-200 ${
    error ? 'border-jisefi-red-flag focus:border-jisefi-red-flag focus:ring-jisefi-red-flag/20' : ''
  } ${className}`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-jisefi-dark-grey mb-2"> {/* Increased mb to mb-2 */}
          {label}
          {required && <span className="text-jisefi-red-flag ml-1">*</span>}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-jisefi-red-flag">{error}</p>
      )}
    </div>
  );
};

export default Select;