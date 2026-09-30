/**
 * Helper to convert Firebase Auth error codes into friendly user messages.
 */
export const getFriendlyAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please choose at least 6 characters with a combination of letters and numbers.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password. Please verify your credentials and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support for assistance.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. Please wait a moment or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is currently disabled. Please contact the administrator.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completing.';
    default:
      return error.message || 'Authentication failed. Please check your details and try again.';
  }
};
