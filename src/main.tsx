
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Verificações de segurança e logs
console.log('🚀 SatoTrack iniciando...', {
  env: import.meta.env.MODE,
  timestamp: new Date().toISOString()
});

// Verificar se o elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Elemento root não encontrado!');
  throw new Error('Root element not found');
}

// Verificar se ReactDOM está disponível
if (!ReactDOM || !ReactDOM.createRoot) {
  console.error('❌ ReactDOM não está disponível!');
  throw new Error('ReactDOM not available');
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App renderizado com sucesso');
} catch (error) {
  console.error('❌ Erro ao renderizar App:', error);
  
  // Fallback manual em caso de erro crítico
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: #0a0a0a; 
        color: #ffffff; 
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #22c55e; margin-bottom: 16px;">SatoTrack</h1>
          <p style="color: #6b7280; margin-bottom: 16px;">Erro ao carregar a aplicação</p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #22c55e; 
              color: #000; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer;
              font-weight: 500;
            "
          >
            Recarregar Página
          </button>
        </div>
      </div>
    `;
  }
}
