
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

// Define the available view modes
export type ViewMode = 'chart' | 'list' | 'card' | 'compact';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | null>(null);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [viewMode, setViewModeState] = useState<ViewMode>('chart');

  // Load saved preference from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedMode = localStorage.getItem('satotrack-view-mode');
      if (savedMode && ['chart', 'list', 'card', 'compact'].includes(savedMode)) {
        setViewModeState(savedMode as ViewMode);
      }
    }
  }, [user]);

  // Save preference to localStorage when it changes
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (user) {
      localStorage.setItem('satotrack-view-mode', mode);
    }
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};
