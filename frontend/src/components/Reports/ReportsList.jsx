import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ReportCard from './ReportCard';
import ReportEditModal from './ReportEditModal';
import { useReports } from '../../hooks/useReports';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Select from '../UI/Select';

const ReportsList = () => {
  const { reports, loading, error, updateReport, deleteReport } = useReports();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { error: showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedReport, setSelectedReport] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Get the "filter=mine" parameter from URL
  const filterParam = searchParams.get('filter');
  const showMyReports = filterParam === 'mine' && isAuthenticated;

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setEditModalOpen(true);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete report');
    }
  };

  const handleUpdateReport = async (reportId, updateData) => {
    try {
      await updateReport(reportId, updateData);
      setEditModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleMyReportsToggle = (state) => {
    if (state) {
      setSearchParams({ filter: 'mine' });
    } else {
      setSearchParams({});
    }
  };

  // Filter reports based on status, type, and "my reports" toggle
  const filteredReports = reports.filter(report => {
    if (showMyReports && report.user_id !== user.id) return false;
    if (filter !== 'all' && report.status !== filter) return false;
    if (typeFilter !== 'all' && report.record_type !== typeFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports</h1>
        <p className="text-gray-600">
          View all corruption reports and government intervention requests.
        </p>
      </div>

      {/* Admin Mode Toggle */}
      {isAdmin && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={adminMode}
              onChange={(e) => setAdminMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {adminMode ? 'Admin Mode: ON' : 'Admin Mode: OFF'}
            </span>
          </label>
          {adminMode && (
            <p className="text-xs text-blue-600 mt-2 ml-7">
              Delete buttons and status controls are now visible on all cards.
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            {/* My Reports Toggle */}
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMyReports}
                    onChange={(e) => handleMyReportsToggle(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">My Reports</span>
                </label>
              </div>
            )}

            <div>
              <Select
                label="Status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="rejected">Rejected</option>
                <option value="resolved">Resolved</option>
              </Select>
            </div>
            <div>
              <Select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="red_flag">Red Flag</option>
                <option value="intervention">Intervention</option>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {filteredReports.length} of {reports.length} reports
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {reports.length === 0 ? 'No reports found' : 'No reports match your filters'}
          </div>
          {/* CTA for logged-out users */}
          {!isAuthenticated && (
            <p className="text-sm text-gray-400">
              <a href="/login" className="text-jisefi-green-dark font-medium hover:underline">Login to report</a>
              {' or '}
              <a href="/register" className="text-jisefi-green-dark font-medium hover:underline">sign up to contribute</a>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onEdit={handleEditReport}
                onDelete={handleDeleteReport}
                adminMode={adminMode}
              />
            ))}
          </div>

          {/* CTA for logged-out users shown below the feed */}
          {!isAuthenticated && (
            <div className="mt-10 text-center">
              <p className="text-gray-500 mb-2">Want to report corruption or request intervention?</p>
              <div className="flex justify-center gap-4">
                <a
                  href="/login"
                  className="px-4 py-2 border border-jisefi-green-dark text-jisefi-green-dark rounded-lg text-sm font-semibold hover:bg-jisefi-green-dark hover:text-white transition-all duration-300"
                >
                  Login to report
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-jisefi-yellow-accent text-jisefi-green-dark rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-all duration-300"
                >
                  Sign up to contribute
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedReport && (
        <ReportEditModal
          report={selectedReport}
          onClose={() => setEditModalOpen(false)}
          onUpdate={(updateData) => handleUpdateReport(selectedReport.id, updateData)}
        />
      )}
    </div>
  );
};

export default ReportsList;