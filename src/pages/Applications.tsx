import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService, type Application } from '../services/applicationService';
import ApplicationCard from '../components/candidate/ApplicationCard';
import './Applications.css';

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseJobs = () => {
    navigate('/browse');
  };

  if (loading) {
    return (
      <div className="applications-container">
        <div className="applications-loading">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-container">
        <div className="applications-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-content">
        <div className="applications-header">
          <h1 className="applications-title">My Applications</h1>
        </div>

        {applications.length === 0 ? (
          <div className="applications-empty-state">
            <p>No applications yet. Browse jobs to get started!</p>
            <button className="btn-browse-jobs" onClick={handleBrowseJobs}>
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
