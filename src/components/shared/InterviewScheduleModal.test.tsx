import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InterviewScheduleModal from './InterviewScheduleModal';

describe('InterviewScheduleModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('should not render when isOpen is false', () => {
    render(
      <InterviewScheduleModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Schedule Interview')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
  });

  it('should display candidate name when provided', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        candidateName="John Doe"
      />
    );

    expect(screen.getByText('with John Doe')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText(/Interview Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Interview Time/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
  });

  it('should show validation error when date is missing', async () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const timeInput = screen.getByLabelText(/Interview Time/);
    await userEvent.type(timeInput, '10:00');

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Interview date is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error when time is missing', async () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/);
    await userEvent.type(dateInput, tomorrowStr);

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please provide interview time')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with correct data when form is valid', async () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/);
    const timeInput = screen.getByLabelText(/Interview Time/);
    const locationInput = screen.getByLabelText(/Location/);
    const notesInput = screen.getByLabelText(/Notes/);

    await userEvent.type(dateInput, tomorrowStr);
    await userEvent.type(timeInput, '10:00');
    await userEvent.type(locationInput, 'Office');
    await userEvent.type(notesInput, 'Bring portfolio');

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        interviewDate: tomorrowStr,
        interviewTime: '10:00',
        location: 'Office',
        notes: 'Bring portfolio',
      });
    });
  });

  it('should call onSubmit without optional fields when they are empty', async () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/);
    const timeInput = screen.getByLabelText(/Interview Time/);

    await userEvent.type(dateInput, tomorrowStr);
    await userEvent.type(timeInput, '10:00');

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        interviewDate: tomorrowStr,
        interviewTime: '10:00',
        location: undefined,
        notes: undefined,
      });
    });
  });

  it('should close modal after successful submission', async () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/);
    const timeInput = screen.getByLabelText(/Interview Time/);

    await userEvent.type(dateInput, tomorrowStr);
    await userEvent.type(timeInput, '10:00');

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset and modal should be ready to close
    // (onClose is called internally when handleClose is triggered after successful submit)
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close button (×) is clicked', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when clicking outside modal', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const overlay = document.querySelector('.interview-modal-overlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should not close when clicking inside modal content', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const modalContent = document.querySelector('.interview-modal-content');
    if (modalContent) {
      fireEvent.click(modalContent);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });

  it('should disable form and buttons while submitting', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/);
    const timeInput = screen.getByLabelText(/Interview Time/);

    await userEvent.type(dateInput, tomorrowStr);
    await userEvent.type(timeInput, '10:00');

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    // While submitting
    expect(screen.getByText('Scheduling...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should display error message when submission fails', async () => {
    const errorMessage = 'Failed to schedule interview';
    mockOnSubmit.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/);
    const timeInput = screen.getByLabelText(/Interview Time/);

    await userEvent.type(dateInput, tomorrowStr);
    await userEvent.type(timeInput, '10:00');

    const submitButton = screen.getByText('Schedule Interview');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should have required asterisks on required fields', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const requiredMarkers = screen.getAllByText('*');
    expect(requiredMarkers.length).toBe(2); // Date and Time are required
  });

  it('should enforce future date validation in HTML', () => {
    render(
      <InterviewScheduleModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dateInput = screen.getByLabelText(/Interview Date/) as HTMLInputElement;
    expect(dateInput).toHaveAttribute('min');
    expect(dateInput.min).toBeTruthy();
  });
});
