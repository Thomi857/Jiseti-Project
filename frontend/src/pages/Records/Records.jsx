import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth'; // assuming you have this
import { Link } from 'react-router-dom';

function Records() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUserRecords();
  }, []);

  const fetchUserRecords = async () => {
    try {
      const res = await axios.get('/api/my-records'); 
      setRecords(res.data.records);
    } catch (err) {
      console.error('Error fetching user records:', err);
    }
  };

  const filtered = records.filter((r) =>
    filter === 'all' ? true : r.type === filter
  );

  const canEditOrDelete = (record) => {
    return (
      record.created_by === user?.username &&
      !['under investigation', 'rejected', 'resolved'].includes(record.status)
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Reports</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className="bg-gray-200 px-3 py-1 rounded">
          All
        </button>
        <button onClick={() => setFilter('red-flag')} className="bg-red-200 px-3 py-1 rounded">
          Red-flag
        </button>
        <button onClick={() => setFilter('intervention')} className="bg-blue-200 px-3 py-1 rounded">
          Intervention
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>You haven’t created any reports yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((record) => (
            <div key={record.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{record.title}</h2>
              <p className="text-sm text-gray-600">Type: {record.type}</p>
              <p className="text-sm text-gray-600">Status: {record.status}</p>
              <p className="mt-2">{record.description}</p>

              {canEditOrDelete(record) && (
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/edit/${record.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this record?')) return;
  try {
    await axios.delete(`/api/records/${id}`);
    window.location.reload();
  } catch (err) {
    console.error('Error deleting record:', err);
  }
};

export default Records;
