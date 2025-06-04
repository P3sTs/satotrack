
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useI18n } from '@/contexts/i18n/I18nContext';
import LanguageSelector from '@/components/common/LanguageSelector';

const ContextualHeader: React.FC = () => {
  const location = useLocation();
  const { t } = useI18n();

  const getPageInfo = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    const routeMap: Record<string, { title: string; breadcrumbs: string[] }> = {
      '/dashboard': { 
        title: t.dashboard.title, 
        breadcrumbs: [t.menu.dashboard] 
      },
      '/mercado': { 
        title: t.market.title, 
        breadcrumbs: [t.menu.dashboard, t.menu.market] 
      },
      '/carteiras': { 
        title: t.wallet.title, 
        breadcrumbs: [t.menu.dashboard, t.menu.wallet] 
      },
      '/nova-carteira': { 
        title: t.wallet.addWallet, 
        breadcrumbs: [t.menu.dashboard, t.menu.wallet, t.wallet.addWallet] 
      },
      '/referral': { 
        title: t.menu.referral, 
        breadcrumbs: [t.menu.dashboard, t.menu.referral] 
      },
      '/configuracoes': { 
        title: t.settings.title, 
        breadcrumbs: [t.menu.dashboard, t.menu.settings] 
      }
    };

    return routeMap[pathname] || { 
      title: segments[segments.length - 1] || t.dashboard.title, 
      breadcrumbs: [t.menu.dashboard] 
    };
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <header className="bg-dashboard-dark border-b border-dashboard-medium/30 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-white">{pageInfo.title}</h1>
          <nav className="flex items-center text-sm text-muted-foreground">
            <Home className="h-3 w-3 mr-1" />
            {pageInfo.breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
                <span className={index === pageInfo.breadcrumbs.length - 1 ? 'text-bitcoin' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSelector variant="header" />
        </div>
      </div>
    </header>
  );
};

export default ContextualHeader;
