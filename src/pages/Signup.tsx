import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'candidate' | 'company'>('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/signup', { email, password, userType });
      alert('✓ Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Sign Up</h1>

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
            minLength={8}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '3px solid black',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>I am a:</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                value="candidate"
                checked={userType === 'candidate'}
                onChange={() => setUserType('candidate')}
              />
              Candidate
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                value="company"
                checked={userType === 'company'}
                onChange={() => setUserType('company')}
              />
              Company
            </label>
          </div>
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '2rem', textAlign: 'center' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: '#0066FF', fontWeight: '600' }}>Log In</a>
      </p>
    </div>
  );
}
