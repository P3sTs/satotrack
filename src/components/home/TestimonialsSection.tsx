import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  comment: string;
  verified: boolean;
  cryptos: string[];
}

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Trader',
      company: 'Crypto Investments',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b108?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment: 'A SatoTrack revolucionou minha forma de gerenciar criptomoedas. A segurança com KMS é impressionante e nunca tive problemas com transações.',
      verified: true,
      cryptos: ['BTC', 'ETH', 'SOL']
    },
    {
      id: 2,
      name: 'João Santos',
      role: 'Desenvolvedor',
      company: 'Tech Startup',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment: 'Interface intuitiva e segurança de nível empresarial. Finalmente uma plataforma que entende as necessidades de quem trabalha com crypto.',
      verified: true,
      cryptos: ['BTC', 'ETH', 'MATIC']
    },
    {
      id: 3,
      name: 'Ana Costa',
      role: 'Investidora',
      company: 'Portfolio Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment: 'O suporte a múltiplas redes é fantástico. Consigo gerenciar todos os meus ativos em um só lugar, com transparência total nas operações.',
      verified: true,
      cryptos: ['BTC', 'ETH', 'SOL', 'MATIC']
    },
    {
      id: 4,
      name: 'Pedro Oliveira',
      role: 'Empresário',
      company: 'Digital Commerce',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment: 'Excelente para pagamentos empresariais. A aprovação multi-fator me dá tranquilidade para transações de alto valor.',
      verified: true,
      cryptos: ['BTC', 'USDT', 'ETH']
    },
    {
      id: 5,
      name: 'Carla Mendes',
      role: 'Consultora Financeira',
      company: 'Wealth Management',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment: 'Recomendo para todos os meus clientes. A conversão automática para BRL facilita muito o acompanhamento dos investimentos.',
      verified: true,
      cryptos: ['BTC', 'ETH', 'SOL']
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            O que nossos <span className="satotrack-gradient-text">usuários</span> dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Milhares de pessoas já confiam na SatoTrack para gerenciar seus criptoativos com segurança
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <Card className="bg-gradient-to-br from-dashboard-medium via-dashboard-dark to-dashboard-medium border-satotrack-neon/30 max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left - User Info */}
                <div className="text-center lg:text-left">
                  <Avatar className="w-24 h-24 mx-auto lg:mx-0 mb-4 border-4 border-satotrack-neon/30">
                    <AvatarImage 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].name} 
                    />
                    <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon text-xl font-bold">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-white flex items-center justify-center lg:justify-start gap-2">
                      {testimonials[currentIndex].name}
                      {testimonials[currentIndex].verified && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          ✓ Verificado
                        </Badge>
                      )}
                    </h4>
                    <p className="text-satotrack-neon font-medium">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>

                  {/* Cryptos Used */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    {testimonials[currentIndex].cryptos.map((crypto) => (
                      <Badge 
                        key={crypto}
                        variant="outline" 
                        className="text-xs border-satotrack-neon/30 text-satotrack-neon bg-satotrack-neon/10"
                      >
                        {crypto}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right - Testimonial */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <div className="relative">
                    <Quote className="h-8 w-8 text-satotrack-neon/30 mb-4" />
                    <blockquote className="text-lg md:text-xl text-white leading-relaxed italic">
                      "{testimonials[currentIndex].comment}"
                    </blockquote>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-satotrack-neon scale-125' 
                      : 'bg-satotrack-neon/30 hover:bg-satotrack-neon/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              {isAutoPlaying ? '⏸️ Pausar' : '▶️ Reproduzir'} rotação automática
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-satotrack-neon mb-2">10,000+</div>
            <p className="text-muted-foreground">Usuários ativos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-satotrack-neon mb-2">R$ 50M+</div>
            <p className="text-muted-foreground">Transacionado</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-satotrack-neon mb-2">99.9%</div>
            <p className="text-muted-foreground">Uptime garantido</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;