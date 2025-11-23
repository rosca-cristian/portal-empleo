import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompanyApplicationCard from './CompanyApplicationCard';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CompanyApplicationCard', () => {
  const mockOnStatusUpdate = jest.fn();

  const baseApplication = {
    id: 'app-123',
    status: 'pending',
    appliedAt: '2025-11-20T10:00:00Z',
    candidate: {
      id: 'candidate-123',
      name: 'John Doe',
      description: 'Experienced software engineer with 5 years in web development',
    },
    cv: {
      id: 'cv-123',
      filename: 'john_doe_resume.pdf',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display candidate name', () => {
    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should display candidate description preview', () => {
    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText(/Experienced software engineer/)).toBeInTheDocument();
  });

  it('should display application date', () => {
    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText(/Applied/)).toBeInTheDocument();
  });

  it('should display pending status badge', () => {
    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should display all action buttons for pending applications', () => {
    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('View CV')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('should not display Accept/Reject buttons for accepted applications', () => {
    const acceptedApplication = {
      ...baseApplication,
      status: 'accepted',
    };

    renderWithRouter(
      <CompanyApplicationCard
        application={acceptedApplication}
        hasAcceptedCandidate={true}
        acceptedCandidateName="John Doe"
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('View CV')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.queryByText('Accept')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject')).not.toBeInTheDocument();
  });

  it('should not display Accept/Reject buttons for rejected applications', () => {
    const rejectedApplication = {
      ...baseApplication,
      status: 'rejected',
    };

    renderWithRouter(
      <CompanyApplicationCard
        application={rejectedApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.queryByText('Accept')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject')).not.toBeInTheDocument();
  });

  it('should show cover letter when toggle button is clicked', () => {
    const applicationWithCoverLetter = {
      ...baseApplication,
      coverLetter: 'I am very interested in this position...',
    };

    renderWithRouter(
      <CompanyApplicationCard
        application={applicationWithCoverLetter}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    // Initially cover letter should not be visible
    expect(screen.queryByText(/I am very interested/)).not.toBeInTheDocument();

    // Click toggle button
    const toggleButton = screen.getByText('+ View Cover Letter');
    fireEvent.click(toggleButton);

    // Cover letter should now be visible
    expect(screen.getByText(/I am very interested/)).toBeInTheDocument();
    expect(screen.getByText('− Hide Cover Letter')).toBeInTheDocument();
  });

  it('should not show cover letter toggle if no cover letter exists', () => {
    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.queryByText(/View Cover Letter/)).not.toBeInTheDocument();
  });

  it('should call onStatusUpdate with reject when Reject button is clicked and confirmed', () => {
    global.confirm = jest.fn(() => true);

    renderWithRouter(
      <CompanyApplicationCard
        application={baseApplication}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const rejectButton = screen.getByText('Reject');
    fireEvent.click(rejectButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to reject this application?');
    expect(mockOnStatusUpdate).toHaveBeenCalledWith('app-123', 'rejected');
  });

  it('should display truncated description for long candidate descriptions', () => {
    const longDescription = 'a'.repeat(200);
    const applicationWithLongDesc = {
      ...baseApplication,
      candidate: {
        ...baseApplication.candidate,
        description: longDescription,
      },
    };

    renderWithRouter(
      <CompanyApplicationCard
        application={applicationWithLongDesc}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const descriptionElement = screen.getByText(/aaa.../);
    expect(descriptionElement.textContent?.length).toBeLessThan(200);
  });

  it('should display default message if candidate has no description', () => {
    const applicationNoDesc = {
      ...baseApplication,
      candidate: {
        ...baseApplication.candidate,
        description: undefined,
      },
    };

    renderWithRouter(
      <CompanyApplicationCard
        application={applicationNoDesc}
        hasAcceptedCandidate={false}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('No profile description available')).toBeInTheDocument();
  });

  describe('One Candidate Per Posting MVP Business Rule', () => {
    it('should disable Accept button when position is already filled', () => {
      renderWithRouter(
        <CompanyApplicationCard
          application={baseApplication}
          hasAcceptedCandidate={true}
          acceptedCandidateName="Jane Smith"
          onStatusUpdate={mockOnStatusUpdate}
        />
      );

      const acceptButton = screen.getByText('Accept') as HTMLButtonElement;
      expect(acceptButton).toBeDisabled();
      expect(acceptButton).toHaveClass('btn-disabled');
    });

    it('should show position filled notice when another candidate is accepted', () => {
      renderWithRouter(
        <CompanyApplicationCard
          application={baseApplication}
          hasAcceptedCandidate={true}
          acceptedCandidateName="Jane Smith"
          onStatusUpdate={mockOnStatusUpdate}
        />
      );

      expect(screen.getByText(/Position filled - interview scheduled with Jane Smith/)).toBeInTheDocument();
      expect(screen.getByText(/MVP limitation: Only one candidate per job can be accepted/)).toBeInTheDocument();
    });

    it('should not show position filled notice when current application is accepted', () => {
      const acceptedApplication = {
        ...baseApplication,
        status: 'accepted',
      };

      renderWithRouter(
        <CompanyApplicationCard
          application={acceptedApplication}
          hasAcceptedCandidate={true}
          acceptedCandidateName="John Doe"
          onStatusUpdate={mockOnStatusUpdate}
        />
      );

      expect(screen.queryByText(/Position filled - interview scheduled with/)).not.toBeInTheDocument();
    });

    it('should enable Accept button when position is not filled', () => {
      renderWithRouter(
        <CompanyApplicationCard
          application={baseApplication}
          hasAcceptedCandidate={false}
          acceptedCandidateName={undefined}
          onStatusUpdate={mockOnStatusUpdate}
        />
      );

      const acceptButton = screen.getByText('Accept') as HTMLButtonElement;
      expect(acceptButton).not.toBeDisabled();
      expect(acceptButton).not.toHaveClass('btn-disabled');
    });

    it('should show tooltip on disabled Accept button explaining MVP limitation', () => {
      renderWithRouter(
        <CompanyApplicationCard
          application={baseApplication}
          hasAcceptedCandidate={true}
          acceptedCandidateName="Jane Smith"
          onStatusUpdate={mockOnStatusUpdate}
        />
      );

      const acceptButton = screen.getByText('Accept') as HTMLButtonElement;
      expect(acceptButton).toHaveAttribute(
        'title',
        'Position already filled. MVP limitation: Only one candidate per job.'
      );
    });

    it('should not show position filled notice when no candidate is accepted', () => {
      renderWithRouter(
        <CompanyApplicationCard
          application={baseApplication}
          hasAcceptedCandidate={false}
          acceptedCandidateName={undefined}
          onStatusUpdate={mockOnStatusUpdate}
        />
      );

      expect(screen.queryByText(/Position filled/)).not.toBeInTheDocument();
    });
  });
});
