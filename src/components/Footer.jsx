import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart, ExternalLink, Sparkles } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <Logo size={42} showText={true} />
            <p className="footer-description">
              A community-driven digital lost and found platform dedicated to reconnecting lost belongings with their owners across Lipa City.
            </p>
            <div className="footer-location">
              <MapPin size={16} className="text-teal" />
              <span>Lipa City, Batangas, Philippines</span>
            </div>
            <div className="footer-civic-note">
              <Sparkles size={14} className="text-gold" />
              <span>Inspired by Lipa City community values of honesty &amp; solidarity.</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Landing Page</Link></li>
              <li><Link to="/items">Browse Lost &amp; Found</Link></li>
              <li><Link to="/post-item">Report an Item</Link></li>
              <li><Link to="/dashboard">Resident Dashboard</Link></li>
              <li><Link to="/my-posts">My Submissions</Link></li>
            </ul>
          </div>

          {/* Col 3: Academic Notice */}
          <div className="footer-col">
            <h4 className="footer-heading">Project Notice</h4>
            <ul className="footer-links">
              <li><span className="footer-static-item">University Midterm Practical Project</span></li>
              <li><span className="footer-static-item">Independent Student Development</span></li>
              <li><span className="footer-static-item">Not an Official Government System</span></li>
              <li><Link to="/login">Resident Login</Link></li>
              <li><Link to="/signup">Register Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Lipa Lost &amp; Found. Developed for Academic Practical Requirements.
          </p>
          <div className="footer-badge-academic">
            <ShieldCheck size={14} className="text-teal" />
            <span>Community Platform Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
