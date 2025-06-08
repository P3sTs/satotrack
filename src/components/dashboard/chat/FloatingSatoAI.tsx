
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, X } from 'lucide-react';
import SatoAIChat from './SatoAIChat';

const FloatingSatoAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {!isMinimized && (
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full z-10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <SatoAIChat
          context="Chat Flutuante"
          isMinimized={isMinimized}
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
        />
      </div>
    </div>
  );
};

export default FloatingSatoAI;
