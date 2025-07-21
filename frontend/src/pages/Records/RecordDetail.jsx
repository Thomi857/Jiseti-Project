import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

function RecordDetail() {
  const { id } = useParams();
  const { user } = useAuth(); // ✅ This replaces AuthContext
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await api.get(`/reports/${id}`);
        setRecord(response.data);
      } catch (err) {
        setError('Failed to load record');
        console.error(err);
      }
    };
    fetchRecord();
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!record) return <p>Loading...</p>;

  const isOwner = user && user.id === record.user_id;
  const isEditable = record.status === 'draft';

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">{record.subject}</h2>
      <p className="mb-2 text-gray-600">{record.description}</p>
      <p className="text-sm text-gray-500 mb-4">Type: {record.type}</p>
      <p className="text-sm text-gray-500 mb-4">Status: {record.status}</p>

      {record.latitude && record.longitude && (
        <p className="mb-4">Location: {record.latitude}, {record.longitude}</p>
      )}

      {record.media_url && (
        <div className="mb-4">
          {record.media_url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img src={record.media_url} alt="Media" className="max-w-full rounded" />
          ) : (
            <video controls className="max-w-full rounded">
              <source src={record.media_url} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {isOwner && isEditable && (
        <div className="space-x-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Edit
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default RecordDetail;
