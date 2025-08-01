// CreateReportForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
import apiClient from '../../api/client';
import { getCurrentLocation } from '../../utils/helpers';
import { REPORT_TYPES, REPORT_TYPE_LABELS } from '../../utils/constants';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Textarea from '../UI/Textarea';
import Modal from '../UI/Modal';

// This is a placeholder hook. You will need to implement a real one
// that provides the logged-in user's data from your backend.
const useAuth = () => {
  return {
    user: { id: 1, is_admin: true }, // Placeholder user
    isAuthenticated: true,
  };
};

const CreateReportForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user } = useAuth(); // Use the mock user to control admin features

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const mapLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (isEditing) {
      const fetchReport = async () => {
        try {
          const report = await apiClient.getReport(id);
          setFormData({
            title: report.title,
            description: report.description,
            record_type: report.record_type,
            latitude: report.latitude.toString(),
            longitude: report.longitude.toString(),
          });
        } catch (err) {
          setError('Failed to fetch report data');
        }
      };
      fetchReport();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    try {
      if (isEditing) {
        await apiClient.updateReport(id, payload);
      } else {
        await apiClient.createReport(payload);
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      await apiClient.deleteReport(id);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete report');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    } catch {
      setError('Unable to get your current location.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleMapClick = (e) => {
    setFormData({
      ...formData,
      latitude: e.detail.latLng.lat.toFixed(6),
      longitude: e.detail.latLng.lng.toFixed(6),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Report' : 'Create Report'}</h1>
        {isEditing && user?.is_admin && (
          <Button onClick={() => setShowDeleteModal(true)} variant="danger" icon={<TrashIcon className="w-4 h-4 mr-1" />}>
            Delete Report
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <Select
          name="record_type"
          label="Report Type"
          required
          value={formData.record_type}
          onChange={handleChange}
        >
          <option value={REPORT_TYPES.RED_FLAG}>{REPORT_TYPE_LABELS[REPORT_TYPES.RED_FLAG]}</option>
          <option value={REPORT_TYPES.INTERVENTION}>{REPORT_TYPE_LABELS[REPORT_TYPES.INTERVENTION]}</option>
        </Select>
        <Input name="title" label="Title" value={formData.title} onChange={handleChange} required />
        <Textarea name="description" label="Description" value={formData.description} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Input name="latitude" type="number" step="any" label="Latitude" value={formData.latitude} onChange={handleChange} required />
          <Input name="longitude" type="number" step="any" label="Longitude" value={formData.longitude} onChange={handleChange} required />
        </div>
        <Button type="button" onClick={handleGetCurrentLocation} disabled={gettingLocation}>
          <MapPinIcon className="w-4 h-4 mr-1" />
          {gettingLocation ? 'Getting location...' : 'Use Current Location'}
        </Button>
        <div className="h-64 rounded-lg shadow-lg overflow-hidden">
          <Map
            mapId={import.meta.env.VITE_MAP_ID}
            defaultCenter={{
              lat: parseFloat(formData.latitude) || -1.286389,
              lng: parseFloat(formData.longitude) || 36.817223,
            }}
            defaultZoom={14}
            gestureHandling="greedy"
            disableDefaultUI={true}
            onClick={handleMapClick}
          >
            <Marker
              position={{
                lat: parseFloat(formData.latitude),
                lng: parseFloat(formData.longitude),
              }}
            />
          </Map>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancel</Button>
          <Button type="submit" loading={loading}>{isEditing ? 'Update Report' : 'Create Report'}</Button>
        </div>
      </form>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this report? This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={() => setShowDeleteModal(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="danger" loading={loading}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateReportForm;

// CreateReportForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
import apiClient from '../../api/client';
import { getCurrentLocation } from '../../utils/helpers';
import { REPORT_TYPES, REPORT_TYPE_LABELS } from '../../utils/constants';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Textarea from '../UI/Textarea';
import Modal from '../UI/Modal';

const CreateReportForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const mapLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (isEditing) {
      const fetchReport = async () => {
        try {
          const report = await apiClient.getReport(id);
          setFormData({
            title: report.title,
            description: report.description,
            record_type: report.record_type,
            latitude: report.latitude.toString(),
            longitude: report.longitude.toString(),
          });
        } catch (err) {
          setError('Failed to fetch report data');
        }
      };
      fetchReport();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    try {
      if (isEditing) {
        await apiClient.updateReport(id, payload);
      } else {
        await apiClient.createReport(payload);
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      await apiClient.deleteReport(id);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete report');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    } catch {
      setError('Unable to get your current location.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleMapClick = (e) => {
    setFormData({
      ...formData,
      latitude: e.detail.latLng.lat.toFixed(6),
      longitude: e.detail.latLng.lng.toFixed(6),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Report' : 'Create Report'}</h1>
        {isEditing && (
          <Button onClick={() => setShowDeleteModal(true)} variant="danger" icon={<TrashIcon className="w-4 h-4 mr-1" />}>
            Delete Report
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <Select
          name="record_type"
          label="Report Type"
          required
          value={formData.record_type}
          onChange={handleChange}
        >
          <option value={REPORT_TYPES.RED_FLAG}>{REPORT_TYPE_LABELS[REPORT_TYPES.RED_FLAG]}</option>
          <option value={REPORT_TYPES.INTERVENTION}>{REPORT_TYPE_LABELS[REPORT_TYPES.INTERVENTION]}</option>
        </Select>
        <Input name="title" label="Title" value={formData.title} onChange={handleChange} required />
        <Textarea name="description" label="Description" value={formData.description} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Input name="latitude" type="number" step="any" label="Latitude" value={formData.latitude} onChange={handleChange} required />
          <Input name="longitude" type="number" step="any" label="Longitude" value={formData.longitude} onChange={handleChange} required />
        </div>
        <Button type="button" onClick={handleGetCurrentLocation} disabled={gettingLocation}>
          <MapPinIcon className="w-4 h-4 mr-1" />
          {gettingLocation ? 'Getting location...' : 'Use Current Location'}
        </Button>
        <div className="h-64 rounded-lg shadow-lg overflow-hidden">
          <Map
            mapId={import.meta.env.VITE_MAP_ID}
            defaultCenter={{
              lat: parseFloat(formData.latitude) || -1.286389,
              lng: parseFloat(formData.longitude) || 36.817223,
            }}
            defaultZoom={14}
            gestureHandling="greedy"
            disableDefaultUI={true}
            onClick={handleMapClick}
          >
            <Marker
              position={{
                lat: parseFloat(formData.latitude),
                lng: parseFloat(formData.longitude),
              }}
            />
          </Map>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancel</Button>
          <Button type="submit" loading={loading}>{isEditing ? 'Update Report' : 'Create Report'}</Button>
        </div>
      </form>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowDeleteModal(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="danger" loading={loading}>
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this report? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default CreateReportForm;

