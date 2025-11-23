import { useEffect } from 'react';
import './PDFPreviewModal.css';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
  candidateName?: string;
  showDownloadButton?: boolean;
  onDownload?: () => void;
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  fileName,
  candidateName,
  showDownloadButton = false,
  onDownload
}: PDFPreviewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <div className="pdf-modal-title-section">
            {candidateName && <h3 className="pdf-modal-candidate">{candidateName}</h3>}
            <h2 className="pdf-modal-title">{fileName}</h2>
          </div>
          <button className="pdf-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="pdf-modal-body">
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
          <div className="pdf-fallback">
            <p>PDF viewer not supported in your browser.</p>
            <a href={pdfUrl} download={fileName} className="btn-download">
              Download to view
            </a>
          </div>
        </div>
        {showDownloadButton && (
          <div className="pdf-modal-footer">
            <button className="btn-download-cv" onClick={handleDownload}>
              Download CV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
