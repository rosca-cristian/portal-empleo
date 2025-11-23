import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import PDFPreviewModal from '../shared/PDFPreviewModal';
import InterviewScheduleModal from '../shared/InterviewScheduleModal';
import { applicationService } from '../../services/applicationService';
import './CompanyApplicationCard.css';

interface CompanyApplicationCardProps {
  application: {
    id: string;
    status: string;
    appliedAt: string;
    coverLetter?: string;
    candidate: {
      id: string;
      name: string;
      description?: string;
    };
    cv: {
      id: string;
      filename: string;
    };
  };
  hasAcceptedCandidate: boolean;
  acceptedCandidateName?: string;
  onStatusUpdate: (applicationId: string, newStatus: string) => void;
}

export default function CompanyApplicationCard({
  application,
  hasAcceptedCandidate,
  acceptedCandidateName,
  onStatusUpdate,
}: CompanyApplicationCardProps) {
  const navigate = useNavigate();
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-badge-pending';
      case 'accepted':
        return 'status-badge-accepted';
      case 'rejected':
        return 'status-badge-rejected';
      case 'reviewed':
        return 'status-badge-reviewed';
      default:
        return 'status-badge-default';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const truncateDescription = (text: string | undefined, maxLength: number = 150) => {
    if (!text) return 'No profile description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleViewCV = () => {
    setShowCVModal(true);
  };

  const handleDownloadCV = () => {
    // Download CV file
    const cvUrl = `${import.meta.env.VITE_API_URL}/applications/${application.id}/cv`;
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = application.cv.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${application.candidate.id}`);
  };

  const handleAccept = () => {
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = async (data: {
    interviewDate: string;
    interviewTime: string;
    location?: string;
    notes?: string;
  }) => {
    await applicationService.acceptApplication(application.id, data);
    // Refresh the application list
    onStatusUpdate(application.id, 'accepted');
  };

  const handleReject = () => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      onStatusUpdate(application.id, 'rejected');
    }
  };

  const isPending = application.status.toLowerCase() === 'pending';
  const isCurrentApplicationAccepted = application.status.toLowerCase() === 'accepted';
  const canAccept = isPending && !hasAcceptedCandidate;

  return (
    <>
      <div className="company-application-card">
        <div className="company-app-card-header">
          <div className="candidate-info">
            <h3 className="candidate-name">{application.candidate.name}</h3>
            <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
              {getStatusText(application.status)}
            </span>
          </div>
          <div className="application-date">
            Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
          </div>
        </div>

        <div className="company-app-card-body">
          <p className="candidate-description">
            {truncateDescription(application.candidate.description)}
          </p>

          {application.coverLetter && (
            <div className="cover-letter-section">
              <button
                className="btn-toggle-cover-letter"
                onClick={() => setShowCoverLetter(!showCoverLetter)}
              >
                {showCoverLetter ? '− Hide' : '+ View'} Cover Letter
              </button>
              {showCoverLetter && (
                <div className="cover-letter-content">
                  <p>{application.coverLetter}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="company-app-card-actions">
          <button
            className="btn-view-cv btn-primary-action"
            onClick={handleViewCV}
          >
            View CV
          </button>
          <button
            className="btn-view-profile"
            onClick={handleViewProfile}
          >
            View Profile
          </button>
          {isPending && (
            <>
              {hasAcceptedCandidate && !isCurrentApplicationAccepted && (
                <div className="position-filled-notice">
                  Position filled - interview scheduled with {acceptedCandidateName}
                  <div className="mvp-limitation-tooltip">
                    MVP limitation: Only one candidate per job can be accepted
                  </div>
                </div>
              )}
              <button
                className={`btn-accept ${!canAccept ? 'btn-disabled' : ''}`}
                onClick={canAccept ? handleAccept : undefined}
                disabled={!canAccept}
                title={!canAccept ? 'Position already filled. MVP limitation: Only one candidate per job.' : ''}
              >
                Accept
              </button>
              <button
                className="btn-reject"
                onClick={handleReject}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      <PDFPreviewModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        pdfUrl={`${import.meta.env.VITE_API_URL}/applications/${application.id}/cv`}
        fileName={application.cv.filename}
        candidateName={application.candidate.name}
        showDownloadButton={true}
        onDownload={handleDownloadCV}
      />

      <InterviewScheduleModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSubmit={handleScheduleInterview}
        candidateName={application.candidate.name}
      />
    </>
  );
}
