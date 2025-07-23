import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { getCurrentLocation } from '../../utils/helpers';
import { REPORT_TYPES, REPORT_TYPE_LABELS } from '../../utils/constants';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Textarea from '../UI/Textarea';

const CreateReportForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    record_type: REPORT_TYPES.RED_FLAG,
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.createReport({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setFormData({
        ...formData,
        latitude: location.latitude.toFixed(6),
        longitude: location.longitude.toFixed(6),
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Unable to get your current location. Please enter coordinates manually.');
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Report</h1>
        <p className="text-gray-600">
          Report corruption or request government intervention for issues in your community.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-md bg-error-50 p-4">
              <div className="text-sm text-error-700">{error}</div>
            </div>
          )}

          <div>
            <Select
              id="record_type"
              name="record_type"
              label="Report Type"
              required
              value={formData.record_type}
              onChange={handleChange}
            >
              <option value={REPORT_TYPES.RED_FLAG}>
                {REPORT_TYPE_LABELS[REPORT_TYPES.RED_FLAG]} (Corruption)
              </option>
              <option value={REPORT_TYPES.INTERVENTION}>
                {REPORT_TYPE_LABELS[REPORT_TYPES.INTERVENTION]} (Government Action Needed)
              </option>
            </Select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.record_type === REPORT_TYPES.RED_FLAG
                ? 'Report corruption, bribery, or misuse of funds'
                : 'Request government intervention for issues like bad roads, flooding, etc.'
              }
            </p>
          </div>

          <div>
            <Input
              type="text"
              id="title"
              name="title"
              label="Title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title describing the issue"
            />
          </div>

          <div>
            <Textarea
              id="description"
              name="description"
              label="Description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the issue..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                id="latitude"
                name="latitude"
                label="Latitude"
                required
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., -1.286389"
              />
            </div>
            <div>
              <Input
                type="number"
                id="longitude"
                name="longitude"
                label="Longitude"
                required
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., 36.817223"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
            >
              <MapPinIcon className="h-4 w-4 mr-2" />
              {gettingLocation ? 'Getting location...' : 'Use current location'}
            </Button>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
            >
              Create Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportForm;