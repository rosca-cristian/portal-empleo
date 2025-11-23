import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import './PostJob.css'; // Reuse PostJob styles

const JOB_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'full_time',
    salaryMin: '',
    salaryMax: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not a company
  if (user?.userType !== 'company') {
    navigate('/browse');
    return null;
  }

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      const job = response.data;

      // Check ownership
      if (job.companyId !== user?.id) {
        navigate('/dashboard');
        return;
      }

      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        jobType: job.jobType,
        salaryMin: job.salaryMin ? job.salaryMin.toString() : '',
        salaryMax: job.salaryMax ? job.salaryMax.toString() : ''
      });
    } catch (err: any) {
      if (err.response?.status === 404) {
        navigate('/dashboard');
      } else {
        setErrors({ fetch: 'Failed to load job details' });
      }
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 200) {
      newErrors.location = 'Location must be 200 characters or less';
    }

    if (formData.salaryMin && formData.salaryMax) {
      const min = parseInt(formData.salaryMin);
      const max = parseInt(formData.salaryMax);
      if (min > max) {
        newErrors.salaryMin = 'Minimum salary cannot be greater than maximum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined
      };

      await api.put(`/jobs/${id}`, payload);

      navigate('/dashboard', { state: { message: '✓ Job updated successfully' } });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setErrors({ submit: 'You can only edit your own jobs' });
      } else {
        setErrors({ submit: err.response?.data?.message || 'Failed to update job' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (loading) {
    return (
      <div className="post-job-container">
        <div className="post-job-content">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-job-container">
      <div className="post-job-content">
        <h1 className="post-job-title">Edit Job</h1>

        <form className="post-job-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Job Title *
            </label>
            <input
              id="title"
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              maxLength={200}
            />
            <div className="char-count">{formData.title.length} / 200</div>
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Job Description *
            </label>
            <textarea
              id="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={10}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location *
            </label>
            <input
              id="location"
              type="text"
              className={`form-input ${errors.location ? 'error' : ''}`}
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Madrid, Spain"
              maxLength={200}
            />
            <div className="char-count">{formData.location.length} / 200</div>
            {errors.location && <div className="error-message">{errors.location}</div>}
          </div>

          {/* Job Type */}
          <div className="form-group">
            <label htmlFor="jobType" className="form-label">
              Job Type *
            </label>
            <select
              id="jobType"
              className="form-select"
              value={formData.jobType}
              onChange={(e) => handleChange('jobType', e.target.value)}
            >
              {JOB_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin" className="form-label">
                Minimum Salary (€)
              </label>
              <input
                id="salaryMin"
                type="number"
                className={`form-input ${errors.salaryMin ? 'error' : ''}`}
                value={formData.salaryMin}
                onChange={(e) => handleChange('salaryMin', e.target.value)}
                placeholder="e.g., 40000"
                min="0"
              />
              {errors.salaryMin && <div className="error-message">{errors.salaryMin}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax" className="form-label">
                Maximum Salary (€)
              </label>
              <input
                id="salaryMax"
                type="number"
                className={`form-input ${errors.salaryMax ? 'error' : ''}`}
                value={formData.salaryMax}
                onChange={(e) => handleChange('salaryMax', e.target.value)}
                placeholder="e.g., 60000"
                min="0"
              />
            </div>
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Job'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
