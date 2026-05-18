import { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Toast = ({ id, message, type = 'info', onClose, duration = 4500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900';
      case 'error':
        return 'bg-red-900';
      case 'warning':
        return 'bg-yellow-900';
      default:
        return 'bg-blue-900';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-100';
      case 'error':
        return 'text-red-100';
      case 'warning':
        return 'text-yellow-100';
      default:
        return 'text-blue-100';
    }
  };

  return (
    <div
      className={`${getBgColor()} ${getTextColor()} px-4 py-3 rounded-lg shadow-lg flex items-start space-x-3 animate-slide-in`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-gray-300 hover:text-white transition-colors"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
