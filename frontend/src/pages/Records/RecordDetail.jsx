import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getRecordById, deleteRecord } from '../../api/records';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RecordDetail() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecord() {
      const data = await getRecordById(id);
      setRecord(data);
    }
    fetchRecord();
  }, [id]);

  if (!record) return <p>Loading...</p>;

  const canEditOrDelete =
    record.created_by === user?.id && record.status === 'draft';

  const handleDelete = async () => {
    await deleteRecord(id);
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>{record.title}</h2>
      <p>{record.description}</p>
      <p>Type: {record.type}</p>
      <p>Status: {record.status}</p>
      <p>Location: {record.latitude}, {record.longitude}</p>
      {record.image_url && <img src={record.image_url} alt="Attachment" />}
      {record.video_url && (
        <video controls src={record.video_url} width="400" />
      )}

      {canEditOrDelete && (
        <div>
          <button onClick={() => navigate(`/records/${id}/edit`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default RecordDetail;
