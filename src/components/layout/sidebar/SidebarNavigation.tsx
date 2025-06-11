import React from "react"
import {
  Home,
  LayoutDashboard,
  Settings,
  Wallet,
  Activity,
  HelpCircle,
  LogOut,
  Trophy,
  Bell,
  TrendingUp,
  ArrowLeftRight
} from "lucide-react"

import { useAuth } from "@/contexts/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface Props {
  isDashboard?: boolean
}

interface Item {
  title: string
  href: string
  description: string
  disabled?: boolean
  external?: boolean
  icon: any
  onClick?: () => void
}

const SidebarNavigation: React.FC<Props> = ({ isDashboard }) => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Logout realizado com sucesso!")
      navigate("/auth")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast.error("Erro ao realizar logout.")
    }
  }

  const navigationItems: Item[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      description: "Visão geral das suas finanças"
    },
    {
      title: "Carteiras",
      icon: Wallet,
      href: "/carteiras",
      description: "Gerencie suas carteiras Bitcoin"
    },
    {
      title: "Transações",
      icon: Activity,
      href: "/transacoes",
      description: "Histórico de transações"
    },
    {
      title: "Performance IA",
      icon: TrendingUp,
      href: "/performance-analytics",
      description: "Análise avançada com IA"
    },
    {
      title: "Alertas",
      icon: Bell,
      href: "/alerts",
      description: "Configure alertas personalizados"
    },
    {
      title: "Projeções",
      icon: TrendingUp,
      href: "/projections",
      description: "Análises e projeções de lucro"
    },
    {
      title: "Comparação",
      icon: ArrowLeftRight,
      href: "/comparison",
      description: "Compare suas carteiras"
    },
    {
      title: "Conquistas",
      icon: Trophy,
      href: "/achievements",
      description: "Desbloqueie recompensas"
    },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: "/ajuda",
      description: "Central de ajuda e suporte"
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/configuracoes",
      description: "Ajuste suas preferências"
    },
    {
      title: "Sair",
      icon: LogOut,
      href: "#",
      description: "Desconectar da sua conta",
      external: true,
      disabled: false,
      onClick: handleLogout
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      {navigationItems.map((item) => (
        <a
          key={item.title}
          href={item.href}
          onClick={item.onClick}
          className="group flex gap-3 rounded-md p-3 text-sm font-medium hover:bg-secondary hover:text-accent"
        >
          <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
          <span>{item.title}</span>
        </a>
      ))}
    </div>
  )
}

export default SidebarNavigation
