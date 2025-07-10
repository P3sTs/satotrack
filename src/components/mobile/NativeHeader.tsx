import React from 'react';
import { Search, ChevronDown, Camera, MoreHorizontal } from 'lucide-react';

interface NativeHeaderProps {
  title: string;
  subtitle?: string;
}

const NativeHeader: React.FC<NativeHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-lg border-b border-dashboard-medium/30 z-50">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side - Camera */}
        <div className="w-10 h-10 rounded-lg bg-dashboard-medium/50 flex items-center justify-center">
          <Camera className="h-5 w-5 text-satotrack-text" />
        </div>

        {/* Center - Title with dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{title}</span>
          <ChevronDown className="h-4 w-4 text-satotrack-text" />
        </div>

        {/* Right side - Search */}
        <div className="w-10 h-10 rounded-lg bg-dashboard-medium/50 flex items-center justify-center">
          <Search className="h-5 w-5 text-satotrack-text" />
        </div>
      </div>
      
      {subtitle && (
        <div className="px-4 py-2 border-b border-dashboard-medium/20">
          <p className="text-xs text-satotrack-text">{subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default NativeHeader;