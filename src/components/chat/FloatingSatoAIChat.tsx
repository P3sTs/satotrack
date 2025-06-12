
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Send, 
  User, 
  Bot,
  Loader2,
  X,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

const FloatingSatoAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou o SatoAI, seu assistente especializado em Bitcoin e criptomoedas. Como posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [typingMessage, setTypingMessage] = useState<string>('');

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  const typeMessage = (message: string, callback: () => void) => {
    let index = 0;
    setTypingMessage('');
    
    const typeChar = () => {
      if (index < message.length) {
        setTypingMessage(message.slice(0, index + 1));
        index++;
        setTimeout(typeChar, 30);
      } else {
        setTimeout(() => {
          setTypingMessage('');
          callback();
        }, 500);
      }
    };
    
    typeChar();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const currentPath = window.location.pathname;
      const context = `Usuário navegando em ${currentPath}`;
      
      console.log('Enviando mensagem para SatoAI:', { message: currentMessage, context });
      
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message: currentMessage.trim(),
          context: context
        }
      });

      console.log('Resposta do SatoAI:', { data, error });

      if (error) {
        console.error('Erro na função Supabase:', error);
        throw new Error(error.message || 'Erro na comunicação com o SatoAI');
      }

      if (data?.error) {
        console.error('Erro na função SatoAI:', data.error);
        throw new Error(data.error);
      }

      if (!data?.response) {
        throw new Error('Resposta inválida do SatoAI');
      }

      // Adicionar mensagem da IA com animação de digitação
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '',
        sender: 'ai',
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, aiMessage]);

      // Animar a digitação da resposta
      typeMessage(data.response, () => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: data.response, isTyping: false }
              : msg
          )
        );
      });

    } catch (error) {
      console.error('Erro ao consultar SatoAI:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('sobrecarregado') || errorMessage.includes('Rate limit')) {
        toast.error('SatoAI está sobrecarregado. Tente novamente em alguns segundos.');
      } else if (errorMessage.includes('API key')) {
        toast.error('Configuração da IA não encontrada. Contate o suporte.');
      } else {
        toast.error('Erro ao se comunicar com o SatoAI. Tente novamente.');
      }

      const errorAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, não consegui processar sua mensagem. Tente novamente.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCurrentContext = () => {
    const path = window.location.pathname;
    const contextMap: { [key: string]: string } = {
      '/': 'Página inicial',
      '/dashboard': 'Dashboard',
      '/carteiras': 'Gerenciamento de carteiras',
      '/mercado': 'Análise de mercado',
      '/projecoes': 'Projeções de lucro',
      '/configuracoes': 'Configurações'
    };
    return contextMap[path] || `Navegando em ${path}`;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          aria-label="Abrir chat SatoAI"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="card-3d-fluid w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-cyan-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            <span className="font-semibold text-cyan-400">SatoAI</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 text-white/60 hover:text-white"
            aria-label="Fechar chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="h-80 w-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-satotrack-neon/20' 
                    : 'bg-cyan-500/20'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-cyan-400" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-xs ${
                  message.sender === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-satotrack-neon/10 border border-satotrack-neon/20'
                      : 'bg-cyan-500/10 border border-cyan-500/20'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.isTyping && typingMessage ? typingMessage : message.content}
                      {message.isTyping && (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && !typingMessage && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    <span className="text-sm text-muted-foreground">
                      SatoAI está pensando...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="p-4 border-t border-cyan-500/20">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte sobre Bitcoin, análises..."
              disabled={isLoading}
              className="bg-background/50 border-cyan-500/20 focus:border-cyan-500/40 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 pb-3">
          <div className="text-xs text-center text-muted-foreground border-t border-cyan-500/10 pt-2">
            Powered by <span className="text-cyan-400 font-medium">SatoAI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSatoAIChat;
