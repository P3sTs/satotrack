
import { useState, useEffect } from 'react';
import { Widget } from '../types';

export const useWidgetState = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'profit-loss',
      title: 'Lucro/Prejuízo 24h',
      type: 'metric',
      isMinimized: false,
      isFavorite: true,
      value: 2.5,
      trend: 'up'
    },
    {
      id: 'portfolio-goal',
      title: 'Meta do Portfólio',
      type: 'goal',
      isMinimized: false,
      isFavorite: false,
      value: 75,
      target: 100
    },
    {
      id: 'market-sentiment',
      title: 'Sentimento do Mercado',
      type: 'metric',
      isMinimized: false,
      isFavorite: true,
      value: 68,
      trend: 'up'
    },
    {
      id: 'price-alert',
      title: 'Alertas de Preço',
      type: 'alert',
      isMinimized: false,
      isFavorite: false,
      value: 3
    }
  ]);

  const [expandedWidget, setExpandedWidget] = useState<Widget | null>(null);
  const [savedWidgets, setSavedWidgets] = useState<string[]>([]);

  // Load saved widgets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedWidgets');
    if (saved) {
      setSavedWidgets(JSON.parse(saved));
    }
  }, []);

  return {
    widgets,
    setWidgets,
    expandedWidget,
    setExpandedWidget,
    savedWidgets,
    setSavedWidgets
  };
};
