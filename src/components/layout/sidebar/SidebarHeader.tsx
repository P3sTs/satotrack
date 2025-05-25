
import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarHeader as BaseSidebarHeader } from '@/components/ui/sidebar';

const SidebarHeader: React.FC = () => {
  return (
    <BaseSidebarHeader>
      <NavLink to="/" className="flex items-center p-2">
        <img
          src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png"
          alt="SatoTrack Logo"
          className="h-8 w-8 mr-2"
          loading="eager"
        />
        <span className="text-xl font-bold text-white">SatoTrack</span>
      </NavLink>
    </BaseSidebarHeader>
  );
};

export default SidebarHeader;
