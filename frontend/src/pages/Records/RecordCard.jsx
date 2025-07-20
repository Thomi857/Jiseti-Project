import { Link } from 'react-router-dom';

function RecordCard({ record }) {
  return (
    <div className="record-card">
      <h3>{record.title}</h3>
      <p>Type: {record.type}</p>
      <p>Status: {record.status}</p>
      <Link to={`/records/${record.id}`}>View Details</Link>
    </div>
  );
}

export default RecordCard;
