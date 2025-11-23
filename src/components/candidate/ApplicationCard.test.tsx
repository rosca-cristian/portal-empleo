import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApplicationCard from './ApplicationCard';
import { Application } from '../../services/applicationService';

// Mock the InterviewDetails component
jest.mock('./InterviewDetails', () => ({
  __esModule: true,
  default: ({ interview }: any) => <div data-testid="interview-details">Interview: {interview.id}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ApplicationCard', () => {
  const baseApplication: Application = {
    id: 'app-123',
    jobId: 'job-123',
    candidateId: 'candidate-123',
    cvId: 'cv-123',
    status: 'pending',
    appliedAt: '2025-11-20T10:00:00Z',
    job: {
      id: 'job-123',
      title: 'Software Engineer',
      company: {
        companyName: 'Test Company',
      },
    },
  };

  it('should display pending message for pending applications', () => {
    renderWithRouter(<ApplicationCard application={baseApplication} />);

    expect(screen.getByText('Waiting for company response...')).toBeInTheDocument();
  });

  it('should not display interview details for pending applications', () => {
    renderWithRouter(<ApplicationCard application={baseApplication} />);

    expect(screen.queryByTestId('interview-details')).not.toBeInTheDocument();
  });

  it('should display interview details for accepted applications with interview', () => {
    const acceptedApplication: Application = {
      ...baseApplication,
      status: 'accepted',
      interview: {
        id: 'interview-123',
        applicationId: 'app-123',
        interviewDate: '2025-11-25',
        interviewTime: '14:00:00',
        location: 'Office',
        notes: 'Technical interview',
        createdAt: '2025-11-20T10:00:00Z',
        updatedAt: '2025-11-20T10:00:00Z',
      },
    };

    renderWithRouter(<ApplicationCard application={acceptedApplication} />);

    expect(screen.getByTestId('interview-details')).toBeInTheDocument();
    expect(screen.queryByText('Waiting for company response...')).not.toBeInTheDocument();
  });

  it('should not display interview details for accepted applications without interview', () => {
    const acceptedApplicationNoInterview: Application = {
      ...baseApplication,
      status: 'accepted',
    };

    renderWithRouter(<ApplicationCard application={acceptedApplicationNoInterview} />);

    expect(screen.queryByTestId('interview-details')).not.toBeInTheDocument();
    expect(screen.queryByText('Waiting for company response...')).not.toBeInTheDocument();
  });

  it('should not display pending message for rejected applications', () => {
    const rejectedApplication: Application = {
      ...baseApplication,
      status: 'rejected',
    };

    renderWithRouter(<ApplicationCard application={rejectedApplication} />);

    expect(screen.queryByText('Waiting for company response...')).not.toBeInTheDocument();
  });

  it('should display job title and company name', () => {
    renderWithRouter(<ApplicationCard application={baseApplication} />);

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('should display application date', () => {
    renderWithRouter(<ApplicationCard application={baseApplication} />);

    expect(screen.getByText(/Applied/)).toBeInTheDocument();
  });
});
