import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import PDFPreviewModal from '../components/shared/PDFPreviewModal';
import './CandidateProfile.css';

interface CandidateProfileData {
  id: string;
  fullName: string | null;
  email: string;
  profileDescription: string | null;
  activeCV: {
    id: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
  } | null;
}

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCVModal, setShowCVModal] = useState(false);

  useEffect(() => {
    fetchCandidateProfile();
  }, [id]);

  const fetchCandidateProfile = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/candidates/${id}/profile`);
      setProfile(response.data);
    } catch (err: any) {
      console.error('Error fetching candidate profile:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to view this candidate profile. Only companies with applications from this candidate can view their profile.');
      } else if (err.response?.status === 404) {
        setError('Candidate not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load candidate profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleViewCV = () => {
    if (profile?.activeCV) {
      setShowCVModal(true);
    }
  };

  const handleDownloadCV = () => {
    if (!profile?.activeCV) return;

    const cvUrl = `${import.meta.env.VITE_API_URL}/cvs/${profile.activeCV.id}/download`;
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = profile.activeCV.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackToApplications = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="candidate-profile-container">
        <div className="candidate-profile-loading">Loading candidate profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-profile-container">
        <div className="candidate-profile-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-back" onClick={handleBackToApplications}>
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="candidate-profile-container">
        <div className="candidate-profile-error">
          <p>Candidate profile not found</p>
          <button className="btn-back" onClick={handleBackToApplications}>
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="candidate-profile-container">
        <div className="candidate-profile-content">
          {/* Breadcrumb / Back Navigation */}
          <div className="candidate-profile-breadcrumb">
            <button className="btn-back-link" onClick={handleBackToApplications}>
              ← Back to Applications
            </button>
          </div>

          {/* Header with indicator */}
          <div className="candidate-profile-header">
            <h1 className="candidate-profile-title">Candidate Profile</h1>
            <div className="read-only-badge">Read-Only View</div>
          </div>

          {/* Candidate Name */}
          <section className="candidate-profile-section">
            <h2 className="section-header">Candidate Information</h2>
            <div className="candidate-info-display">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{profile.fullName || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{profile.email}</span>
              </div>
            </div>
          </section>

          {/* Profile Description */}
          <section className="candidate-profile-section">
            <h2 className="section-header">Profile Description</h2>
            <div className="candidate-profile-view">
              <p className="candidate-description-text">
                {profile.profileDescription || 'No profile description available'}
              </p>
            </div>
          </section>

          {/* Active CV */}
          <section className="candidate-profile-section">
            <h2 className="section-header">Current Active CV</h2>
            {profile.activeCV ? (
              <div className="candidate-cv-card">
                <h3 className="cv-filename">{profile.activeCV.fileName}</h3>
                <div className="cv-meta">
                  <span>
                    Uploaded{' '}
                    {formatDistanceToNow(new Date(profile.activeCV.uploadedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span>{formatFileSize(profile.activeCV.fileSize)}</span>
                </div>
                <div className="cv-actions-candidate">
                  <button className="btn-view-cv" onClick={handleViewCV}>
                    View CV
                  </button>
                  <button className="btn-download-cv" onClick={handleDownloadCV}>
                    Download CV
                  </button>
                </div>
              </div>
            ) : (
              <div className="cv-empty-state">
                <p>This candidate does not have an active CV</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {profile.activeCV && (
        <PDFPreviewModal
          isOpen={showCVModal}
          onClose={() => setShowCVModal(false)}
          pdfUrl={`${import.meta.env.VITE_API_URL}/cvs/${profile.activeCV.id}/download`}
          fileName={profile.activeCV.fileName}
          candidateName={profile.fullName || 'Candidate'}
          showDownloadButton={true}
          onDownload={handleDownloadCV}
        />
      )}
    </>
  );
}
