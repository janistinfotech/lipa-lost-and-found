import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  Tag, 
  ArrowRight,
  FileQuestion,
  Gift,
  Sparkles,
  LayoutDashboard,
  Clock,
  HelpCircle,
  Building2,
  Smartphone,
  CreditCard,
  Key,
  Briefcase,
  Dog,
  Gem,
  FileSpreadsheet,
  Shirt,
  Box
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Home.css';

// Rich categories with icons
const CATEGORY_ITEMS = [
  { name: 'Electronics & Gadgets', icon: Smartphone, count: 'Phones, Laptops, Earbuds' },
  { name: 'Wallets & IDs', icon: CreditCard, count: 'Gov IDs, Student IDs, Cards' },
  { name: 'Keys & Keychains', icon: Key, count: 'House, Vehicle & Office Keys' },
  { name: 'Bags & Backpacks', icon: Briefcase, count: 'School Bags, Totes, Pouches' },
  { name: 'Pets & Animals', icon: Dog, count: 'Dogs, Cats & Small Pets' },
  { name: 'Jewelry & Watches', icon: Gem, count: 'Rings, Necklaces, Smartwatches' },
  { name: 'Documents & Files', icon: FileSpreadsheet, count: 'Certificates, Licenses, Books' },
  { name: 'Clothing & Apparel', icon: Shirt, count: 'Jackets, Caps, Uniforms' },
  { name: 'Other Belongings', icon: Box, count: 'Umbrellas, Glasses, Misc' }
];

const Home = () => {
  const { isAuthenticated, currentUser, userProfile } = useAuth();
  const displayName = currentUser?.displayName || userProfile?.fullName || 'Resident';

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-civic-badge">
              <span className="civic-dot"></span>
              <MapPin size={15} className="hero-badge-icon" />
              <span>Civic Platform for Lipa City Residents</span>
            </div>

            <h1 className="hero-title">
              {APP_NAME}
            </h1>

            <div className="hero-subgroup">
              <span className="hero-subtitle-badge">Lipa City Community Platform</span>
              <p className="hero-tagline">
                {APP_TAGLINE}
              </p>
            </div>

            <p className="hero-description">
              {APP_DESCRIPTION}
            </p>

            {/* Dynamic CTAs based on Auth State */}
            <div className="hero-cta-group">
              <Link to="/items" className="btn btn-primary btn-lg">
                <Compass size={19} />
                <span>Browse Lost &amp; Found</span>
              </Link>

              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-secondary btn-lg">
                  <LayoutDashboard size={19} />
                  <span>Resident Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    <LogIn size={19} />
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="btn btn-outline btn-lg">
                    <UserPlus size={19} />
                    <span>Create Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="hero-trust-indicators">
              <div className="trust-item">
                <CheckCircle2 size={17} className="text-teal" />
                <span>Community Verified</span>
              </div>
              <div className="trust-item">
                <ShieldCheck size={17} className="text-teal" />
                <span>Safe Claimant Verification</span>
              </div>
              <div className="trust-item">
                <Sparkles size={17} className="text-gold" />
                <span>100% Free Public Service</span>
              </div>
            </div>
          </div>

          {/* Right Visual / Interactive Feed Previews */}
          <div className="hero-card-preview">
            <div className="preview-container-header">
              <span className="preview-live-indicator">
                <span className="live-pulse"></span>
                Recent Community Reports
              </span>
              <span className="preview-location-note">Lipa City Directory</span>
            </div>

            {/* Lost Item Sample Card */}
            <div className="preview-card card">
              <div className="preview-header">
                <span className="badge badge-lost">LOST ITEM</span>
                <span className="preview-date">
                  <Clock size={12} />
                  <span>2 hours ago</span>
                </span>
              </div>
              <h3 className="preview-item-title">Brown Leather Wallet with BatStateU ID</h3>
              <p className="preview-item-desc">
                Misplaced around SM City Lipa public transport terminal. Contains school registration and transit cards.
              </p>
              <div className="preview-meta-row">
                <div className="preview-location-tag">
                  <MapPin size={13} />
                  <span>Ayala Highway / SM City Lipa</span>
                </div>
                <span className="preview-category-pill">Wallets &amp; IDs</span>
              </div>
            </div>

            {/* Found Item Sample Card */}
            <div className="preview-card card highlight-card">
              <div className="preview-header">
                <span className="badge badge-found">FOUND ITEM</span>
                <span className="preview-date">
                  <Clock size={12} />
                  <span>Yesterday</span>
                </span>
              </div>
              <h3 className="preview-item-title">Motorcycle Key with Blue Carabiner &amp; Flash Drive</h3>
              <p className="preview-item-desc">
                Found along CM Recto Avenue near Lipa Cathedral. Deposited at nearby community security desk.
              </p>
              <div className="preview-meta-row">
                <div className="preview-location-tag">
                  <MapPin size={13} />
                  <span>CM Recto Ave, Lipa Poblacion</span>
                </div>
                <span className="preview-category-pill">Keys &amp; Keychains</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Simple &amp; Safe Workflow</span>
            <h2 className="section-title">How Lipa Lost &amp; Found Works</h2>
            <p className="section-subtitle">
              Connecting finders with rightful owners through an accessible 3-step community process.
            </p>
          </div>

          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card card">
              <div className="step-badge-number">01</div>
              <div className="step-icon-wrap step-teal">
                <FileQuestion size={26} />
              </div>
              <h3 className="step-title">Report an Item</h3>
              <p className="step-text">
                Post lost belongings or discovered items with descriptions, photos, and approximate Lipa City landmarks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card card">
              <div className="step-badge-number">02</div>
              <div className="step-icon-wrap step-sky">
                <Search size={26} />
              </div>
              <h3 className="step-title">Search &amp; Filter</h3>
              <p className="step-text">
                Browse real-time listings by category, barangay location, and keywords to pinpoint exact matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card card">
              <div className="step-badge-number">03</div>
              <div className="step-icon-wrap step-gold">
                <ShieldCheck size={26} />
              </div>
              <h3 className="step-title">Safe Reconnection</h3>
              <p className="step-text">
                Verify rightful ownership through distinctive item identifiers and arrange safe handovers in Lipa City.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Browse By Category</span>
            <h2 className="section-title">Popular Item Categories</h2>
            <p className="section-subtitle">
              Frequently reported items across Lipa City universities, malls, markets, and terminals.
            </p>
          </div>

          <div className="categories-grid">
            {CATEGORY_ITEMS.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Link to="/items" key={idx} className="category-card card">
                  <div className="category-icon-wrap">
                    <IconComp size={22} />
                  </div>
                  <div className="category-text-block">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-subtext">{cat.count}</span>
                  </div>
                  <ArrowRight size={16} className="category-arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Action Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-card card">
            <div className="cta-banner-content">
              <div className="cta-badge">
                <Sparkles size={14} />
                <span>Join Lipa City's Network</span>
              </div>
              <h2 className="cta-banner-title">Have you lost or found something today?</h2>
              <p className="cta-banner-desc">
                Help build a more helpful, honest, and connected Lipa City community. Every report helps bring a lost item home.
              </p>
            </div>
            <div className="cta-banner-buttons">
              <Link to="/post-item" className="btn btn-cta-main btn-lg">
                <Gift size={18} />
                <span>Report an Item Now</span>
              </Link>
              <Link to="/items" className="btn btn-cta-outline btn-lg">
                <Compass size={18} />
                <span>Browse Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
