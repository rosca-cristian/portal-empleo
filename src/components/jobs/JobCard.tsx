import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { applicationService } from '../../services/applicationService';
import './JobCard.css';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    location: string;
    jobType: string;
    salaryMin?: number;
    salaryMax?: number;
    createdAt: string;
    company: {
      companyName: string;
    };
  };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship'
};

export default function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if user has already applied (only for authenticated candidates)
    if (isAuthenticated && user?.userType === 'candidate') {
      checkApplicationStatus();
    }
  }, [job.id, isAuthenticated, user]);

  const checkApplicationStatus = async () => {
    try {
      const result = await applicationService.checkApplication(job.id);
      setHasApplied(result.hasApplied);
    } catch (error) {
      // Silently fail - user can still try to apply
      console.error('Error checking application status:', error);
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    if (job.salaryMin && job.salaryMax) {
      return `€${job.salaryMin.toLocaleString()} - €${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `From €${job.salaryMin.toLocaleString()}`;
    return `Up to €${job.salaryMax!.toLocaleString()}`;
  };

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleApplyClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!isAuthenticated) {
      navigate(`/login?redirect=/jobs/${job.id}`);
      return;
    }

    if (isApplying || hasApplied) return;

    try {
      setIsApplying(true);

      // Optimistic UI update
      setHasApplied(true);
      setShowSuccessMessage(true);

      // Submit application
      await applicationService.createApplication({ jobId: job.id });

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
          navigate(`/profile?tab=cv&redirect=/jobs/${job.id}`);
        }
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const showApplyButton = () => {
    // Hide for companies and unauthenticated users can see login prompt
    return user?.userType !== 'company';
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      <h3 className="job-card-title">{job.title}</h3>
      <p className="job-card-company">{job.company.companyName}</p>
      <p className="job-card-location">📍 {job.location}</p>

      <div className="job-card-meta">
        <span className={`job-type-badge ${job.jobType}`}>
          {JOB_TYPE_LABELS[job.jobType] || job.jobType}
        </span>
        {formatSalary() && (
          <span className="job-salary">{formatSalary()}</span>
        )}
      </div>

      <p className="job-card-date">
        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
      </p>

      {/* Apply button section */}
      {showApplyButton() && (
        <div className="job-card-actions">
          {showSuccessMessage && (
            <div className="job-card-success">✓ Application submitted!</div>
          )}
          {hasApplied ? (
            <button className="job-card-applied" disabled>
              APPLIED ✓
            </button>
          ) : (
            <button
              className="job-card-apply"
              onClick={handleApplyClick}
              disabled={isApplying}
            >
              {isApplying ? 'Applying...' : isAuthenticated ? 'Apply Now' : 'Login to Apply'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
