import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  FileText,
  Lock,
  Info,
  LogIn
} from 'lucide-react';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Como Funciona', href: '/sobre' },
      { name: 'Segurança', href: '/sobre#security' },
      { name: 'Preços', href: '/precos' },
      { name: 'API Docs', href: '/api-docs' }
    ],
    legal: [
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Termos de Uso', href: '/termos-uso' },
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Compliance', href: '/compliance' }
    ],
    support: [
      { name: 'Central de Ajuda', href: '/help' },
      { name: 'Contato', href: '/contato' },
      { name: 'Status do Sistema', href: '/status' },
      { name: 'Comunidade', href: '/comunidade' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/satotrack' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/satotrack' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/satotrack' }
  ];

  return (
    <footer className="bg-dashboard-dark border-t border-dashboard-light/20">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-satotrack-neon/20 rounded-xl">
                <Shield className="h-8 w-8 text-satotrack-neon" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">SatoTrack</h3>
                <p className="text-satotrack-neon text-sm">Sua carteira multichain</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              A plataforma mais segura para enviar, receber e gerenciar seus criptoativos. 
              Tecnologia KMS de nível militar para proteger seus investimentos.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-satotrack-neon" />
                <span>contato@satotrack.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-satotrack-neon" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-satotrack-neon" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10 p-2"
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-satotrack-neon transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-satotrack-neon transition-colors text-sm flex items-center gap-2"
                  >
                    {link.name === 'Política de Privacidade' && <Lock className="h-3 w-3" />}
                    {link.name === 'Termos de Uso' && <FileText className="h-3 w-3" />}
                    {link.name === 'Sobre Nós' && <Info className="h-3 w-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-satotrack-neon transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick Login */}
            <div className="mt-6">
              <Button 
                asChild
                variant="outline"
                size="sm"
                className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10 w-full"
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-dashboard-light/20 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SatoTrack. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Desenvolvido com ❤️ para a comunidade crypto brasileira
            </p>
          </div>

          {/* Security Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-satotrack-neon/10 border border-satotrack-neon/20 rounded-lg">
              <Shield className="h-4 w-4 text-satotrack-neon" />
              <span className="text-xs text-satotrack-neon font-medium">KMS Certified</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">SSL Secured</span>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Padding */}
        <div className="h-20 md:h-0"></div>
      </div>
    </footer>
  );
};

export default FooterSection;