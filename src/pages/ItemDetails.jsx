import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Gift, 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Share2, 
  Info,
  Compass,
  FileText
} from 'lucide-react';
import { getItemById, getFriendlyFirestoreErrorMessage } from '../services/itemService';
import { formatPostedDate, formatEventDate } from '../utils/dateUtils';
import './ItemDetails.css';

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getItemById(itemId);
      setItem(data);
    } catch (err) {
      console.error('[ItemDetails Fetch Error]:', err);
      setError(getFriendlyFirestoreErrorMessage(err, 'load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="item-details-page container">
        <div className="details-loading-card card">
          <Loader2 size={36} className="auth-spinner text-teal" />
          <p className="details-loading-text">Loading report details from Lipa City directory...</p>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="item-details-page container">
        <div className="details-error-card card">
          <AlertCircle size={40} className="details-error-icon" />
          <h2 className="details-error-title">Unable to Load Item</h2>
          <p className="details-error-desc">{error}</p>
          <div className="details-error-actions">
            <button onClick={fetchItem} className="btn btn-primary">
              Try Again
            </button>
            <Link to="/items" className="btn btn-outline">
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Item Not Found State
  if (!item) {
    return (
      <div className="item-details-page container">
        <div className="details-not-found-card card">
          <div className="not-found-icon-wrap">
            <Compass size={40} />
          </div>
          <h1 className="not-found-title">Report Not Found</h1>
          <p className="not-found-desc">
            The requested lost or found report does not exist or may have been removed.
          </p>
          <Link to="/items" className="btn btn-primary btn-lg">
            <ArrowLeft size={18} />
            <span>Browse All Lost &amp; Found</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isFound = item.type === 'found';

  return (
    <div className="item-details-page container">
      {/* Top Breadcrumb Navigation */}
      <div className="details-topbar">
        <Link to="/items" className="btn btn-outline btn-sm details-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>

        <button 
          onClick={handleShare} 
          className="btn btn-outline btn-sm details-share-btn"
          title="Copy link to clipboard"
        >
          <Share2 size={15} />
          <span>{copiedLink ? 'Link Copied!' : 'Share Report'}</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="details-main-layout">
        <div className="details-left-column">
          {/* Header Card */}
          <article className="details-header-card card">
            <div className="details-badges-row">
              {isLost && (
                <span className="badge badge-lost">
                  <Search size={13} />
                  <span>LOST ITEM</span>
                </span>
              )}
              {isFound && (
                <span className="badge badge-found">
                  <Gift size={13} />
                  <span>FOUND ITEM</span>
                </span>
              )}
              <span className="badge badge-teal">
                <CheckCircle2 size={13} />
                <span>Active Listing</span>
              </span>
              <span className="badge badge-sky">
                <Tag size={13} />
                <span>{item.category || 'General'}</span>
              </span>
            </div>

            <h1 className="details-item-title">{item.itemName}</h1>

            <div className="details-posted-meta">
              <Clock size={15} className="meta-icon" />
              <span>Posted on {formatPostedDate(item.createdAt)}</span>
            </div>

            <div className="details-divider"></div>

            {/* Description Section */}
            <div className="details-section-block">
              <h3 className="section-subtitle-heading">
                <FileText size={18} className="text-teal" />
                <span>Item Description</span>
              </h3>
              <p className="details-description-text">
                {item.description}
              </p>
            </div>
          </article>

          {/* Location & Occurrence Card */}
          <div className="details-info-card card">
            <h3 className="section-subtitle-heading">
              <MapPin size={18} className="text-teal" />
              <span>Location &amp; Date Details</span>
            </h3>

            <div className="details-meta-grid">
              <div className="meta-grid-item">
                <span className="meta-item-label">Barangay</span>
                <span className="meta-item-value highlight">{item.barangay}</span>
              </div>

              <div className="meta-grid-item">
                <span className="meta-item-label">Specific Location</span>
                <span className="meta-item-value">{item.location || 'Not specified'}</span>
              </div>

              <div className="meta-grid-item">
                <span className="meta-item-label">
                  {isLost ? 'Date Lost' : 'Date Found'}
                </span>
                <span className="meta-item-value date-highlight">
                  <Calendar size={15} />
                  <span>{formatEventDate(item.eventDate)}</span>
                </span>
              </div>

              <div className="meta-grid-item">
                <span className="meta-item-label">City / Municipality</span>
                <span className="meta-item-value">Lipa City, Batangas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Poster & Contact Information */}
        <div className="details-right-column">
          {/* Poster & Contact Card */}
          <div className="details-contact-card card">
            <div className="contact-card-header">
              <div className="contact-avatar-badge">
                <User size={22} />
              </div>
              <div className="contact-poster-info">
                <span className="contact-sub-label">Reported by</span>
                <h3 className="contact-poster-name">{item.posterName || 'Resident'}</h3>
              </div>
            </div>

            <div className="details-divider"></div>

            {/* Contact Info (Privacy: NO posterEmail) */}
            <div className="contact-info-block">
              <span className="contact-info-title">Contact Information</span>
              {item.contactInfo && item.contactInfo.trim() !== '' ? (
                <div className="contact-detail-box">
                  <Phone size={16} className="text-teal" />
                  <span className="contact-detail-text">{item.contactInfo}</span>
                </div>
              ) : (
                <p className="contact-empty-text">
                  No contact information provided.
                </p>
              )}
            </div>

            {/* Safety & Verification Notice */}
            <div className="contact-safety-box">
              <div className="safety-box-header">
                <ShieldCheck size={16} className="text-teal" />
                <span className="safety-title">Safety Tip</span>
              </div>
              <p className="safety-desc">
                For your security, always arrange item verifications and handovers in public, well-lit areas around Lipa City (such as near barangay desks, mall terminals, or police outposts).
              </p>
            </div>
          </div>

          {/* Quick Action Reminder */}
          <div className="details-action-card card">
            <h4 className="action-card-title">Found or lost another item?</h4>
            <p className="action-card-desc">
              Help keep Lipa City connected by reporting misplaced or discovered items today.
            </p>
            <Link to="/post-item" className="btn btn-primary btn-sm full-width">
              <span>Submit a Report</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
