import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';
import Logo from '../components/Logo';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, loading: authLoading } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // If already logged in, redirect to dashboard
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error upon typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      await signup(
        formData.fullName.trim(),
        formData.email.trim(),
        formData.password
      );
      // Successful registration and Firestore profile creation
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[SignUp Error]:', err);
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join the Lipa City Lost &amp; Found community to report items and connect with finders.
          </p>
        </div>

        {generalError && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={20} className="auth-error-icon" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`form-input ${fieldErrors.fullName ? 'input-error' : ''}`}
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={handleChange}
                disabled={submitting}
                autoComplete="name"
                required
              />
            </div>
            {fieldErrors.fullName && (
              <span className="field-error-text">{fieldErrors.fullName}</span>
            )}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                placeholder="juan.delacruz@example.com"
                value={formData.email}
                onChange={handleChange}
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
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={submitting}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={submitting}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className="field-error-text">{fieldErrors.confirmPassword}</span>
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-footer-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
