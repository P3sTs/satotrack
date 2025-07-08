import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, fallback to system preference
    const savedTheme = localStorage.getItem('satotrack-theme') as Theme;
    if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Default to system
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  // Calculate effective theme
  useEffect(() => {
    const calculateEffectiveTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme as 'dark' | 'light';
    };

    const newEffectiveTheme = calculateEffectiveTheme();
    console.log('🎨 Theme Debug:', { theme, newEffectiveTheme, previousEffectiveTheme: effectiveTheme });
    
    setEffectiveTheme(newEffectiveTheme);

    // Apply theme to document with smooth transition
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes from both html and body
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Force reflow to ensure class removal is processed
    root.offsetHeight;
    
    // Add new theme class to both html and body
    root.classList.add(newEffectiveTheme);
    body.classList.add(newEffectiveTheme);
    
    console.log('🎨 Applied theme class:', newEffectiveTheme, 'HTML classes:', root.className, 'Body classes:', body.className);
    
    // Save to localStorage
    localStorage.setItem('satotrack-theme', theme);
    
    // Broadcast theme change to other tabs
    const event = new CustomEvent('theme-change', { detail: { theme, effectiveTheme: newEffectiveTheme } });
    window.dispatchEvent(event);

    // Listen for system theme changes when using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        console.log('🎨 System theme changed to:', systemTheme);
        setEffectiveTheme(systemTheme);
        root.classList.remove('light', 'dark');
        document.body.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
        document.body.classList.add(systemTheme);
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [theme]);

  useEffect(() => {
    // Listen for theme changes from other tabs
    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail);
    };

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'system') return 'light';
      return prevTheme === 'dark' ? 'light' : 'dark';
    });
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};