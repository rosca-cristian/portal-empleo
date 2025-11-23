import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Hide navigation on landing page
  if (location.pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/browse';
  };

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: 'black',
    fontWeight: isActive(path) ? 'bold' : '600',
    background: isActive(path) ? '#FFDD00' : 'transparent',
    border: '2px solid black',
  });

  const buttonStyle = (color: string) => ({
    padding: '0.75rem 1.5rem',
    background: color,
    color: 'white',
    border: '3px solid black',
    boxShadow: '3px 3px 0 black',
    fontWeight: 'bold',
    cursor: 'pointer',
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'white',
      borderBottom: '3px solid black'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/browse" style={linkStyle('/browse')}>Browse</Link>

        {isAuthenticated && user?.userType === 'candidate' && (
          <>
            <Link to="/applications" style={linkStyle('/applications')}>Applications</Link>
            <Link to="/profile" style={linkStyle('/profile')}>Profile</Link>
            <Link to="/cvs" style={linkStyle('/cvs')}>CVs</Link>
          </>
        )}

        {isAuthenticated && user?.userType === 'company' && (
          <>
            <Link to="/my-jobs" style={linkStyle('/my-jobs')}>My Jobs</Link>
            <Link to="/interviews" style={linkStyle('/interviews')}>Interviews</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {!isAuthenticated ? (
          <>
            <Link to="/signup">
              <button style={buttonStyle('#0066FF')}>Sign Up</button>
            </Link>
            <Link to="/login">
              <button style={buttonStyle('#FFDD00')}>Log In</button>
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} style={buttonStyle('#FFDD00')}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
