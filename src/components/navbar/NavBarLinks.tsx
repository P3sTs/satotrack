
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Wallet } from 'lucide-react';
import { NavItem } from './types';

interface NavBarLinksProps {
  items: NavItem[];
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

const NavBarLinks: React.FC<NavBarLinksProps> = ({ 
  items, 
  isMobile = false,
  onMobileItemClick
}) => {
  const location = useLocation();
  
  return (
    <>
      {items.map((item, i) => (
        <Link 
          key={i} 
          to={item.href}
          className={`flex items-center ${isMobile ? 'py-2 text-base' : 'text-sm'} font-medium transition-colors hover:text-satotrack-neon
            ${location.pathname === item.href ? 'text-satotrack-neon' : 'text-gray-300'}`}
          onClick={onMobileItemClick}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default NavBarLinks;
