import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { applicationService } from '../services/applicationService';
import api from '../services/api';
import './JobDetail.css';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    email: string;
  };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship'
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    // Check if user has already applied (only for authenticated candidates)
    if (isAuthenticated && user?.userType === 'candidate' && id) {
      checkApplicationStatus();
    }
  }, [id, isAuthenticated, user]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Job not found');
      } else {
        setError('Failed to load job details');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!id) return;
    try {
      const result = await applicationService.checkApplication(id);
      setHasApplied(result.hasApplied);
    } catch (error) {
      // Silently fail - user can still try to apply
      console.error('Error checking application status:', error);
    }
  };

  const formatSalary = () => {
    if (!job?.salaryMin && !job?.salaryMax) return null;
    if (job.salaryMin && job.salaryMax) {
      return `€${job.salaryMin.toLocaleString()} - €${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `From €${job.salaryMin.toLocaleString()}`;
    return `Up to €${job.salaryMax!.toLocaleString()}`;
  };

  const showApplyButton = () => {
    // Hide for companies
    if (user?.userType === 'company') return false;
    return true;
  };

  const handleApplyClick = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/jobs/${id}`);
      return;
    }

    if (isApplying || hasApplied) return;

    try {
      setIsApplying(true);

      // Optimistic UI update
      setHasApplied(true);
      setShowSuccessMessage(true);

      // Submit application
      await applicationService.createApplication({ jobId: id! });

      // Keep success message visible
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error: any) {
      // Revert optimistic update on error
      setHasApplied(false);
      setShowSuccessMessage(false);

      if (error.response?.status === 409) {
        // Already applied
        setHasApplied(true);
        alert('You have already applied to this job');
      } else if (error.response?.data?.code === 'NO_CV') {
        // No CV uploaded
        const shouldRedirect = confirm('Please upload a CV before applying. Would you like to upload one now?');
        if (shouldRedirect) {
          navigate(`/profile?tab=cv&redirect=/jobs/${id}`);
        }
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="job-detail-container">
        <div className="job-detail-loading">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-container">
        <div className="job-detail-error">
          <h2>{error || 'Job not found'}</h2>
          <button className="btn-back" onClick={() => navigate('/browse')}>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-container">
      <div className="job-detail-content">
        {/* Header */}
        <div className="job-detail-header">
          <h1 className="job-detail-title">{job.title}</h1>
          <div className="job-detail-meta">
            <span className="job-company">{job.company.companyName}</span>
            <span className="job-location">📍 {job.location}</span>
            <span className={`job-type-badge ${job.jobType}`}>
              {JOB_TYPE_LABELS[job.jobType] || job.jobType}
            </span>
          </div>
          {formatSalary() && (
            <div className="job-salary">{formatSalary()}</div>
          )}
          <div className="job-posted">
            Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
        </div>

        {/* Description */}
        <div className="job-detail-section">
          <h2 className="section-title">Job Description</h2>
          <div className="job-description">{job.description}</div>
        </div>

        {/* Apply Section */}
        {showApplyButton() && (
          <div className="job-detail-actions">
            {showSuccessMessage && (
              <div className="job-detail-success">
                <h3>✓ Application Submitted Successfully!</h3>
                <p>Your application has been sent to {job.company.companyName}.</p>
                <div className="success-actions">
                  <button onClick={() => navigate('/browse')} className="btn-secondary">
                    Browse More Jobs
                  </button>
                  <button onClick={() => navigate('/applications')} className="btn-secondary">
                    View My Applications
                  </button>
                </div>
              </div>
            )}

            {!showSuccessMessage && (
              <>
                {hasApplied ? (
                  <button className="btn-applied" disabled>
                    APPLIED ✓
                  </button>
                ) : isAuthenticated ? (
                  <button
                    className="btn-apply"
                    onClick={handleApplyClick}
                    disabled={isApplying}
                  >
                    {isApplying ? 'Submitting Application...' : 'Apply Now'}
                  </button>
                ) : (
                  <button
                    className="btn-login-apply"
                    onClick={() => navigate(`/login?redirect=/jobs/${job.id}`)}
                  >
                    Login to Apply
                  </button>
                )}
                <p className="apply-note">
                  {hasApplied
                    ? 'You have already applied to this position'
                    : isAuthenticated
                    ? 'One-click application with your active CV'
                    : 'Please log in to submit your application'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
