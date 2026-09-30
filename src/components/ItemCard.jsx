import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  ArrowRight, 
  Search, 
  Gift, 
  CheckCircle2 
} from 'lucide-react';
import { formatPostedDate, formatEventDate, truncateText } from '../utils/dateUtils';
import './ItemCard.css';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const isFound = item.type === 'found';

  return (
    <article className={`item-directory-card card ${isLost ? 'card-lost' : 'card-found'}`}>
      {/* Card Header: Type Badge, Status Badge & Post Date */}
      <div className="item-card-topbar">
        <div className="item-card-badges">
          {isLost && (
            <span className="badge badge-lost">
              <Search size={12} />
              <span>LOST ITEM</span>
            </span>
          )}
          {isFound && (
            <span className="badge badge-found">
              <Gift size={12} />
              <span>FOUND ITEM</span>
            </span>
          )}
          <span className="badge badge-teal item-status-badge">
            <CheckCircle2 size={12} />
            <span>Active</span>
          </span>
        </div>

        <span className="item-posted-time" title="Date posted">
          <Clock size={12} />
          <span>{formatPostedDate(item.createdAt)}</span>
        </span>
      </div>

      {/* Item Title & Category */}
      <div className="item-card-body">
        <div className="item-card-category-row">
          <span className="item-category-pill">
            <Tag size={12} />
            <span>{item.category || 'General'}</span>
          </span>
        </div>

        <h3 className="item-card-title">
          <Link to={`/items/${item.id}`} className="item-title-link">
            {item.itemName}
          </Link>
        </h3>

        <p className="item-card-description">
          {truncateText(item.description, 110)}
        </p>

        {/* Location & Date Details */}
        <div className="item-card-meta-list">
          <div className="item-meta-entry">
            <MapPin size={15} className="meta-icon" />
            <span className="meta-text">
              <strong>{item.barangay}</strong>
              {item.location ? ` • ${item.location}` : ''}
            </span>
          </div>

          <div className="item-meta-entry">
            <Calendar size={15} className="meta-icon" />
            <span className="meta-text">
              <span className="meta-date-label">{isLost ? 'Lost on:' : 'Found on:'}</span>
              {' '}
              {formatEventDate(item.eventDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Poster Name (Privacy: NO email) & CTA Link */}
      <div className="item-card-footer">
        <div className="item-poster-group">
          <div className="poster-avatar-circle">
            <User size={13} />
          </div>
          <div className="poster-text-block">
            <span className="poster-label">Reported by</span>
            <span className="poster-name">{item.posterName || 'Resident'}</span>
          </div>
        </div>

        <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm item-details-cta">
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
};

export default ItemCard;
