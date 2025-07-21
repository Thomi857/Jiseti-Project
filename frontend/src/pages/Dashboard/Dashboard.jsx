import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, filter]);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/api/records'); // proxy in vite.config.js should handle this
      setRecords(res.data.records);
    } catch (err) {
      console.error('Failed to fetch records:', err);
    }
  };

  const filterRecords = () => {
    if (filter === 'all') {
      setFilteredRecords(records);
    } else {
      setFilteredRecords(records.filter((r) => r.type === filter));
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Reports</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => handleFilterChange('all')} className="bg-gray-200 px-3 py-1 rounded">
          All
        </button>
        <button onClick={() => handleFilterChange('red-flag')} className="bg-red-200 px-3 py-1 rounded">
          Red-flag
        </button>
        <button onClick={() => handleFilterChange('intervention')} className="bg-blue-200 px-3 py-1 rounded">
          Intervention
        </button>
      </div>

      {filteredRecords.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{record.title}</h2>
              <p className="text-sm text-gray-600 mb-1">Type: {record.type}</p>
              <p className="text-sm text-gray-600 mb-1">Status: {record.status}</p>
              <p className="text-sm text-gray-600 mb-1">By: {record.created_by}</p>
              <p className="mt-2">{record.description}</p>
              {/* Optionally show media, location, actions, etc. */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
