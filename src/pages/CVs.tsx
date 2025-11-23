import { useState, useEffect } from 'react';
import api from '../services/api';
import CVUploadWidget from '../components/candidate/CVUploadWidget';
import CVListCard from '../components/candidate/CVListCard';
import PDFPreviewModal from '../components/shared/PDFPreviewModal';
import './CVs.css';

interface CV {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
}

export default function CVs() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [previewCV, setPreviewCV] = useState<CV | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cvs');
      setCvs(response.data);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setMessage('✓ CV uploaded successfully');
    fetchCVs();
    setShowUpload(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = () => {
    setMessage('✓ CV deleted');
    fetchCVs();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSetActive = async (cvId: string) => {
    try {
      await api.put(`/cvs/${cvId}/set-active`);
      setMessage('✓ Active CV updated');
      fetchCVs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error setting active CV:', error);
    }
  };

  const handlePreview = (cv: CV) => {
    setPreviewCV(cv);
  };

  if (loading) {
    return (
      <div className="cvs-container">
        <div className="cvs-loading">Loading CVs...</div>
      </div>
    );
  }

  return (
    <div className="cvs-container">
      <div className="cvs-content">
        <div className="cvs-header">
          <h1 className="cvs-title">My CVs</h1>
          <button
            className="btn-upload-new"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? 'Cancel' : 'Upload New CV'}
          </button>
        </div>

        {message && <div className="success-message-cv">{message}</div>}

        {showUpload && (
          <div className="upload-section">
            <CVUploadWidget onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {cvs.length === 0 ? (
          <div className="cvs-empty-state">
            <p>No CVs yet. Upload your first CV to start applying to jobs.</p>
            <button className="btn-upload-large" onClick={() => setShowUpload(true)}>
              Upload CV
            </button>
          </div>
        ) : (
          <div className="cvs-list">
            {cvs.map((cv) => (
              <CVListCard
                key={cv.id}
                cv={cv}
                onDelete={handleDelete}
                onSetActive={() => handleSetActive(cv.id)}
                onPreview={() => handlePreview(cv)}
              />
            ))}
          </div>
        )}
      </div>

      {previewCV && (
        <PDFPreviewModal
          isOpen={!!previewCV}
          onClose={() => setPreviewCV(null)}
          pdfUrl={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/cvs/${previewCV.id}/download`}
          fileName={previewCV.fileName}
        />
      )}
    </div>
  );
}
