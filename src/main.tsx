
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/auth'
import { CarteirasProvider } from './contexts/CarteirasContext'
import { ViewModeProvider } from './contexts/ViewModeContext'

// Usar createRoot para renderização moderna do React
const root = createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CarteirasProvider>
        <ViewModeProvider>
          <App />
        </ViewModeProvider>
      </CarteirasProvider>
    </AuthProvider>
  </BrowserRouter>
);
