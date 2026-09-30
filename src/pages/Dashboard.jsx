import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Compass, 
  FolderClock,
  Sparkles,
  Search,
  Gift,
  ArrowRight,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getItemsByUser } from '../services/itemService';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();

  const displayName = currentUser?.displayName || userProfile?.fullName || 'Resident';
  const email = currentUser?.email || 'N/A';
  const uid = currentUser?.uid || 'N/A';

  // Live Stats State
  const [statsLoading, setStatsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    active: 0,
    resolved: 0,
    total: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      setStatsLoading(true);
      try {
        const items = await getItemsByUser(currentUser.uid);
        const active = items.filter(i => (i.status || 'active') === 'active').length;
        const resolved = items.filter(i => i.status === 'resolved').length;
        setUserStats({
          active,
          resolved,
          total: items.length
        });
      } catch (err) {
        console.warn('[Dashboard Stats Error]:', err);
        // Non-blocking fallback
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  return (
    <div className="dashboard-page container">
      {/* Welcome Banner */}
      <section className="dashboard-welcome-banner card">
        <div className="welcome-banner-content">
          <div className="welcome-avatar-wrap">
            <User size={36} />
          </div>
          <div className="welcome-text-group">
            <div className="welcome-badge-row">
              <span className="badge badge-teal">Authenticated Resident</span>
              <span className="badge badge-sky">Lipa City Community</span>
            </div>
            <h1 className="welcome-heading">Welcome, {displayName}!</h1>
            <p className="welcome-subtitle">
              Manage your lost and found listings, track item inquiries, and assist fellow Lipa City residents.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview Grid (Live User Metrics) */}
      <section className="dashboard-stats-grid">
        <div className="stat-card card">
          <div className="stat-icon-wrap lost-stat">
            <FileText size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">My Active Posts</span>
            <span className="stat-value">
              {statsLoading ? <Loader2 size={20} className="auth-spinner" /> : userStats.active}
            </span>
            <span className="stat-hint">Active lost or found posts</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrap resolved-stat">
            <CheckCheck size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Resolved Items</span>
            <span className="stat-value">
              {statsLoading ? <Loader2 size={20} className="auth-spinner" /> : userStats.resolved}
            </span>
            <span className="stat-hint">Successfully recovered/returned</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrap total-stat">
            <Sparkles size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">
              {statsLoading ? <Loader2 size={20} className="auth-spinner" /> : userStats.total}
            </span>
            <span className="stat-hint">Lifetime platform posts</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Quick Actions & Account Panel */}
      <div className="dashboard-main-grid">
        {/* Quick Actions Panel */}
        <div className="dashboard-card card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Quick Actions</h2>
              <p className="dashboard-card-desc">
                Submit a new report or explore the community directory.
              </p>
            </div>
          </div>

          <div className="quick-actions-grid">
            <Link to="/post-item" className="quick-action-button lost-action">
              <div className="action-icon-pill lost">
                <Search size={22} />
              </div>
              <div className="action-text">
                <span className="action-title">Report Lost Item</span>
                <span className="action-caption">Post an item you misplaced in Lipa</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>

            <Link to="/post-item" className="quick-action-button found-action">
              <div className="action-icon-pill found">
                <Gift size={22} />
              </div>
              <div className="action-text">
                <span className="action-title">Report Found Item</span>
                <span className="action-caption">Post an item you discovered</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>

            <Link to="/items" className="quick-action-button">
              <div className="action-icon-pill browse">
                <Compass size={22} />
              </div>
              <div className="action-text">
                <span className="action-title">Browse Directory</span>
                <span className="action-caption">View active public listings</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>

            <Link to="/my-posts" className="quick-action-button">
              <div className="action-icon-pill posts">
                <FolderClock size={22} />
              </div>
              <div className="action-text">
                <span className="action-title">My Reports</span>
                <span className="action-caption">Manage, edit, or resolve listings</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>
          </div>
        </div>

        {/* Profile Information Panel */}
        <div className="dashboard-card card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Account Profile</h2>
              <p className="dashboard-card-desc">
                Your verified resident profile details.
              </p>
            </div>
          </div>

          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{displayName}</span>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{email}</span>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Account UID</span>
              <span className="info-value code-pill">{uid}</span>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Platform Status</span>
              <div className="badge-wrapper">
                <span className="badge badge-teal">
                  <ShieldCheck size={14} />
                  <span>Verified Resident</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
