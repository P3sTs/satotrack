
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
  AlertCircle,
  CheckCircle,
  WifiOff,
  Zap
} from 'lucide-react';
import { useSatoAI } from '@/hooks/useSatoAI';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  provider?: string;
  isTyping?: boolean;
}

interface ConnectionStatus {
  isConnected: boolean;
  provider: string | null;
  lastTest: Date | null;
}

const FloatingSatoAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou o SatoAI, seu assistente especializado em Bitcoin e criptomoedas. Como posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date(),
      provider: 'system'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    provider: null,
    lastTest: null
  });
  const { askSatoAI, testConnection, isLoading } = useSatoAI();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [typingMessage, setTypingMessage] = useState<string>('');

  // Auto-scroll para última mensagem
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

  // Animação de digitação
  const typeMessage = (message: string, callback: () => void) => {
    let index = 0;
    setTypingMessage('');
    
    const typeChar = () => {
      if (index < message.length) {
        setTypingMessage(message.slice(0, index + 1));
        index++;
        setTimeout(typeChar, 20);
      } else {
        setTimeout(() => {
          setTypingMessage('');
          callback();
        }, 500);
      }
    };
    
    typeChar();
  };

  // Teste automático de conexão quando abre o chat
  useEffect(() => {
    if (isOpen && !connectionStatus.lastTest) {
      performConnectionTest();
    }
  }, [isOpen]);

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

    try {
      const currentPath = window.location.pathname;
      const context = `Usuário navegando em ${currentPath === '/' ? 'página inicial' : currentPath}`;
      
      console.log('💬 Enviando mensagem:', { message: currentMessage.substring(0, 50) + '...', context });
      
      const response = await askSatoAI(currentMessage, context);

      if (response) {
        // Adicionar mensagem da IA com animação
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: '',
          sender: 'ai',
          timestamp: new Date(),
          isTyping: true
        };

        setMessages(prev => [...prev, aiMessage]);
        setConnectionStatus(prev => ({ ...prev, isConnected: true, lastTest: new Date() }));

        // Animar a digitação da resposta
        typeMessage(response, () => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, content: response, isTyping: false }
                : msg
            )
          );
        });
      } else {
        // Mensagem de erro
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Desculpe, não consegui processar sua mensagem. Verifique a conexão e tente novamente.',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setConnectionStatus(prev => ({ ...prev, isConnected: false }));
      }

    } catch (error) {
      console.error('❌ Erro no chat:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const performConnectionTest = async () => {
    console.log('🔧 Iniciando teste de conexão...');
    toast.info('Testando conexão com SatoAI...');
    
    const isConnected = await testConnection();
    
    setConnectionStatus({
      isConnected,
      provider: isConnected ? 'IA' : null,
      lastTest: new Date()
    });

    if (isConnected) {
      toast.success('✅ SatoAI conectado e funcionando!');
    } else {
      toast.error('❌ Falha na conexão. Verifique as configurações.');
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
    if (connectionStatus.isConnected) return <CheckCircle className="h-4 w-4 text-green-400" />;
    return <WifiOff className="h-4 w-4 text-red-400" />;
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
            {getStatusIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={performConnectionTest}
              className="h-8 w-8 p-0 text-white/60 hover:text-white"
              title="Testar conexão"
              disabled={isLoading}
            >
              <Zap className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Status Bar */}
        {connectionStatus.lastTest && (
          <div className="px-4 py-2 bg-black/20 border-b border-cyan-500/10">
            <div className="text-xs text-cyan-300">
              Status: <span className={connectionStatus.isConnected ? 'text-green-400' : 'text-red-400'}>
                {connectionStatus.isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
              </span>
              <span className="text-white/60 ml-2">
                • {connectionStatus.lastTest.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
        
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
                    {message.provider && message.provider !== 'system' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        via {message.provider}
                      </div>
                    )}
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
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 pb-3">
          <div className="text-xs text-center text-muted-foreground border-t border-cyan-500/10 pt-2">
            Powered by <span className="text-cyan-400 font-medium">SatoAI</span>
            {connectionStatus.provider && (
              <span className="text-white/60"> • {connectionStatus.provider}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSatoAIChat;
