import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CandidateProfile from './CandidateProfile';
import api from '../services/api';

// Mock the api service
jest.mock('../services/api');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (candidateId: string = 'candidate-123') => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/profile/:id" element={<CandidateProfile />} />
      </Routes>
    </BrowserRouter>,
    {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <Routes>
            <Route path="/profile/:id" element={children} />
          </Routes>
        </BrowserRouter>
      )
    }
  );
};

describe('CandidateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up VITE_API_URL
    import.meta.env.VITE_API_URL = 'http://localhost:3000/api/v1';
  });

  const mockProfileWithCV = {
    id: 'candidate-123',
    fullName: 'John Doe',
    email: 'john@example.com',
    profileDescription: 'Experienced software developer with 5 years in React and Node.js',
    activeCV: {
      id: 'cv-123',
      fileName: 'john_doe_resume.pdf',
      fileSize: 1024000,
      uploadedAt: '2025-11-15T10:00:00Z',
    },
  };

  const mockProfileWithoutCV = {
    id: 'candidate-456',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    profileDescription: 'Marketing professional',
    activeCV: null,
  };

  it('should display loading state initially', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/:id" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading candidate profile...')).toBeInTheDocument();
  });

  it('should display candidate profile with active CV', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Candidate Profile')).toBeInTheDocument();
    });

    expect(screen.getByText('Read-Only View')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Experienced software developer/)).toBeInTheDocument();
    expect(screen.getByText('john_doe_resume.pdf')).toBeInTheDocument();
  });

  it('should display candidate profile without active CV', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithoutCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-456" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Candidate Profile')).toBeInTheDocument();
    });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('This candidate does not have an active CV')).toBeInTheDocument();
  });

  it('should display default text when no profile description', async () => {
    const profileWithoutDescription = {
      ...mockProfileWithCV,
      profileDescription: null,
    };

    (api.get as jest.Mock).mockResolvedValue({ data: profileWithoutDescription });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No profile description available')).toBeInTheDocument();
    });
  });

  it('should display default text when no full name', async () => {
    const profileWithoutName = {
      ...mockProfileWithCV,
      fullName: null,
    };

    (api.get as jest.Mock).mockResolvedValue({ data: profileWithoutName });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Not provided')).toBeInTheDocument();
    });
  });

  it('should display 403 error when company has no permission', async () => {
    (api.get as jest.Mock).mockRejectedValue({
      response: {
        status: 403,
        data: { message: 'You do not have permission to view this candidate profile' },
      },
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
    });
  });

  it('should display 404 error when candidate not found', async () => {
    (api.get as jest.Mock).mockRejectedValue({
      response: {
        status: 404,
        data: { message: 'Candidate not found' },
      },
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/non-existent" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Candidate not found')).toBeInTheDocument();
    });
  });

  it('should display generic error for other errors', async () => {
    (api.get as jest.Mock).mockRejectedValue({
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Internal server error')).toBeInTheDocument();
    });
  });

  it('should display Back to Applications button', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('← Back to Applications')).toBeInTheDocument();
    });
  });

  it('should display View CV and Download CV buttons when CV exists', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('View CV')).toBeInTheDocument();
      expect(screen.getByText('Download CV')).toBeInTheDocument();
    });
  });

  it('should not display CV buttons when CV does not exist', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithoutCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-456" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('View CV')).not.toBeInTheDocument();
      expect(screen.queryByText('Download CV')).not.toBeInTheDocument();
    });
  });

  it('should fetch candidate profile on mount', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/candidates/candidate-123/profile');
    });
  });

  it('should display read-only badge to indicate company view', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Read-Only View')).toBeInTheDocument();
    });
  });

  it('should display candidate information section', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Candidate Information')).toBeInTheDocument();
      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
    });
  });

  it('should display profile description section', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Profile Description')).toBeInTheDocument();
    });
  });

  it('should display current active CV section', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfileWithCV });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile/candidate-123" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Current Active CV')).toBeInTheDocument();
    });
  });
});
