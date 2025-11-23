import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Application } from '../../services/applicationService';
import StatusBadge from '../shared/StatusBadge';
import InterviewDetails from './InterviewDetails';
import './ApplicationCard.css';

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const navigate = useNavigate();

  const handleJobClick = () => {
    if (application.job) {
      navigate(`/jobs/${application.job.id}`);
    }
  };

  const handleViewJob = () => {
    if (application.job) {
      navigate(`/jobs/${application.job.id}`);
    }
  };

  // Check if job is available (not closed/deleted)
  const isJobAvailable = !!application.job;

  return (
    <div className="application-card">
      <div className="application-info">
        <div className="application-job-info">
          {isJobAvailable ? (
            <h3 className="application-job-title" onClick={handleJobClick}>
              {application.job?.title}
            </h3>
          ) : (
            <h3 className="application-job-title-disabled">
              [Job Removed]
            </h3>
          )}

          {isJobAvailable && application.job?.company && (
            <p className="application-company-name">
              {application.job.company.companyName}
            </p>
          )}

          <p className="application-date">
            Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
          </p>

          {!isJobAvailable && (
            <p className="application-closed-note">Job posting closed</p>
          )}
        </div>

        <StatusBadge status={application.status} />
      </div>

      {/* Interview details section - shown for accepted applications with interview */}
      {application.status === 'accepted' && application.interview && (
        <InterviewDetails interview={application.interview} />
      )}

      {/* Pending message - shown for pending applications */}
      {application.status === 'pending' && (
        <div className="application-pending-message">
          Waiting for company response...
        </div>
      )}

      <div className="application-actions">
        {isJobAvailable ? (
          <button className="btn-view-job" onClick={handleViewJob}>
            View Job
          </button>
        ) : (
          <button className="btn-view-job-disabled" disabled>
            View Job
          </button>
        )}
      </div>
    </div>
  );
}
