import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import './Profile.css';

interface UserProfile {
  id: string;
  email: string;
  userType: string;
  fullName?: string;
  profileDescription?: string;
  companyName?: string;
  phoneNumber?: string;
}

interface ActiveCV {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeCV, setActiveCV] = useState<ActiveCV | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileDescription, setProfileDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const MAX_CHARS = 500;

  useEffect(() => {
    fetchProfile();
    fetchActiveCV();
  }, []);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await api.get(`/users/${user.id}`);
      setProfile(response.data);
      setProfileDescription(response.data.profileDescription || '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCV = async () => {
    try {
      const response = await api.get('/cvs/active');
      setActiveCV(response.data);
    } catch (err: any) {
      // No active CV, that's okay
      setActiveCV(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileDescription(profile?.profileDescription || '');
    setError('');
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      setError('');

      const response = await api.put(`/users/${user.id}`, {
        profileDescription: profileDescription.trim()
      });

      setProfile(response.data);
      setProfileDescription(response.data.profileDescription || '');
      setIsEditing(false);
      setMessage('✓ Profile saved');

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  const isCandidate = profile?.userType === 'candidate';

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1 className="profile-title">
          {isCandidate ? 'My Profile' : 'Company Profile'}
        </h1>

        {/* Section 1: Profile Description */}
        <section className="profile-section">
          <h2 className="section-header">
            {isCandidate ? 'Profile Description' : 'Company Information'}
          </h2>

          {!isEditing ? (
            <div className="profile-view">
              <p className="profile-description">
                {profile?.profileDescription ||
                  (isCandidate
                    ? 'Tell employers about your skills and experience...'
                    : 'Tell candidates about your company...')}
              </p>
              <button
                className="btn-edit"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="profile-edit">
              <textarea
                className="profile-textarea"
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                placeholder={isCandidate
                  ? 'Tell employers about your skills and experience...'
                  : 'Tell candidates about your company...'}
                maxLength={MAX_CHARS}
                rows={8}
                autoFocus
              />
              <div className="char-count">
                {profileDescription.length} / {MAX_CHARS} characters
              </div>
              <div className="edit-actions">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </section>

        {/* Section 2: Current Active CV (Candidates only) */}
        {isCandidate && (
          <section className="profile-section">
            <h2 className="section-header">Your Active CV</h2>
            {activeCV ? (
              <div className="active-cv-card">
                <h3 className="cv-filename">{activeCV.fileName}</h3>
                <div className="cv-meta">
                  <span>Uploaded {formatDistanceToNow(new Date(activeCV.uploadedAt), { addSuffix: true })}</span>
                  <span>{formatFileSize(activeCV.fileSize)}</span>
                </div>
                <div className="cv-actions-profile">
                  <button
                    className="btn-change-cv"
                    onClick={() => navigate('/cvs')}
                  >
                    Change Active CV
                  </button>
                </div>
              </div>
            ) : (
              <div className="cv-empty-state">
                <p>Upload your first CV to get started</p>
                <button className="btn-upload-cv" onClick={() => navigate('/cvs')}>
                  Upload CV
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
