"use client"

import * as React from "react"
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Github, Instagram, MessageCircle, Moon, Send, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme/ThemeContext"

function SatoTrackFooter() {
  const { effectiveTheme, toggleTheme } = useTheme()
  const isDarkMode = effectiveTheme === "dark"

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand and Newsletter */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-orbitron font-semibold">
                <span className="satotrack-gradient-text">SatoTrack</span>
              </span>
            </div>
            <p className="mb-6 text-muted-foreground">
              Sua visão clara do mercado de criptomoedas. Gerencie, acompanhe e cresça com segurança.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Digite seu email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-satotrack-neon text-black transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Inscrever</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-satotrack-neon/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-satotrack-neon">Links Rápidos</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/" className="block transition-colors hover:text-satotrack-neon">
                Home
              </Link>
              <Link to="/dashboard" className="block transition-colors hover:text-satotrack-neon">
                Dashboard
              </Link>
              <Link to="/auth" className="block transition-colors hover:text-satotrack-neon">
                Login
              </Link>
              <Link to="/sobre" className="block transition-colors hover:text-satotrack-neon">
                Quem Somos
              </Link>
              <Link to="/privacidade" className="block transition-colors hover:text-satotrack-neon">
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-satotrack-neon">Contato</h3>
            <address className="space-y-2 text-sm not-italic text-satotrack-text">
              <p>📧 contato@satotrack.com</p>
              <p>📱 WhatsApp: +55 (11) 99999-9999</p>
              <p>🇧🇷 Brasil</p>
              <p>⏰ Suporte 24/7</p>
            </address>
          </div>

          {/* Social Media and Theme */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-satotrack-neon">Redes Sociais</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5"
                      asChild
                    >
                      <a 
                        href="https://t.me/No_dts" 
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                      >
                        <MessageCircle className="h-4 w-4 text-satotrack-neon" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Siga-nos no Telegram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5"
                      asChild
                    >
                      <a 
                        href="https://instagram.com/dantas_dts" 
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-4 w-4 text-satotrack-neon" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Siga-nos no Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5"
                      asChild
                    >
                      <a 
                        href="https://github.com/no_dts" 
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Github"
                      >
                        <Github className="h-4 w-4 text-satotrack-neon" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Veja nosso código no GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Alternar modo escuro
              </Label>
            </div>
          </div>
        </div>

        {/* Bottom Section with "Feito com ❤️🇧🇷" */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-satotrack-neon/10 pt-8 text-center md:flex-row">
          <div className="text-sm text-satotrack-text">
            <p>© {new Date().getFullYear()} SatoTrack. Todos os direitos reservados.</p>
            <p className="mt-1">
              <span className="inline-block h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-satotrack-neon mr-1 md:mr-2 animate-pulse-slow"></span>
              Gerencie. Acompanhe. Cresça.
            </p>
          </div>
          
          {/* Brazilian Pride Section - DESTAQUE */}
          <div className="text-center order-first md:order-none">
            <p className="text-xl md:text-2xl font-bold text-satotrack-neon mb-1 animate-pulse">
              Feito com ❤️🇧🇷
            </p>
            <p className="text-xs text-satotrack-text">
              Desenvolvido no Brasil para o mundo
            </p>
          </div>

          <nav className="flex gap-4 text-sm">
            <Link to="/privacidade" className="transition-colors hover:text-satotrack-neon">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="transition-colors hover:text-satotrack-neon">
              Termos de Uso
            </Link>
            <Link to="/cookies" className="transition-colors hover:text-satotrack-neon">
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { SatoTrackFooter }