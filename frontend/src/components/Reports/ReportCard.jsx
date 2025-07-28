import { 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon,
  PencilIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { getStatusColor, getStatusText, getTypeColor, getTypeText, formatDate, formatCoordinates } from '../../utils/helpers';

const ReportCard = ({ report, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();
  
  const canEdit = user && (user.id === report.user_id) && report.status === 'draft';
  const canDelete = user && (user.id === report.user_id) && report.status === 'draft';

  return (
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
            <p className="text-gray-600 text-sm line-clamp-3">
              {report.description}
            </p>
          </div>
          
          {(canEdit || canDelete) && (
            <div className="flex items-center space-x-2 ml-4">
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
                  onClick={() => onDelete(report)}
                  className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                  title="Delete report"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-1">
            <UserIcon className="h-4 w-4" />
            <span>{report.username}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{formatCoordinates(report.latitude, report.longitude)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(report.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;