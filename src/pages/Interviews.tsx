import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isPast } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import './Interviews.css';

interface Interview {
  id: string;
  interviewDate: string;
  interviewTime: string;
  location?: string;
  notes?: string;
  applicationId: string;
  candidate: {
    id: string;
    name: string;
  };
  job: {
    id: string;
    title: string;
  };
}

export default function Interviews() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not a company
  if (user?.userType !== 'company') {
    navigate('/browse');
    return null;
  }

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/interviews');
      setInterviews(response.data);
    } catch (error: any) {
      console.error('Error fetching interviews:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to view interviews');
      } else {
        setError('Failed to load interviews');
      }
    } finally {
      setLoading(false);
    }
  };

  // Separate upcoming and past interviews
  const upcomingInterviews = interviews.filter(interview => {
    const interviewDateTime = parseISO(`${interview.interviewDate}T${interview.interviewTime}`);
    return !isPast(interviewDateTime);
  });

  const pastInterviews = interviews.filter(interview => {
    const interviewDateTime = parseISO(`${interview.interviewDate}T${interview.interviewTime}`);
    return isPast(interviewDateTime);
  });

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = parseISO(`${date}T${time}`);
      return format(dateTime, 'MMM dd, yyyy \'at\' HH:mm');
    } catch {
      return `${date} at ${time}`;
    }
  };

  if (loading) {
    return (
      <div className="interviews-container">
        <div className="interviews-loading">Loading interviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interviews-container">
        <div className="interviews-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="btn-back-to-dashboard"
            onClick={() => navigate('/my-jobs')}
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interviews-container">
      <div className="interviews-content">
        <div className="interviews-header">
          <h1 className="interviews-title">My Interviews</h1>
          <button
            className="btn-back-to-jobs"
            onClick={() => navigate('/my-jobs')}
          >
            ← Back to My Jobs
          </button>
        </div>

        {interviews.length === 0 ? (
          <div className="interviews-empty">
            <h2>No interviews scheduled yet</h2>
            <p>Review applications to get started!</p>
            <button
              className="btn-go-to-jobs"
              onClick={() => navigate('/my-jobs')}
            >
              Go to My Jobs
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming Interviews Section */}
            {upcomingInterviews.length > 0 && (
              <div className="interviews-section">
                <h2 className="section-title">Upcoming Interviews ({upcomingInterviews.length})</h2>
                <div className="interviews-list">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="interview-card">
                      <div className="interview-header">
                        <h3 className="candidate-name">{interview.candidate.name}</h3>
                        <span className="status-badge upcoming">Upcoming</span>
                      </div>

                      <div className="interview-details">
                        <div className="detail-row">
                          <span className="detail-label">Job:</span>
                          <span className="detail-value">{interview.job.title}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Date & Time:</span>
                          <span className="detail-value">
                            {formatDateTime(interview.interviewDate, interview.interviewTime)}
                          </span>
                        </div>
                        {interview.location && (
                          <div className="detail-row">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{interview.location}</span>
                          </div>
                        )}
                        {interview.notes && (
                          <div className="detail-row">
                            <span className="detail-label">Notes:</span>
                            <span className="detail-value">{interview.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="interview-actions">
                        <button
                          className="btn-view-candidate"
                          onClick={() => navigate(`/profile/${interview.candidate.id}`)}
                        >
                          View Candidate Profile
                        </button>
                        <button
                          className="btn-view-job"
                          onClick={() => navigate(`/jobs/${interview.job.id}/applications`)}
                        >
                          View Application
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Interviews Section */}
            {pastInterviews.length > 0 && (
              <div className="interviews-section">
                <h2 className="section-title">Past Interviews ({pastInterviews.length})</h2>
                <div className="interviews-list">
                  {pastInterviews.map((interview) => (
                    <div key={interview.id} className="interview-card past">
                      <div className="interview-header">
                        <h3 className="candidate-name">{interview.candidate.name}</h3>
                        <span className="status-badge past">Past</span>
                      </div>

                      <div className="interview-details">
                        <div className="detail-row">
                          <span className="detail-label">Job:</span>
                          <span className="detail-value">{interview.job.title}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Date & Time:</span>
                          <span className="detail-value">
                            {formatDateTime(interview.interviewDate, interview.interviewTime)}
                          </span>
                        </div>
                        {interview.location && (
                          <div className="detail-row">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{interview.location}</span>
                          </div>
                        )}
                        {interview.notes && (
                          <div className="detail-row">
                            <span className="detail-label">Notes:</span>
                            <span className="detail-value">{interview.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="interview-actions">
                        <button
                          className="btn-view-candidate"
                          onClick={() => navigate(`/profile/${interview.candidate.id}`)}
                        >
                          View Candidate Profile
                        </button>
                        <button
                          className="btn-view-job"
                          onClick={() => navigate(`/jobs/${interview.job.id}/applications`)}
                        >
                          View Application
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
