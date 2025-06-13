
import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface ActionFeedbackContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ActionFeedbackContext = createContext<ActionFeedbackContextType | undefined>(undefined);

export const ActionFeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showSuccess = (message: string, duration = 4000) => {
    toast.success(message, {
      duration,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      className: "border-l-4 border-l-green-500"
    });
  };

  const showError = (message: string, duration = 6000) => {
    toast.error(message, {
      duration,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      className: "border-l-4 border-l-red-500"
    });
  };

  const showWarning = (message: string, duration = 5000) => {
    toast.warning(message, {
      duration,
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      className: "border-l-4 border-l-yellow-500"
    });
  };

  const showInfo = (message: string, duration = 4000) => {
    toast.info(message, {
      duration,
      icon: <Info className="h-5 w-5 text-blue-500" />,
      className: "border-l-4 border-l-blue-500"
    });
  };

  return (
    <ActionFeedbackContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
    </ActionFeedbackContext.Provider>
  );
};

export const useActionFeedback = () => {
  const context = useContext(ActionFeedbackContext);
  if (!context) {
    throw new Error('useActionFeedback must be used within ActionFeedbackProvider');
  }
  return context;
};
