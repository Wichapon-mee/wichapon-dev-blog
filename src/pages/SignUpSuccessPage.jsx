import React from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

function SignUpSuccessPage() {
  return (
    <div className="auth-page-layout">
      <NavBar />

      <main className="auth-page-main">
        <div className="auth-card auth-success-card">
          <div className="auth-success-icon" aria-hidden="true">
            ✓
          </div>
          <h1 className="auth-card-title">Registration success</h1>
          <p className="auth-success-description">
            Your account has been created successfully. You can now log in and start using the website.
          </p>
          <Link to="/login" className="auth-submit-btn auth-success-continue">
            Continue
          </Link>
        </div>
      </main>
    </div>
  );
}

export default SignUpSuccessPage;
