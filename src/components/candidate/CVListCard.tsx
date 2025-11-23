import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import './CVListCard.css';

interface CVListCardProps {
  cv: {
    id: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    isActive: boolean;
  };
  onDelete: () => void;
  onSetActive: () => void;
  onPreview: () => void;
}

export default function CVListCard({ cv, onDelete, onSetActive, onPreview }: CVListCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/cvs/${cv.id}`);
      onDelete();
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="cv-list-card">
        <div className="cv-info">
          <h3 className="cv-filename">{cv.fileName}</h3>
          <div className="cv-meta">
            <span className="cv-date">
              Uploaded {formatDistanceToNow(new Date(cv.uploadedAt), { addSuffix: true })}
            </span>
            <span className="cv-size">{formatFileSize(cv.fileSize)}</span>
          </div>
          {cv.isActive && <span className="cv-badge-active">ACTIVE CV</span>}
        </div>

        <div className="cv-actions">
          <button className="btn-preview" onClick={onPreview}>
            Preview
          </button>
          {!cv.isActive && (
            <button className="btn-set-active" onClick={onSetActive}>
              Set as Active
            </button>
          )}
          <button className="btn-delete" onClick={() => setShowDeleteModal(true)}>
            Delete
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete {cv.fileName}?</h2>
            <p>This cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
