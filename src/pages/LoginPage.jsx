import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;
  const redirectTo = location.state?.from || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email, password });
      const destination = result.user?.role === 'admin'
        ? '/admin'
        : redirectTo === '/login' || redirectTo.startsWith('/signup')
          ? '/'
          : redirectTo;
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-layout">
      <NavBar />

      <main className="auth-page-main">
        <div className="auth-card">
          <h1 className="auth-card-title">Log in</h1>

          {successMessage && (
            <p className="auth-success-message">{successMessage}</p>
          )}

          {error && <p className="auth-error-message">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don&apos;t have any account?{' '}
            <Link to="/signup" className="auth-footer-link">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
