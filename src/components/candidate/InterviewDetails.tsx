import { format, parse } from 'date-fns';
import type { Interview } from '../../types/interview';
import './InterviewDetails.css';

interface InterviewDetailsProps {
  interview: Interview;
}

export default function InterviewDetails({ interview }: InterviewDetailsProps) {
  // Combine date and time strings to create a full datetime
  const dateTimeString = `${interview.interviewDate} ${interview.interviewTime}`;

  // Parse the combined date/time
  // Assuming interviewDate is 'YYYY-MM-DD' and interviewTime is 'HH:mm:ss'
  const interviewDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date());

  // Format the date as "Monday, November 25, 2024" in local timezone
  const formattedDate = format(interviewDateTime, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(interviewDateTime, 'h:mm a');

  return (
    <div className="interview-details">
      <div className="interview-header">
        <span className="interview-icon">✓</span>
        <span className="interview-title">
          Interview scheduled: {formattedDate} at {formattedTime}
        </span>
      </div>

      {interview.location && (
        <div className="interview-location">
          <strong>Location:</strong> {interview.location}
        </div>
      )}

      {interview.notes && (
        <div className="interview-notes">
          <strong>Notes:</strong> {interview.notes}
        </div>
      )}
    </div>
  );
}
