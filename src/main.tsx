
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/index.css'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './contexts/auth'
import { CarteirasProvider } from './contexts/CarteirasContext'
import { ViewModeProvider } from './contexts/ViewModeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarteirasProvider>
          <ViewModeProvider>
            <App />
            <Toaster />
          </ViewModeProvider>
        </CarteirasProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
