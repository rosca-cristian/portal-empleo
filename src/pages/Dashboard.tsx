import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import './Dashboard.css';

interface Job {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  applicationCount?: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect if not a company
  if (user?.userType !== 'company') {
    navigate('/browse');
    return null;
  }

  useEffect(() => {
    fetchJobs();

    // Show message from navigation state
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear state
      window.history.replaceState({}, document.title);
      setTimeout(() => setMessage(''), 3000);
    }
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      setDeleting(true);
      await api.delete(`/jobs/${jobId}`);
      setMessage('✓ Job deleted');
      setDeleteModal(null);
      fetchJobs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (jobId: string) => {
    try {
      await api.put(`/jobs/${jobId}/status`);
      setMessage('✓ Job status updated');
      fetchJobs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">Loading your jobs...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Job Postings</h1>
          <button
            className="btn-post-new"
            onClick={() => navigate('/jobs/new')}
          >
            Post New Job
          </button>
        </div>

        {message && <div className="success-message-dash">{message}</div>}

        {jobs.length === 0 ? (
          <div className="dashboard-empty">
            <h2>No jobs posted yet</h2>
            <p>Start building your team by posting your first job opening</p>
            <button
              className="btn-post-first"
              onClick={() => navigate('/jobs/new')}
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="jobs-table">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`job-row ${job.status === 'closed' ? 'closed' : ''}`}
              >
                <div className="job-info">
                  <h3 className="job-row-title">{job.title}</h3>
                  <div className="job-row-meta">
                    <span className={`status-badge ${job.status}`}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <span className="job-row-date">
                      Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                    <span className="applications-count">
                      {job.applicationCount || 0} {job.applicationCount === 1 ? 'application' : 'applications'}
                    </span>
                  </div>
                </div>

                <div className="job-actions">
                  <button
                    className="btn-view-applications"
                    onClick={() => navigate(`/jobs/${job.id}/applications`)}
                  >
                    View Applications
                    {(job.applicationCount || 0) > 0 && (
                      <span className="application-badge">{job.applicationCount}</span>
                    )}
                  </button>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/jobs/${job.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-toggle-status"
                    onClick={() => handleToggleStatus(job.id)}
                  >
                    {job.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => setDeleteModal(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete this job?</h2>
            <p>This cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-confirm-delete"
                onClick={() => handleDelete(deleteModal)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="btn-modal-cancel"
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
