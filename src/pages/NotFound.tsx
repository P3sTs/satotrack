
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página "{location.pathname}" não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-bitcoin hover:bg-bitcoin-dark text-white transition-colors"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
