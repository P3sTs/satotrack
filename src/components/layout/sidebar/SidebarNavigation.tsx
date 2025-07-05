
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Wallet, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings, 
  Bell,
  TrendingUp,
  Trophy,
  GitCompare,
  Zap,
  Shield,
  Key,
  Search,
  Globe,
  Users,
  CreditCard,
  Eye,
  FileText,
  UserCircle,
  Compass,
  TrendingDown,
  CheckCircle,
  Gift,
  Database,
  DollarSign,
  Activity,
  Calculator,
  Link2,
  Book,
  Send,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const SidebarNavigation = () => {
  const { user, userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const mainItems = [
    { 
      label: 'Dashboard', 
      icon: Home, 
      href: '/dashboard' 
    },
    { 
      label: 'Minhas Carteiras', 
      icon: Wallet, 
      href: '/crypto' 
    },
    { 
      label: 'Enviar Cripto', 
      icon: Send, 
      href: '/crypto?action=send' 
    },
    { 
      label: 'Receber Cripto', 
      icon: Download, 
      href: '/crypto?action=receive' 
    },
    { 
      label: 'Web3 Dashboard', 
      icon: Zap, 
      href: '/web3',
      premium: true
    }
  ];

  const marketsItems = [
    { 
      label: 'Mercado', 
      icon: BarChart3, 
      href: '/mercado' 
    },
    { 
      label: 'Bitcoin Lookup', 
      icon: Search, 
      href: '/bitcoin-lookup' 
    },
    { 
      label: 'Crypto 3D', 
      icon: Eye, 
      href: '/crypto-3d',
      premium: true
    }
  ];

  const analyticsItems = [
    { 
      label: 'Histórico', 
      icon: History, 
      href: '/historico' 
    },
    { 
      label: 'Histórico Premium', 
      icon: History, 
      href: '/historico-premium',
      premium: true
    },
    { 
      label: 'Projeções', 
      icon: TrendingUp, 
      href: '/projecao' 
    },
    { 
      label: 'Projeções Premium', 
      icon: TrendingUp, 
      href: '/projecao-premium',
      premium: true
    },
    { 
      label: 'Performance', 
      icon: Activity, 
      href: '/performance' 
    },
    { 
      label: 'Comparação', 
      icon: GitCompare, 
      href: '/wallet-comparison' 
    }
  ];

  const growthItems = [
    { 
      label: 'Growth Dashboard', 
      icon: TrendingUp, 
      href: '/growth' 
    },
    { 
      label: 'OnChain Dashboard', 
      icon: Database, 
      href: '/onchain' 
    },
    { 
      label: 'Projections', 
      icon: Calculator, 
      href: '/projections' 
    }
  ];

  const systemItems = [
    { 
      label: 'Alertas', 
      icon: Bell, 
      href: '/alerts' 
    },
    { 
      label: 'Notificações', 
      icon: Bell, 
      href: '/notificacoes' 
    },
    { 
      label: 'Notificações Premium', 
      icon: Bell, 
      href: '/notificacoes-premium',
      premium: true
    },
    { 
      label: 'Configurações', 
      icon: Settings, 
      href: '/configuracoes' 
    }
  ];

  const businessItems = [
    { 
      label: 'API Dashboard', 
      icon: Link2, 
      href: '/api' 
    },
    { 
      label: 'API Docs', 
      icon: Book, 
      href: '/api-docs' 
    },
    { 
      label: 'Planos', 
      icon: CreditCard, 
      href: '/planos' 
    },
    { 
      label: 'Programa Referral', 
      icon: Users, 
      href: '/referral' 
    }
  ];

  const achievementsItems = [
    { 
      label: 'Conquistas', 
      icon: Trophy, 
      href: '/achievements' 
    }
  ];

  const renderNavItem = (item: any) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-dashboard-medium",
              isActive 
                ? "bg-dashboard-medium text-white font-medium" 
                : "text-white/70 hover:text-white",
              item.premium && !isPremium && "opacity-50"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
          {item.premium && !isPremium && (
            <span className="text-xs bg-bitcoin/20 text-bitcoin px-1 py-0.5 rounded">
              Pro
            </span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <div className="flex flex-col gap-2">
      <SidebarGroup>
        <SidebarGroupLabel>Principal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Mercado</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {marketsItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Analytics</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {analyticsItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Crescimento</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {growthItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Sistema</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {systemItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Business</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {businessItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Gamificação</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {achievementsItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default SidebarNavigation;
