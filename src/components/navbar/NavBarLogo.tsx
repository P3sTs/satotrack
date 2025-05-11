
import React from 'react';
import { Link } from 'react-router-dom';

const NavBarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      <div className="relative transition-all duration-300 group-hover:scale-110">
        <img 
          src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
          alt="SatoTrack Logo" 
          className="h-8 w-8 object-contain satotrack-logo"
        />
      </div>
      <span className="font-orbitron font-bold text-xl tracking-wider text-white">
        <span className="satotrack-gradient-text">SatoTrack</span>
      </span>
    </Link>
  );
};

export default NavBarLogo;
