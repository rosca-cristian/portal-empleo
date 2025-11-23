import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import CompanyApplicationCard from '../components/candidate/CompanyApplicationCard';
import './JobApplications.css';

interface Application {
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
}

interface Job {
  id: string;
  title: string;
}

export default function JobApplications() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [hasAcceptedCandidate, setHasAcceptedCandidate] = useState(false);
  const [acceptedCandidateName, setAcceptedCandidateName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not a company
  if (user?.userType !== 'company') {
    navigate('/browse');
    return null;
  }

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch job details
      const jobResponse = await api.get(`/jobs/${jobId}`);
      setJob(jobResponse.data);

      // Fetch applications (now returns object with applications array and metadata)
      const applicationsResponse = await api.get(`/applications/for-job/${jobId}`);
      const { applications, hasAcceptedCandidate, acceptedCandidateName } = applicationsResponse.data;

      setApplications(applications);
      setHasAcceptedCandidate(hasAcceptedCandidate);
      setAcceptedCandidateName(acceptedCandidateName);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to view these applications');
      } else if (error.response?.status === 404) {
        setError('Job not found');
      } else {
        setError('Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (_applicationId: string, newStatus: string) => {
    try {
      if (newStatus === 'accepted') {
        setSuccessMessage('Interview scheduled! Candidate has been notified.');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
      // Refresh the list
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="job-applications-container">
        <div className="job-applications-loading">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-applications-container">
        <div className="job-applications-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="btn-back-to-dashboard"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-applications-container">
      <div className="job-applications-content">
        <div className="job-applications-header">
          <button
            className="btn-back"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to My Jobs
          </button>
          <h1 className="job-applications-title">
            Applications for: {job?.title || 'Job'}
          </h1>
          <div className="applications-count-header">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {hasAcceptedCandidate && acceptedCandidateName && (
          <div className="position-filled-banner">
            <strong>Position Filled:</strong> Interview scheduled with {acceptedCandidateName}.
            <div className="mvp-limitation-note">
              MVP limitation: Only one candidate per job posting can be accepted.
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="job-applications-empty">
            <h2>No applications yet</h2>
            <p>Candidates will see your posting soon!</p>
            <p className="empty-tip">Make sure your job posting is active and visible to candidates.</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <CompanyApplicationCard
                key={application.id}
                application={application}
                hasAcceptedCandidate={hasAcceptedCandidate}
                acceptedCandidateName={acceptedCandidateName}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
