import { 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { getStatusColor, getStatusText, getTypeColor, getTypeText, formatDate, formatCoordinates } from '../../utils/helpers';
import { REPORT_STATUSES, REPORT_STATUS_LABELS } from '../../utils/constants';

const AdminReportCard = ({ report, onStatusUpdate }) => {
  const statusOptions = [
    { value: REPORT_STATUSES.DRAFT, label: REPORT_STATUS_LABELS[REPORT_STATUSES.DRAFT] },
    { value: REPORT_STATUSES.UNDER_INVESTIGATION, label: REPORT_STATUS_LABELS[REPORT_STATUSES.UNDER_INVESTIGATION] },
    { value: REPORT_STATUSES.REJECTED, label: REPORT_STATUS_LABELS[REPORT_STATUSES.REJECTED] },
    { value: REPORT_STATUSES.RESOLVED, label: REPORT_STATUS_LABELS[REPORT_STATUSES.RESOLVED] },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {report.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
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

        {/* Status Update */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status
          </label>
          <select
            value={report.status}
            onChange={(e) => onStatusUpdate(report.id, e.target.value)}
            className="w-full rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminReportCard;