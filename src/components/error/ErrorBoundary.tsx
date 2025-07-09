import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-dashboard-dark p-4">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">
                Ops! Algo deu errado
              </h2>
              <p className="text-muted-foreground">
                Encontramos um erro inesperado. Tente recarregar a página.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-muted text-muted-foreground hover:bg-muted/10"
              >
                Recarregar Página
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <summary className="text-sm text-red-400 cursor-pointer mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="text-xs text-red-300 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;