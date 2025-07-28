import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ReportCard from './ReportCard';
import ReportEditModal from './ReportEditModal';
import { useReports } from '../../hooks/useReports';
import LoadingSpinner from '../UI/LoadingSpinner';
import Select from '../UI/Select';

const ReportsList = () => {
  const { reports, loading, error, updateReport, deleteReport } = useReports();
  const [selectedReport, setSelectedReport] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { isAuthenticated } = useAuth();

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setEditModalOpen(true);
  };

  const handleDeleteReport = async (report) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(report.id);
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete report');
      }
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

  const filteredReports = reports.filter(report => {
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
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
          {!isAuthenticated && (
            <p className="text-sm text-gray-400">
              Sign in to create your first report
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedReport && (
        <ReportEditModal
          report={selectedReport}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdateReport}
        />
      )}
    </div>
  );
};

export default ReportsList;