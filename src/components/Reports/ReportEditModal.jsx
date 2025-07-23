import { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Textarea from '../UI/Textarea';

const ReportEditModal = ({ report, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: report.title,
    description: report.description,
    latitude: report.latitude.toString(),
    longitude: report.longitude.toString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onUpdate({
        title: formData.title,
        description: formData.description,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update report');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Report" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-md p-4">
              <div className="text-sm text-error-700">{error}</div>
            </div>
          )}

          <div>
            <Input
              type="text"
              id="title"
              name="title"
              label="Title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <Textarea
              id="description"
              name="description"
              label="Description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                required
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                required
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
            >
              Update Report
            </Button>
          </div>
        </form>
    </Modal>
  );
};

export default ReportEditModal;