import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import './PlaceholderPage.css';

const PlaceholderPage = ({ 
  title, 
  route, 
  description, 
  icon: Icon = Layers, 
  plannedFeatures = [] 
}) => {
  return (
    <div className="placeholder-container container">
      <div className="placeholder-card card">
        <div className="placeholder-header">
          <div className="placeholder-icon-wrap">
            <Icon size={28} />
          </div>
          <div>
            <div className="placeholder-badge-row">
              <span className="badge badge-teal">
                <Sparkles size={13} />
                <span>Next Milestone</span>
              </span>
              <span className="badge badge-sky">Route: {route}</span>
            </div>
            <h1 className="placeholder-title">{title}</h1>
          </div>
        </div>

        <p className="placeholder-description">
          {description}
        </p>

        {plannedFeatures.length > 0 && (
          <div className="placeholder-features-section">
            <h3 className="features-title">Planned Features for Next Steps:</h3>
            <div className="features-grid">
              {plannedFeatures.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <Clock size={16} className="feature-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="placeholder-actions">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Landing Page</span>
          </Link>
          <Link to="/items" className="btn btn-outline">
            <span>Browse Items View</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
