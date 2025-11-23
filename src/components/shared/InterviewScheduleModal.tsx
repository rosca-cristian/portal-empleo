import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import './InterviewScheduleModal.css';

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    interviewDate: string;
    interviewTime: string;
    location?: string;
    notes?: string;
  }) => Promise<void>;
  candidateName?: string;
}

export default function InterviewScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  candidateName
}: InterviewScheduleModalProps) {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set minimum date to tomorrow
  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form
      setInterviewDate('');
      setInterviewTime('');
      setLocation('');
      setNotes('');
      setErrors({});
      onClose();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!interviewDate) {
      newErrors.interviewDate = 'Interview date is required';
    } else {
      const selectedDate = new Date(interviewDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.interviewDate = 'Interview date must be in the future';
      }
    }

    if (!interviewTime) {
      newErrors.interviewTime = 'Please provide interview time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        interviewDate,
        interviewTime,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined
      });
      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to schedule interview';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="interview-modal-overlay" onClick={handleClose}>
      <div className="interview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="interview-modal-header">
          <div className="interview-modal-title-section">
            <h2 className="interview-modal-title">Schedule Interview</h2>
            {candidateName && (
              <p className="interview-modal-candidate">with {candidateName}</p>
            )}
          </div>
          <button
            className="interview-modal-close"
            onClick={handleClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="interview-modal-body">
          <div className="interview-form-fields">
            <div className="form-group">
              <label htmlFor="interviewDate" className="form-label">
                Interview Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="interviewDate"
                className={`form-input ${errors.interviewDate ? 'error' : ''}`}
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={minDate}
                disabled={isSubmitting}
                required
              />
              {errors.interviewDate && (
                <span className="error-message">{errors.interviewDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="interviewTime" className="form-label">
                Interview Time <span className="required">*</span>
              </label>
              <input
                type="time"
                id="interviewTime"
                className={`form-input ${errors.interviewTime ? 'error' : ''}`}
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.interviewTime && (
                <span className="error-message">{errors.interviewTime}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Office, Zoom link, Google Meet"
                disabled={isSubmitting}
                maxLength={500}
              />
              <span className="form-hint">Optional - e.g., "Office", "Zoom link", "Google Meet"</span>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Bring portfolio, Technical interview with team"
                disabled={isSubmitting}
                rows={4}
              />
              <span className="form-hint">Optional - e.g., "Bring portfolio", "Technical interview with team"</span>
            </div>

            {errors.submit && (
              <div className="error-message-box">
                {errors.submit}
              </div>
            )}
          </div>

          <div className="interview-modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-schedule-interview"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
