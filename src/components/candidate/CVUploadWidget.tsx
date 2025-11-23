import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import './CVUploadWidget.css';

interface CVUploadWidgetProps {
  onUploadSuccess?: (cv: any) => void;
}

export default function CVUploadWidget({ onUploadSuccess }: CVUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError('');
    setSuccess(false);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await api.post('/cvs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percentCompleted);
        }
      });

      setSuccess(true);
      setUploadedFile({ name: file.name, size: file.size });
      setUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: uploading
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="cv-upload-widget">
      <div
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? 'dragging' : ''} ${success ? 'success' : ''} ${error ? 'error' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />

        {!uploading && !success && !error && (
          <>
            <div className="upload-icon">📄</div>
            <p className="upload-text">
              {isDragActive
                ? 'Drop your CV here'
                : 'Drag and drop your CV here, or click to browse'}
            </p>
            <p className="upload-format">PDF, DOC, DOCX (max 10MB)</p>
          </>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{progress}%</p>
          </div>
        )}

        {success && uploadedFile && (
          <div className="upload-success">
            <div className="success-icon">✓</div>
            <p className="success-message">CV uploaded successfully!</p>
            <p className="file-info">
              {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
            </p>
          </div>
        )}

        {error && (
          <div className="upload-error">
            <p className="error-message">✗ {error}</p>
            <button
              className="btn-retry"
              onClick={(e) => {
                e.stopPropagation();
                setError('');
                setSuccess(false);
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
