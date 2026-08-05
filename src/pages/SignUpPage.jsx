import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { registerUser } from '@/api/authApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapServerError(message) {
  const lower = message.toLowerCase();

  if (lower.includes('username')) {
    return { username: message };
  }

  if (lower.includes('email')) {
    return { email: message };
  }

  return { form: message };
}

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!form.username.trim()) {
    errors.username = 'Username is required';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '', form: undefined }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await registerUser(form);
      navigate('/signup/success', { replace: true });
    } catch (err) {
      const mapped = mapServerError(err.message);
      if (mapped.form) {
        setFormError(mapped.form);
      } else {
        setFieldErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-layout">
      <NavBar />

      <main className="auth-page-main">
        <div className="auth-card">
          <h1 className="auth-card-title">Sign up</h1>

          {formError && <p className="auth-error-message">{formError}</p>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Full name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange('name')}
              />
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                type="text"
                placeholder="Username"
                autoComplete="username"
                value={form.username}
                onChange={handleChange('username')}
              />
              {fieldErrors.username && (
                <p className="field-error">{fieldErrors.username}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
              />
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange('password')}
              />
              {fieldErrors.password && (
                <p className="field-error">{fieldErrors.password}</p>
              )}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
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
