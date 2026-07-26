import React from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

function SignUpPage() {
  return (
    <div className="auth-page-layout">
      <NavBar />

      <main className="auth-page-main">
        <div className="auth-card">
          <h1 className="auth-card-title">Sign up</h1>

          <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
            <div className="auth-field">
              <label htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Full name"
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                type="text"
                placeholder="Username"
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign up
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignUpPage;
