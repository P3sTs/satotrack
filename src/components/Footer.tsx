
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-satotrack-neon/10 bg-dashboard-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
              alt="SatoTrack Logo" 
              className="h-5 w-5 object-contain satotrack-logo"
            />
            <span className="font-orbitron font-semibold text-lg">
              <span className="satotrack-gradient-text">SatoTrack</span>
            </span>
          </div>
          
          <div className="text-sm text-satotrack-text">
            <p>© {new Date().getFullYear()} SatoTrack. <span className="hidden md:inline">O olho invisível da blockchain.</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
