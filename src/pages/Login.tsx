import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/browse');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Log In</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '3px solid black',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '3px solid black',
              fontSize: '1rem'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            background: '#FF69B4',
            color: 'white',
            border: '3px solid black'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '1rem',
            background: '#0066FF',
            color: 'white',
            border: '3px solid black',
            boxShadow: '4px 4px 0 black',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#f0f0f0',
        border: '3px solid black',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>
          Quick Login - Demo Accounts
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Password for all: <strong>password</strong>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => quickLogin('company@demo.com')}
            style={{
              padding: '0.75rem',
              background: '#FFD700',
              color: 'black',
              border: '3px solid black',
              boxShadow: '3px 3px 0 black',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            🏢 Company - company@demo.com
          </button>
          <button
            type="button"
            onClick={() => quickLogin('student@demo.com')}
            style={{
              padding: '0.75rem',
              background: '#00D4AA',
              color: 'white',
              border: '3px solid black',
              boxShadow: '3px 3px 0 black',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            🎓 Student/Candidate - student@demo.com
          </button>
        </div>
      </div>

      <p style={{ marginTop: '2rem', textAlign: 'center' }}>
        Don't have an account?{' '}
        <a href="/signup" style={{ color: '#0066FF', fontWeight: '600' }}>Sign Up</a>
      </p>
    </div>
  );
}
