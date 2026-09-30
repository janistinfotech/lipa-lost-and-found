import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';
import Logo from '../components/Logo';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // If already authenticated, redirect to dashboard
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Get target redirection destination if user was redirected from a protected route
  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('[Login Error]:', err);
      setGeneralError(getFriendlyAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-center">
            <Logo size={46} showText={false} />
          </div>
          <h1 className="auth-title">Resident Login</h1>
          <p className="auth-subtitle">
            Sign in to access your Lipa Lost &amp; Found account and manage reports.
          </p>
        </div>

        {generalError && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={20} className="auth-error-icon" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="loginEmail"
                type="email"
                className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                placeholder="juan.delacruz@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  if (generalError) setGeneralError('');
                }}
                disabled={submitting}
                autoComplete="email"
                required
              />
            </div>
            {fieldErrors.email && (
              <span className="field-error-text">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  if (generalError) setGeneralError('');
                }}
                disabled={submitting}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="field-error-text">{fieldErrors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="auth-spinner" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-footer-link">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
