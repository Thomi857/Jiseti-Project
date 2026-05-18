import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import apiClient from '../../api/client';
import ConfirmDialog from '../UI/ConfirmDialog';
import {
  getStatusColor,
  getStatusText,
  getTypeColor,
  getTypeText,
  formatDate,
  formatCoordinates
} from '../../utils/helpers';
import ReportMap from './ReportMap';

const ReportCard = ({ report, onEdit, onDelete, onStatusChange, adminMode = false }) => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine if the user can edit/delete
  // Admins can edit/delete any report.
  // Regular users can only edit/delete their own reports if the status is 'draft'.
  const isOwner = user && user.id === report.user_id;
  const isDraft = report.status === 'draft';

  const canEdit = user?.is_admin || (isOwner && isDraft);
  const canDelete = (user?.is_admin && adminMode) || (isOwner && isDraft);
  const canUpdateStatus = user?.is_admin && adminMode;

  // For public feed (unauthenticated users), show limited information
  const isPublicFeed = !user;

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(report.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete report. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusChange(report.id, { status: newStatus });
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to update status.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(report.record_type)}`}>
                  {getTypeText(report.record_type)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {report.title}
              </h3>
              {!isPublicFeed && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {report.description}
                </p>
              )}
              {isPublicFeed && (
                <p className="text-gray-500 text-sm italic mb-4">
                  Login to view full report details
                </p>
              )}
            </div>

            {(canUpdateStatus || canEdit || canDelete) && (
              <div className="flex items-center space-x-2 ml-4">
                {canUpdateStatus && (
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white text-sm px-2 py-1"
                    title="Change report status"
                  >
                    <option value="draft">Draft</option>
                    <option value="under_investigation">Under Investigation</option>
                    <option value="rejected">Rejected</option>
                    <option value="resolved">Resolved</option>
                  </select>
                )}
                {canEdit && (
                  <button
                    onClick={() => onEdit(report)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Edit report"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete report"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {report.latitude && report.longitude && (
            <ReportMap
              lat={parseFloat(report.latitude)}
              lng={parseFloat(report.longitude)}
              blur={isPublicFeed}
            />
          )}

          <div className="flex flex-wrap items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:space-x-6 pt-4 border-t border-gray-100 mt-4">
            <div className="flex items-center space-x-1">
              <UserIcon className="h-4 w-4" />
              <span>{report.username}</span>
            </div>
            {!isPublicFeed && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{formatCoordinates(report.latitude, report.longitude)}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(report.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </>
  );
};

export default ReportCard;

// // ReportCard.jsx
// import { MapPinIcon, CalendarIcon, UserIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../../contexts/AuthContext';
// import { Link } from 'react-router-dom';
// import {
//   getStatusColor,
//   getStatusText,
//   getTypeColor,
//   getTypeText,
//   formatDate,
//   formatCoordinates
// } from '../../utils/helpers';
// import ReportMap from './ReportMap';
// import Button from '../UI/Button';

// const ReportCard = ({ report, onDelete }) => {
//   const { user } = useAuth();
  
//   const isOwner = user && user.id === report.user_id;
//   const isDraft = report.status === 'draft';

//   const canEdit = user?.is_admin || (isOwner && isDraft);
//   const canDelete = user?.is_admin || (isOwner && isDraft);

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//       <div className="p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <div className="flex items-center space-x-2 mb-2">
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(report.record_type)}`}>
//                 {getTypeText(report.record_type)}
//               </span>
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
//                 {getStatusText(report.status)}
//               </span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               {report.title}
//             </h3>
//             <p className="text-gray-600 text-sm line-clamp-3 mb-4">
//               {report.description}
//             </p>
//           </div>
//           {(canEdit || canDelete) && (
//             <div className="flex items-center space-x-2 ml-4">
//               {canEdit && (
//                 <Link to={`/edit-report/${report.id}`}>
//                   <button
//                     className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
//                     title="Edit report"
//                   >
//                     <PencilIcon className="h-4 w-4" />
//                   </button>
//                 </Link>
//               )}
//               {canDelete && (
//                 <button
//                   onClick={() => onDelete(report)}
//                   className="p-2 text-gray-400 hover:text-red-600 transition-colors"
//                   title="Delete report"
//                 >
//                   <TrashIcon className="h-4 w-4" />
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//         {report.latitude && report.longitude && (
//           <ReportMap
//             lat={parseFloat(report.latitude)}
//             lng={parseFloat(report.longitude)}
//           />
//         )}
//         <div className="flex flex-wrap items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:space-x-6 pt-4 border-t border-gray-100 mt-4">
//           <div className="flex items-center space-x-1">
//             <UserIcon className="h-4 w-4" />
//             <span>{report.username}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <MapPinIcon className="h-4 w-4" />
//             <span>{formatCoordinates(report.latitude, report.longitude)}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <CalendarIcon className="h-4 w-4" />
//             <span>{formatDate(report.created_at)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportCard;

