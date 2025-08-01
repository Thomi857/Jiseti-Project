// ReportsList.jsx
import { useState } from 'react';
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

  const { isAuthenticated, user } = useAuth();

  // REMOVE THE ADMIN CHECK HERE. Admins should see the list.
  // Permissions for individual actions (edit/delete) will be handled in ReportCard.

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setEditModalOpen(true);
  };

  const handleDeleteReport = async (report) => {
    // IMPORTANT: Replace window.confirm with a custom modal UI as per instructions
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
    // If the user is an admin, show all reports regardless of owner
    // Otherwise, show only reports owned by the current user
    if (!user?.is_admin && isAuthenticated && report.user_id !== user?.id) {
        return false;
    }

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

// // ReportsList.jsx
// import React, { useState } from 'react';
// import ReportCard from './ReportCard';
// import Modal from '../UI/Modal';
// import Button from '../UI/Button';
// import apiClient from '../../api/client';

// const ReportsList = ({ reports }) => {
//   // State to manage the delete confirmation modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [reportToDelete, setReportToDelete] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [error, setError] = useState('');

//   // Function called by ReportCard to start the delete process
//   const confirmDelete = (report) => {
//     setReportToDelete(report);
//     setShowDeleteModal(true);
//   };

//   // Function to perform the actual delete operation
//   const handleDelete = async () => {
//     if (!reportToDelete) return;

//     setIsDeleting(true);
//     setError('');

//     try {
//       await apiClient.deleteReport(reportToDelete.id);
//       // You may need to trigger a data refresh here,
//       // e.g., by refetching the reports list from the API.
//       // This part is dependent on your parent component's logic.
//     } catch (err) {
//       setError('Failed to delete report. Please check your backend API.');
//       console.error(err);
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteModal(false);
//       setReportToDelete(null);
//     }
//   };

//   if (!reports || reports.length === 0) {
//     return <div className="text-center text-gray-500">No reports found.</div>;
//   }

//   return (
//     <>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {reports.map((report) => (
//           <ReportCard key={report.id} report={report} onDelete={confirmDelete} />
//         ))}
//       </div>
//       <Modal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         title="Confirm Deletion"
//       >
//         <p>Are you sure you want to delete this report? This action cannot be undone.</p>
//         {reportToDelete && <p className="mt-2 text-sm text-gray-500">You are about to delete: **{reportToDelete.title}**</p>}
//         <div className="flex justify-end gap-2 mt-6">
//           <Button onClick={() => setShowDeleteModal(false)} variant="outline">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} variant="danger" loading={isDeleting}>
//             Delete
//           </Button>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default ReportsList;
