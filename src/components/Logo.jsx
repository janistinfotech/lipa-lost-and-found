import React from 'react';

const Logo = ({ 
  size = 38, 
  showText = true, 
  variant = 'default',
  showSubtitle = true 
}) => {
  return (
    <div className={`app-brand-logo ${variant}`}>
      {/* Custom Vector Icon: Map Pin + Search Glass + Beacon */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="brand-logo-svg"
      >
        <defs>
          <linearGradient id="lipaTealGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>
          <linearGradient id="lipaAccentSky" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4DA3D9" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Squircle Background Badge */}
        <rect 
          x="3" 
          y="3" 
          width="42" 
          height="42" 
          rx="12" 
          fill="url(#lipaTealGradient)" 
          filter="url(#logoShadow)"
        />

        {/* Location Pin Head / Community Halo Ring */}
        <path 
          d="M24 10C17.9249 10 13 14.9249 13 21C13 27.5 21.5 35 24 37C26.5 35 35 27.5 35 21C35 14.9249 30.0751 10 24 10Z" 
          fill="#FFFFFF" 
          fillOpacity="0.16" 
          stroke="#4DA3D9" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Magnifying Glass Search Lens Ring */}
        <circle 
          cx="23" 
          cy="20" 
          r="6.5" 
          stroke="#FFFFFF" 
          strokeWidth="2.5" 
        />

        {/* Search Handle */}
        <path 
          d="M28 25L33 30" 
          stroke="#D4A017" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />

        {/* Central Discovery Dot / Sparkle */}
        <circle 
          cx="23" 
          cy="20" 
          r="2.5" 
          fill="#4DA3D9" 
        />
        <circle 
          cx="24" 
          cy="13" 
          r="1.2" 
          fill="#D4A017" 
        />
      </svg>

      {showText && (
        <div className="brand-text-block">
          <span className="brand-name">Lipa Lost &amp; Found</span>
          {showSubtitle && (
            <span className="brand-sub">Lipa City Community Platform</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
