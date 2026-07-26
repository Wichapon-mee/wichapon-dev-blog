import React from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

function LoginPage() {
  return (
    <div className="auth-page-layout">
      <NavBar />

      <main className="auth-page-main">
        <div className="auth-card">
          <h1 className="auth-card-title">Log in</h1>

          <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Log in
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
