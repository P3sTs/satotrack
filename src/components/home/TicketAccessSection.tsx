import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Mail, Phone, Copy, CheckCircle, Ticket } from 'lucide-react';
import { toast } from 'sonner';

interface AccessTicket {
  id: string;
  code: string;
  email: string;
  qrCode: string;
  expiresAt: Date;
}

const TicketAccessSection = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ticket, setTicket] = useState<AccessTicket | null>(null);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');

  const generateTicket = async () => {
    if (!email && !phone) {
      toast.error('Por favor, informe seu email ou telefone');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular criação de ticket
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTicket: AccessTicket = {
        id: Math.random().toString(36).substr(2, 9),
        code: `SATO-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        email: email || phone,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SATOTRACK-${Math.random().toString(36).substr(2, 8)}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      };
      
      // Salvar email para cadastro posterior
      sessionStorage.setItem('ticket_email', email || phone);
      sessionStorage.setItem('ticket_code', newTicket.code);
      
      setTicket(newTicket);
      toast.success('Ticket de acesso gerado com sucesso!');
      
    } catch (error) {
      toast.error('Erro ao gerar ticket. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado!');
  };

  if (ticket) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-dashboard-medium/50 border-satotrack-neon/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-satotrack-neon/20 rounded-full">
                  <CheckCircle className="h-12 w-12 text-satotrack-neon" />
                </div>
              </div>
              <CardTitle className="text-2xl text-satotrack-neon">
                Ticket de Acesso Gerado!
              </CardTitle>
              <p className="text-muted-foreground">
                Use esse ticket para ativar sua conta e acessar a plataforma com segurança
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl">
                  <img 
                    src={ticket.qrCode} 
                    alt="QR Code de Acesso" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Ticket Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dashboard-dark/50 rounded-xl">
                  <div>
                    <Label className="text-sm text-muted-foreground">Código do Ticket</Label>
                    <p className="font-mono text-lg text-satotrack-neon font-bold">{ticket.code}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(ticket.code)}
                    className="text-satotrack-neon hover:bg-satotrack-neon/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dashboard-dark/50 rounded-xl">
                  <div>
                    <Label className="text-sm text-muted-foreground">Email/Telefone</Label>
                    <p className="text-white">{ticket.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-dashboard-dark/50 rounded-xl">
                  <div>
                    <Label className="text-sm text-muted-foreground">Expira em</Label>
                    <p className="text-white">{ticket.expiresAt.toLocaleDateString()} às {ticket.expiresAt.toLocaleTimeString()}</p>
                  </div>
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                    24 horas
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                  onClick={() => {
                    sessionStorage.setItem('ticket_email', email || phone);
                    sessionStorage.setItem('ticket_code', ticket.code);
                    window.location.href = '/auth?mode=signup&ticket=' + ticket.code;
                  }}
                >
                  🚀 Ativar Conta Completa
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => {
                    // Criar sessão guest temporária
                    const guestSession = {
                      id: `guest_${Date.now()}`,
                      type: 'guest',
                      accessLevel: 'read_only',
                      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
                      generatedAt: new Date()
                    };
                    localStorage.setItem('guest_session', JSON.stringify(guestSession));
                    window.location.href = '/dashboard?mode=guest';
                  }}
                >
                  👁️ Acessar como Visitante (1h)
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
                  onClick={() => setTicket(null)}
                >
                  Gerar Novo Ticket
                </Button>
              </div>

              {/* Info */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  💡 <strong>Dica:</strong> Salve este código ou tire um print da tela. 
                  Você precisará dele para ativar sua conta.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-satotrack-neon/20 rounded-full">
              <Ticket className="h-12 w-12 text-satotrack-neon" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Criar Ticket de Acesso
          </h2>
          <p className="text-muted-foreground">
            Gere seu ticket gratuito para acessar a plataforma SatoTrack
          </p>
        </div>

        <Card className="bg-dashboard-medium/50 border-satotrack-neon/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {/* Contact Method Selector */}
            <div className="flex gap-2 p-1 bg-dashboard-dark/50 rounded-lg">
              <Button
                variant={contactMethod === 'email' ? 'default' : 'ghost'}
                className={`flex-1 ${contactMethod === 'email' ? 'bg-satotrack-neon text-black' : 'text-white hover:bg-satotrack-neon/10'}`}
                onClick={() => setContactMethod('email')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant={contactMethod === 'phone' ? 'default' : 'ghost'}
                className={`flex-1 ${contactMethod === 'phone' ? 'bg-satotrack-neon text-black' : 'text-white hover:bg-satotrack-neon/10'}`}
                onClick={() => setContactMethod('phone')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Telefone
              </Button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {contactMethod === 'email' ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Seu melhor email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-dashboard-dark/50 border-satotrack-neon/30 focus:border-satotrack-neon"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone">Seu telefone/WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+55 (11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-dashboard-dark/50 border-satotrack-neon/30 focus:border-satotrack-neon"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={generateTicket}
              disabled={isGenerating}
              className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90 py-6 text-lg font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Gerando Ticket...
                </>
              ) : (
                <>
                  <QrCode className="h-5 w-5 mr-2" />
                  Gerar Ticket de Acesso
                </>
              )}
            </Button>

            <div className="p-4 bg-satotrack-neon/10 border border-satotrack-neon/20 rounded-xl">
              <p className="text-sm text-satotrack-neon">
                🔒 <strong>Seguro e Gratuito:</strong> Seu ticket será válido por 24 horas e 
                permitirá acesso completo à plataforma.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TicketAccessSection;