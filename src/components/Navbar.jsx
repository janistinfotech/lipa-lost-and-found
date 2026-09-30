import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard, 
  FolderClock,
  LogOut,
  User,
  Home as HomeIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      closeMobileMenu();
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('[Navbar] Logout error:', error);
    }
  };

  const displayName = currentUser?.displayName || userProfile?.fullName || currentUser?.email?.split('@')[0] || 'Resident';

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Custom Logo */}
        <Link to="/" className="navbar-brand-link" onClick={closeMobileMenu}>
          <Logo size={40} showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Home</span>
          </NavLink>
          
          <NavLink 
            to="/items" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Compass size={17} />
            <span>Browse Items</span>
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/post-item" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <PlusCircle size={17} />
                <span>Post Item</span>
              </NavLink>
              
              <NavLink 
                to="/my-posts" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FolderClock size={17} />
                <span>My Posts</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="navbar-actions desktop-nav">
          {isAuthenticated ? (
            <div className="nav-user-cluster">
              <Link to="/dashboard" className="nav-user-pill" title="Go to Dashboard">
                <div className="nav-user-avatar">
                  <User size={15} />
                </div>
                <span className="nav-user-name">{displayName}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm btn-logout"
                title="Sign out of your account"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="nav-guest-actions">
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-toggle-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            {isAuthenticated && (
              <div className="mobile-user-greeting">
                <div className="nav-user-avatar">
                  <User size={16} />
                </div>
                <div className="mobile-user-info">
                  <span className="mobile-user-label">Signed in as</span>
                  <span className="mobile-user-name">{displayName}</span>
                </div>
              </div>
            )}

            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <HomeIcon size={18} />
              <span>Home</span>
            </NavLink>

            <NavLink 
              to="/items" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Compass size={18} />
              <span>Browse Items</span>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink 
                  to="/post-item" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <PlusCircle size={18} />
                  <span>Post Item</span>
                </NavLink>

                <NavLink 
                  to="/my-posts" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <FolderClock size={18} />
                  <span>My Posts</span>
                </NavLink>

                <div className="mobile-auth-divider"></div>

                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline mobile-logout-btn"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="mobile-auth-divider"></div>

                <div className="mobile-auth-actions">
                  <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu}>
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="btn btn-primary" onClick={closeMobileMenu}>
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
