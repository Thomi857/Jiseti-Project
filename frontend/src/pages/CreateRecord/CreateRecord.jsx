import { useState } from 'react';
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import api from '../../api';

function CreateRecord() {
  const [formData, setFormData] = useState({
    subject: '', description: '', type: 'red-flag', latitude: null, longitude: null, media: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setMessage('');
    setFormData((prev) => ({ ...prev, media: e.target.files[0] }));
  };

  const handleCoordinates = ({ lat, lng }) => {
    setMessage('');
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!formData.subject.trim()) {
      setMessage('Subject cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const body = new FormData();
      body.append('subject', formData.subject);
      body.append('description', formData.description);
      body.append('type', formData.type);
      if (formData.latitude !== null && formData.longitude !== null) {
        body.append('latitude', formData.latitude);
        body.append('longitude', formData.longitude);
      } else {
        setMessage('Please select coordinates on the map.');
        setLoading(false);
        return;
      }
      if (formData.media) body.append('media', formData.media);

      const response = await api.post('/reports', body);

      setMessage('Record created successfully!');
      setFormData({ subject: '', description: '', type: 'red-flag', latitude: null, longitude: null, media: null });
      e.target.reset();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to create record. Please try again.');
      console.error('Create Record Error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6 my-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Record</h2>
      {message && (
        <p className={`text-center p-3 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            id="subject" name="subject" type="text" placeholder="Enter subject" value={formData.subject} onChange={handleChange} required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description" name="description" placeholder="Enter description" value={formData.description} onChange={handleChange} required rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Record Type</label>
          <select
            id="type" name="type" value={formData.type} onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="red-flag">Red Flag</option>
            <option value="intervention">Intervention</option>
          </select>
        </div>
        <div className="border p-4 rounded-md bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Location on Map</label>
          <MapDisplay setCoordinates={handleCoordinates} />
          <p className="mt-2 text-sm text-gray-600">
            Coordinates: {formData.latitude !== null ? formData.latitude.toFixed(6) : 'N/A'}, {formData.longitude !== null ? formData.longitude.toFixed(6) : 'N/A'}
          </p>
        </div>
        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700">Upload Media (Image/Video)</label>
          <input
            id="media" type="file" accept=".png,.jpg,.jpeg,.gif,.mp4,.mov" onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Record'}
        </button>
      </form>
    </div>
  );
}

export default CreateRecord;