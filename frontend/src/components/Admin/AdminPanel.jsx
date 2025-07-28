import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';
import AdminReportCard from './AdminReportCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import Select from '../UI/Select';

const AdminPanel = () => {
  const { reports, loading, error, updateReport } = useReports();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { isAdmin } = useAuth();

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateReport(reportId, { status: newStatus });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  const filteredReports = reports.filter(report => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (typeFilter !== 'all' && report.record_type !== typeFilter) return false;
    return true;
  });

  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 text-lg font-medium">Access Denied</div>
        <p className="text-gray-500 mt-2">You need admin privileges to access this page.</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        <p className="text-gray-600">
          Manage report statuses and monitor all submissions.
        </p>
      </div>

  {/* Stats Overview */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-2xl font-bold text-gray-900">
        {reports.length}
      </div>
      <div className="text-sm text-gray-500">Total Reports</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-2xl font-bold text-warning-600">
        {statusCounts.under_investigation || 0}
      </div>
      <div className="text-sm text-gray-500">Under Investigation</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-2xl font-bold text-success-600">
        {statusCounts.resolved || 0}
      </div>
      <div className="text-sm text-gray-500">Resolved</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-2xl font-bold text-gray-600">
        {statusCounts.draft || 0}
      </div>
      <div className="text-sm text-gray-500">Draft</div>
    </div>
  </div>

  {/* Filters */}
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <div>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
    </div>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredReports.map((report) => (
        <AdminReportCard
          key={report.id}
          report={report}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  )}
</div>
  );
};

export default AdminPanel;

