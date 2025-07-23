import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getReports();
      setReports(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (reportData) => {
    try {
      const newReport = await apiClient.createReport(reportData);
      await fetchReports(); // Refresh the list
      return newReport;
    } catch (error) {
      throw error;
    }
  };

  const updateReport = async (reportId, updateData) => {
    try {
      const updatedReport = await apiClient.updateReport(reportId, updateData);
      await fetchReports(); // Refresh the list
      return updatedReport;
    } catch (error) {
      throw error;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await apiClient.deleteReport(reportId);
      await fetchReports(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
  };
};