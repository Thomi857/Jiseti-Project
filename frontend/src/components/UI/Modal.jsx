// import React from 'react'; // Ensure React is imported if not already
// import { XMarkIcon } from '@heroicons/react/24/outline'; // Keep Heroicons, they fit the aesthetic

// const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4"> {/* Darker overlay for better contrast */}
//       <div className={`bg-white rounded-xl shadow-medium ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}> {/* Larger rounded corners, custom shadow */}
//         <div className="flex items-center justify-between p-6 border-b border-jisefi-light-grey"> {/* Jisefi border color */}
//           <h3 className="text-xl font-semibold text-jisefi-green-dark"> {/* Jisefi heading style */}
//             {title}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-jisefi-dark-grey/60 hover:text-jisefi-dark-grey transition-colors duration-200" // Jisefi text colors for close button
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
// Modal.jsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Keep Heroicons, they fit the aesthetic

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4"> {/* Darker overlay for better contrast */}
      <div className={`bg-white rounded-xl shadow-medium ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}> {/* Larger rounded corners, custom shadow */}
        <div className="flex items-center justify-between p-6 border-b border-jisefi-light-grey"> {/* Jisefi border color */}
          <h3 className="text-xl font-semibold text-jisefi-green-dark"> {/* Jisefi heading style */}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-jisefi-dark-grey/60 hover:text-jisefi-dark-grey transition-colors duration-200" // Jisefi text colors for close button
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
