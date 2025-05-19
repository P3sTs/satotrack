
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import WalletsManager from './pages/WalletsManager';
import CarteiraDetalhes from './pages/CarteiraDetalhes';
import NovaCarteira from './pages/NovaCarteira';
import Mercado from './pages/Mercado';
import Historico from './pages/Historico';
import Notificacoes from './pages/Notificacoes';
import Configuracoes from './pages/Configuracoes';
import PlanosPage from './pages/PlanosPage';
import Privacidade from './pages/Privacidade';
import Sobre from './pages/Sobre';
import ApiDocs from './pages/ApiDocs';
import Crypto from './pages/Crypto';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/carteiras" element={<ProtectedRoute><WalletsManager /></ProtectedRoute>} />
        <Route path="/carteiras/:id" element={<ProtectedRoute><CarteiraDetalhes /></ProtectedRoute>} />
        <Route path="/nova-carteira" element={<ProtectedRoute><NovaCarteira /></ProtectedRoute>} />
        <Route path="/mercado" element={<Mercado />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
        <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/api" element={<ApiDocs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
