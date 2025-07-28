const Textarea = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  const textareaClasses = `block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
    error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
  } ${className}`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;