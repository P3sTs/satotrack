
export interface Translations {
  menu: {
    dashboard: string;
    market: string;
    wallet: string;
    charts: string;
    referral: string;
    settings: string;
    logout: string;
  };
  common: {
    welcome: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    confirm: string;
    language: string;
  };
  dashboard: {
    title: string;
    welcomeMessage: string;
    marketSummary: string;
    cryptosUp: string;
    cryptosDown: string;
    topVolume: string;
  };
  market: {
    title: string;
    trending: string;
    losers: string;
    volume: string;
    price: string;
    change24h: string;
    marketCap: string;
  };
  wallet: {
    title: string;
    balance: string;
    addWallet: string;
    myWallets: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    notifications: string;
    profile: string;
    appearance: string;
    appearanceDescription: string;
    preferences: string;
    preferencesDescription: string;
    defaultWallet: string;
    selectTheme: string;
    selectLanguage: string;
    selectDefaultWallet: string;
    darkTheme: string;
    lightTheme: string;
    systemTheme: string;
    enableNotifications: string;
    autoSync: string;
    saveSuccess: string;
    loginRequired: string;
  };
}

export const translations: Record<string, Translations> = {
  'pt-BR': {
    menu: {
      dashboard: 'Dashboard',
      market: 'Mercado',
      wallet: 'Carteira',
      charts: 'Gráficos',
      referral: 'Indicações',
      settings: 'Configurações',
      logout: 'Sair'
    },
    common: {
      welcome: 'Bem-vindo(a)',
      loading: 'Carregando...',
      error: 'Erro',
      save: 'Salvar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      language: 'Idioma'
    },
    dashboard: {
      title: 'Painel Principal',
      welcomeMessage: 'Bem-vindo(a) de volta, {userName}!',
      marketSummary: 'Resumo do Mercado',
      cryptosUp: 'Criptos em Alta',
      cryptosDown: 'Criptos em Baixa',
      topVolume: 'Maior Volume'
    },
    market: {
      title: 'Mercado de Criptomoedas',
      trending: 'Em Alta',
      losers: 'Em Baixa',
      volume: 'Volume',
      price: 'Preço',
      change24h: 'Variação 24h',
      marketCap: 'Market Cap'
    },
    wallet: {
      title: 'Minhas Carteiras',
      balance: 'Saldo',
      addWallet: 'Adicionar Carteira',
      myWallets: 'Minhas Carteiras'
    },
    settings: {
      title: 'Configurações',
      language: 'Idioma',
      theme: 'Tema',
      notifications: 'Notificações',
      profile: 'Perfil',
      appearance: 'Aparência',
      appearanceDescription: 'Configure a aparência da aplicação',
      preferences: 'Preferências',
      preferencesDescription: 'Configure suas preferências de uso',
      defaultWallet: 'Carteira Padrão',
      selectTheme: 'Selecione o tema',
      selectLanguage: 'Selecione o idioma',
      selectDefaultWallet: 'Selecione uma carteira padrão',
      darkTheme: 'Escuro',
      lightTheme: 'Claro',
      systemTheme: 'Sistema',
      enableNotifications: 'Ativar notificações',
      autoSync: 'Sincronização automática',
      saveSuccess: 'Configurações salvas com sucesso!',
      loginRequired: 'Você precisa estar logado para acessar as configurações.'
    }
  },
  'en-US': {
    menu: {
      dashboard: 'Dashboard',
      market: 'Market',
      wallet: 'Wallet',
      charts: 'Charts',
      referral: 'Referrals',
      settings: 'Settings',
      logout: 'Logout'
    },
    common: {
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      language: 'Language'
    },
    dashboard: {
      title: 'Main Dashboard',
      welcomeMessage: 'Welcome back, {userName}!',
      marketSummary: 'Market Summary',
      cryptosUp: 'Top Gainers',
      cryptosDown: 'Top Losers',
      topVolume: 'Highest Volume'
    },
    market: {
      title: 'Cryptocurrency Market',
      trending: 'Trending',
      losers: 'Losers',
      volume: 'Volume',
      price: 'Price',
      change24h: '24h Change',
      marketCap: 'Market Cap'
    },
    wallet: {
      title: 'My Wallets',
      balance: 'Balance',
      addWallet: 'Add Wallet',
      myWallets: 'My Wallets'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      profile: 'Profile',
      appearance: 'Appearance',
      appearanceDescription: 'Configure the application appearance',
      preferences: 'Preferences',
      preferencesDescription: 'Configure your usage preferences',
      defaultWallet: 'Default Wallet',
      selectTheme: 'Select theme',
      selectLanguage: 'Select language',
      selectDefaultWallet: 'Select a default wallet',
      darkTheme: 'Dark',
      lightTheme: 'Light',
      systemTheme: 'System',
      enableNotifications: 'Enable notifications',
      autoSync: 'Auto synchronization',
      saveSuccess: 'Settings saved successfully!',
      loginRequired: 'You need to be logged in to access settings.'
    }
  }
};
