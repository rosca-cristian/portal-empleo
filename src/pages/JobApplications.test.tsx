import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import JobApplications from './JobApplications';
import api from '../services/api';

// Mock the auth store
jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(() => ({ user: { id: 'company-123', userType: 'company' } })),
}));

// Mock the API
jest.mock('../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock the CompanyApplicationCard component
jest.mock('../components/candidate/CompanyApplicationCard', () => ({
  __esModule: true,
  default: ({ application }: any) => (
    <div data-testid={`application-card-${application.id}`}>
      {application.candidate.name}
    </div>
  ),
}));

const renderWithRouter = (jobId: string = 'job-123') => {
  return render(
    <MemoryRouter initialEntries={[`/jobs/${jobId}/applications`]}>
      <Routes>
        <Route path="/jobs/:jobId/applications" element={<JobApplications />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('JobApplications Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    mockedApi.get.mockReturnValue(new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByText('Loading applications...')).toBeInTheDocument();
  });

  it('should fetch and display job details and applications', async () => {
    const mockJob = {
      id: 'job-123',
      title: 'Software Engineer',
    };

    const mockApplications = [
      {
        id: 'app-1',
        status: 'pending',
        appliedAt: '2025-11-20T10:00:00Z',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
          description: 'Experienced developer',
        },
        cv: {
          id: 'cv-1',
          filename: 'resume.pdf',
        },
      },
      {
        id: 'app-2',
        status: 'pending',
        appliedAt: '2025-11-19T10:00:00Z',
        candidate: {
          id: 'candidate-2',
          name: 'Jane Smith',
          description: 'Senior engineer',
        },
        cv: {
          id: 'cv-2',
          filename: 'cv.pdf',
        },
      },
    ];

    mockedApi.get.mockImplementation((url) => {
      if (url === '/jobs/job-123') {
        return Promise.resolve({ data: mockJob });
      }
      if (url === '/applications/for-job/job-123') {
        return Promise.resolve({ data: mockApplications });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Applications for: Software Engineer')).toBeInTheDocument();
    });

    expect(screen.getByText('2 applications')).toBeInTheDocument();
    expect(screen.getByTestId('application-card-app-1')).toBeInTheDocument();
    expect(screen.getByTestId('application-card-app-2')).toBeInTheDocument();
  });

  it('should display empty state when no applications exist', async () => {
    const mockJob = {
      id: 'job-123',
      title: 'Software Engineer',
    };

    mockedApi.get.mockImplementation((url) => {
      if (url === '/jobs/job-123') {
        return Promise.resolve({ data: mockJob });
      }
      if (url === '/applications/for-job/job-123') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No applications yet')).toBeInTheDocument();
    });

    expect(screen.getByText('Candidates will see your posting soon!')).toBeInTheDocument();
  });

  it('should display error message for 403 Forbidden', async () => {
    mockedApi.get.mockRejectedValue({
      response: { status: 403 },
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('You do not have permission to view these applications')).toBeInTheDocument();
  });

  it('should display error message for 404 Not Found', async () => {
    mockedApi.get.mockRejectedValue({
      response: { status: 404 },
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Job not found')).toBeInTheDocument();
  });

  it('should display generic error message for other errors', async () => {
    mockedApi.get.mockRejectedValue({
      response: { status: 500 },
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to load applications')).toBeInTheDocument();
  });

  it('should display singular application count for one application', async () => {
    const mockJob = {
      id: 'job-123',
      title: 'Software Engineer',
    };

    const mockApplications = [
      {
        id: 'app-1',
        status: 'pending',
        appliedAt: '2025-11-20T10:00:00Z',
        candidate: {
          id: 'candidate-1',
          name: 'John Doe',
          description: 'Experienced developer',
        },
        cv: {
          id: 'cv-1',
          filename: 'resume.pdf',
        },
      },
    ];

    mockedApi.get.mockImplementation((url) => {
      if (url === '/jobs/job-123') {
        return Promise.resolve({ data: mockJob });
      }
      if (url === '/applications/for-job/job-123') {
        return Promise.resolve({ data: mockApplications });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('1 application')).toBeInTheDocument();
    });
  });
});
