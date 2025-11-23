import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Interviews from './Interviews';
import api from '../services/api';

// Mock the auth store
jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(() => ({ user: { id: 'company-123', userType: 'company' } })),
}));

// Mock the API
jest.mock('../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock date-fns to have consistent dates
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'MMM dd, yyyy \'at\' HH:mm') {
      return 'Nov 25, 2025 at 14:00';
    }
    return 'Nov 25, 2025';
  }),
  parseISO: jest.fn((dateStr) => new Date(dateStr)),
  isPast: jest.fn((date) => {
    // Mock to determine if a date is in the past
    const now = new Date('2025-11-22T12:00:00');
    return date < now;
  }),
}));

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/interviews']}>
      <Routes>
        <Route path="/interviews" element={<Interviews />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Interviews Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    mockedApi.get.mockReturnValue(new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByText('Loading interviews...')).toBeInTheDocument();
  });

  it('should fetch and display interviews separated into upcoming and past', async () => {
    const mockInterviews = [
      {
        id: 'interview-1',
        interviewDate: '2025-11-25',
        interviewTime: '14:00:00',
        location: 'Office A',
        notes: 'Bring portfolio',
        applicationId: 'app-1',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
        },
        job: {
          id: 'job-1',
          title: 'Software Engineer',
        },
      },
      {
        id: 'interview-2',
        interviewDate: '2025-11-26',
        interviewTime: '10:00:00',
        location: 'Office B',
        applicationId: 'app-2',
        candidate: {
          id: 'candidate-2',
          name: 'Jane Smith',
        },
        job: {
          id: 'job-2',
          title: 'Frontend Developer',
        },
      },
      {
        id: 'interview-3',
        interviewDate: '2025-11-20',
        interviewTime: '09:00:00',
        location: 'Office C',
        notes: 'Past interview',
        applicationId: 'app-3',
        candidate: {
          id: 'candidate-3',
          name: 'Bob Johnson',
        },
        job: {
          id: 'job-3',
          title: 'Backend Developer',
        },
      },
    ];

    mockedApi.get.mockResolvedValue({ data: mockInterviews });

    // Mock isPast to return true for interview-3, false for others
    const { isPast } = require('date-fns');
    isPast.mockImplementation((date: Date) => {
      const dateStr = date.toISOString();
      return dateStr.includes('2025-11-20');
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('My Interviews')).toBeInTheDocument();
    });

    // Check that upcoming interviews section is displayed
    expect(screen.getByText(/Upcoming Interviews \(2\)/)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();

    // Check that past interviews section is displayed
    expect(screen.getByText(/Past Interviews \(1\)/)).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
  });

  it('should display empty state when no interviews exist', async () => {
    mockedApi.get.mockResolvedValue({ data: [] });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No interviews scheduled yet')).toBeInTheDocument();
    });

    expect(screen.getByText('Review applications to get started!')).toBeInTheDocument();
    expect(screen.getByText('Go to My Jobs')).toBeInTheDocument();
  });

  it('should display error message for 403 Forbidden', async () => {
    mockedApi.get.mockRejectedValue({
      response: { status: 403 },
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('You do not have permission to view interviews')).toBeInTheDocument();
  });

  it('should display generic error message for other errors', async () => {
    mockedApi.get.mockRejectedValue({
      response: { status: 500 },
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to load interviews')).toBeInTheDocument();
  });

  it('should display interview details including location and notes', async () => {
    const mockInterviews = [
      {
        id: 'interview-1',
        interviewDate: '2025-11-25',
        interviewTime: '14:00:00',
        location: 'Office Building, Room 301',
        notes: 'Please bring your portfolio and ID',
        applicationId: 'app-1',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
        },
        job: {
          id: 'job-1',
          title: 'Software Engineer',
        },
      },
    ];

    mockedApi.get.mockResolvedValue({ data: mockInterviews });

    const { isPast } = require('date-fns');
    isPast.mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('Office Building, Room 301')).toBeInTheDocument();
    expect(screen.getByText('Please bring your portfolio and ID')).toBeInTheDocument();
  });

  it('should not display location and notes if not provided', async () => {
    const mockInterviews = [
      {
        id: 'interview-1',
        interviewDate: '2025-11-25',
        interviewTime: '14:00:00',
        applicationId: 'app-1',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
        },
        job: {
          id: 'job-1',
          title: 'Software Engineer',
        },
      },
    ];

    mockedApi.get.mockResolvedValue({ data: mockInterviews });

    const { isPast } = require('date-fns');
    isPast.mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Location and Notes labels should not be present
    expect(screen.queryByText('Location:')).not.toBeInTheDocument();
    expect(screen.queryByText('Notes:')).not.toBeInTheDocument();
  });

  it('should display only upcoming interviews when no past interviews exist', async () => {
    const mockInterviews = [
      {
        id: 'interview-1',
        interviewDate: '2025-11-25',
        interviewTime: '14:00:00',
        location: 'Office A',
        applicationId: 'app-1',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
        },
        job: {
          id: 'job-1',
          title: 'Software Engineer',
        },
      },
    ];

    mockedApi.get.mockResolvedValue({ data: mockInterviews });

    const { isPast } = require('date-fns');
    isPast.mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Upcoming Interviews \(1\)/)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Past Interviews/)).not.toBeInTheDocument();
  });

  it('should display only past interviews when no upcoming interviews exist', async () => {
    const mockInterviews = [
      {
        id: 'interview-1',
        interviewDate: '2025-11-20',
        interviewTime: '09:00:00',
        location: 'Office A',
        applicationId: 'app-1',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
        },
        job: {
          id: 'job-1',
          title: 'Software Engineer',
        },
      },
    ];

    mockedApi.get.mockResolvedValue({ data: mockInterviews });

    const { isPast } = require('date-fns');
    isPast.mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Past Interviews \(1\)/)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Upcoming Interviews/)).not.toBeInTheDocument();
  });

  it('should call the correct API endpoint', async () => {
    mockedApi.get.mockResolvedValue({ data: [] });

    renderWithRouter();

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/interviews');
    });
  });

  it('should display status badges correctly', async () => {
    const mockInterviews = [
      {
        id: 'interview-1',
        interviewDate: '2025-11-25',
        interviewTime: '14:00:00',
        applicationId: 'app-1',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
        },
        job: {
          id: 'job-1',
          title: 'Software Engineer',
        },
      },
      {
        id: 'interview-2',
        interviewDate: '2025-11-20',
        interviewTime: '09:00:00',
        applicationId: 'app-2',
        candidate: {
          id: 'candidate-2',
          name: 'Jane Smith',
        },
        job: {
          id: 'job-2',
          title: 'Frontend Developer',
        },
      },
    ];

    mockedApi.get.mockResolvedValue({ data: mockInterviews });

    const { isPast } = require('date-fns');
    isPast.mockImplementation((date: Date) => {
      const dateStr = date.toISOString();
      return dateStr.includes('2025-11-20');
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const upcomingBadges = screen.getAllByText('Upcoming');
    expect(upcomingBadges).toHaveLength(1);

    const pastBadges = screen.getAllByText('Past');
    expect(pastBadges).toHaveLength(1);
  });
});
