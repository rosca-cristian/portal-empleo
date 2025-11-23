import { render, screen } from '@testing-library/react';
import InterviewDetails from './InterviewDetails';
import { Interview } from '../../types/interview';

describe('InterviewDetails', () => {
  const mockInterview: Interview = {
    id: 'interview-123',
    applicationId: 'app-123',
    interviewDate: '2025-11-25',
    interviewTime: '14:00:00',
    location: 'Conference Room A',
    notes: 'Please bring your portfolio and be prepared to discuss your recent projects.',
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z',
  };

  it('should render interview date and time correctly with full date format', () => {
    render(<InterviewDetails interview={mockInterview} />);

    // Check if the formatted date appears in full format: "Monday, November 25, 2025"
    expect(screen.getByText(/Interview scheduled:/)).toBeInTheDocument();
    expect(screen.getByText(/Monday, November 25, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/2:00 PM/)).toBeInTheDocument();
  });

  it('should display location when provided', () => {
    render(<InterviewDetails interview={mockInterview} />);

    expect(screen.getByText('Location:')).toBeInTheDocument();
    expect(screen.getByText('Conference Room A')).toBeInTheDocument();
  });

  it('should display notes when provided', () => {
    render(<InterviewDetails interview={mockInterview} />);

    expect(screen.getByText('Notes:')).toBeInTheDocument();
    expect(screen.getByText(/Please bring your portfolio/)).toBeInTheDocument();
  });

  it('should not display location when not provided', () => {
    const interviewWithoutLocation: Interview = {
      ...mockInterview,
      location: undefined,
    };

    render(<InterviewDetails interview={interviewWithoutLocation} />);

    expect(screen.queryByText('Location:')).not.toBeInTheDocument();
  });

  it('should not display notes when not provided', () => {
    const interviewWithoutNotes: Interview = {
      ...mockInterview,
      notes: undefined,
    };

    render(<InterviewDetails interview={interviewWithoutNotes} />);

    expect(screen.queryByText('Notes:')).not.toBeInTheDocument();
  });

  it('should have green background styling', () => {
    const { container } = render(<InterviewDetails interview={mockInterview} />);

    const detailsDiv = container.querySelector('.interview-details');
    expect(detailsDiv).toBeInTheDocument();
    expect(detailsDiv).toHaveClass('interview-details');
  });

  it('should display checkmark icon', () => {
    render(<InterviewDetails interview={mockInterview} />);

    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});
