
import React from 'react';

interface DebugLoggerProps {
  data: any;
  label?: string;
  level?: 'info' | 'warn' | 'error';
}

const DebugLogger: React.FC<DebugLoggerProps> = ({ 
  data, 
  label = 'Debug', 
  level = 'info' 
}) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '🔍';
      console.group(`${emoji} ${label}`);
      console[level](data);
      console.groupEnd();
    }
  }, [data, label, level]);

  return null;
};

export default DebugLogger;
