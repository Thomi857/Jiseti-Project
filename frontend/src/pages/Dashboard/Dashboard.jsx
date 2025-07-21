import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);       // ✅ safe default
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(response.data);                 // ✅ store array
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.msg || 'Failed to load records.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [token]);

  // ✅ Filtering
  const filteredRecords =
    filterType === 'all'
      ? records
      : records.filter((record) => record.type === filterType);

  if (loading) return <p className="p-4 text-center">Loading records...</p>;

  if (error) return <p className="p-4 text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Reports</h1>

      <div className="mb-4 flex justify-center">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="red-flag">Red Flags</option>
          <option value="intervention">Interventions</option>
        </select>
      </div>

      {filteredRecords?.length === 0 ? (
        <p className="text-center text-gray-600">No records found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{record.subject}</h2>
              <p className="text-sm text-gray-600">{record.type}</p>
              <p className="mt-2 text-gray-700">{record.description}</p>
              <p className="mt-1 text-xs text-gray-500">
                Coordinates: {record.latitude}, {record.longitude}
              </p>
              <Link
                to={`/records/${record.id}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
