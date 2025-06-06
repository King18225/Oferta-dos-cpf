
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OfferStepProps {
  cpf: string | null;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  photoUrl?: string;
  dataAiHint?: string;
}

const fakeTestimonialsData: Testimonial[] = [
  {
    name: "MARIA S.",
    location: "Fortaleza/CE",
    text: "Paguei a taxa de R$47,90 com o <strong>CU NA MÃO</strong>, mas para minha surpresa... <strong>CAIU NA HORA!</strong> R$1.200,00 limpos na conta! Essa grana <strong>SALVOU MEU MÊS E MINHA VIDA!</strong> Simplesmente <strong>FODAA!</strong>",
    photoUrl: "https://placehold.co/56x56.png",
    dataAiHint: "person avatar"
  },
  {
    name: "J. COSTA",
    location: "Interior de MG",
    text: "No começo, achei que era <strong>ENGANAÇÃO TOTAL</strong>, mas arrisquei os R$47,90. Qual não foi minha surpresa quando vi o PIX de <strong>R$1.200,00 CAIR NA CONTA em MINUTOS!</strong> Dinheiro extra que <strong>ME TIROU DO SUFOCO!</strong> Recomendo DEMAIS!",
    photoUrl: "https://placehold.co/56x56.png",
    dataAiHint: "person avatar"
  },
  {
    name: "ANA P.",
    location: "Salvador/BA",
    text: "Confesso que tremi na base pra pagar a taxa, achei que ia <strong>PERDER MEU DINHEIRINHO SUADO</strong>. Mas a necessidade falou mais alto. E não é que o negócio <strong>FUNCIONA MESMO?!</strong> R$1.200,00 liberados rapidinho! <strong>MELHOR INVESTIMENTO</strong> que fiz esse ano!",
    photoUrl: "https://placehold.co/56x56.png",
    dataAiHint: "person avatar"
  },
];


const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(2402);
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
        text: "Paguei a taxa com <strong>medo</strong>, mas valeu! R$1.200 na conta <strong>rapidinho</strong>. Funciona DE VERDADE!",
        photoUrl: "https://placehold.co/56x56.png",
        dataAiHint: "person avatar"
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
    alert("🚨 ATENÇÃO: Você será redirecionado para o pagamento SEGURO da taxa administrativa de R$47,90. Liberação dos R$1.200,00 IMEDIATA após confirmação do PIX!");
  };

  const formattedCpf = cpf ? `***.${cpf.substring(4, 7)}.${cpf.substring(8, 11)}-**` : '***.***.***-**';

  return (
    <div className="w-full max-w-2xl mx-auto px-0 pb-4 md:px-0 md:pb-6 bg-background text-foreground pt-0">
      {/* SEÇÃO SUPERIOR (CABEÇALHO) */}
      <div className="bg-gray-50 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] p-3 mb-6 flex items-center justify-between rounded-sm sticky top-0 z-50">
        <Image src="https://i.imgur.com/SQWMv5D.png" alt="gov.br logo" width={120} height={40} data-ai-hint="government logo" className="h-auto" />
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse animation-delay-0"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse animation-delay-150"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse animation-delay-300"></span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm">Procurando um atendente disponível para você...</p>
        </div>
      </div>

      {/* SEÇÃO DE OFERTA PRINCIPAL (Card Principal) */}
      <div className="bg-card rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.1)] p-4 md:p-6 space-y-6">
        
        <div className="text-center">
           <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-2 uppercase">
            <span className="text-destructive">🔥 ALERTA MÁXIMO, CPF {formattedCpf}!</span><br/>SEU SAQUE DE <strong className="text-accent text-4xl md:text-5xl">R$1.200,00</strong> FOI LIBERADO AGORA!
          </h2>
          
          <ul className="space-y-2 text-left text-sm md:text-base max-w-md mx-auto bg-secondary/20 p-4 rounded-lg border border-primary/30 shadow">
            {[
              { text: "<strong class='text-primary'>SAQUE IMEDIATO EM 5 MINUTOS:</strong> <span class='text-accent font-bold text-lg'>R$1.200,00</span> direto na sua conta Chave PIX <strong class='underline text-accent'>AGORA MESMO!</strong>" },
              { text: "<strong class='text-primary'>ACESSO VIP GOV+ EXCLUSIVO:</strong> Plataforma Secreta de Benefícios (Valor R$297,00 - <span class='text-accent font-bold'>HOJE GRÁTIS</span>)" },
              { text: "<strong class='text-primary'>SUPORTE PREMIUM RELÂMPAGO 24/7:</strong> Atendimento VIP WhatsApp <span class='italic text-primary'>Ultra Rápido</span> e Prioritário para VOCÊ!" },
              { text: "<strong class='text-primary'>BÔNUS SECRETO HOJE:</strong> Guia Exclusivo 'Nome Limpo em 7 Dias' (SPC/Serasa Destravado)!" },
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: benefit.text }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Área de Urgência */}
        <div className="bg-destructive/10 text-destructive-foreground p-3 sm:p-4 rounded-lg border-2 border-destructive text-center shadow-xl">
          <div className="flex flex-wrap items-center justify-center text-center font-bold text-md sm:text-lg md:text-xl mb-2">
            <span className="text-destructive text-3xl mr-2">⏰</span>
            <span className="text-destructive uppercase">CORRE! SEU TEMPO TÁ ACABANDO!</span>
          </div>
          <div className="text-center my-2">
             <OfferTimer initialMinutes={4} initialSeconds={31} />
          </div>
          <p className="text-destructive text-sm sm:text-md md:text-lg font-bold uppercase leading-tight">
            Atenção: <span className="text-2xl md:text-3xl underline">NÃO SEJA BURRO!</span><br/> Se você não sacar <strong className="text-yellow-300">AGORA</strong>, seus <strong className="text-yellow-300">R$1.200,00</strong> serão <strong className="text-yellow-300">CANCELADOS</strong> e <strong className="text-yellow-300">PERDIDOS PARA SEMPRE</strong> às 23:59 de <strong className="text-yellow-300">HOJE!</strong><br/> Não tem choro nem vela, <strong className="text-yellow-300 text-xl">É AGORA OU NUNCA!</strong>
          </p>
        </div>

        {/* Seção de Preço */}
        <div className="text-center p-4 md:p-6 bg-primary/10 rounded-xl shadow-lg border-2 border-accent ring-2 ring-accent/50">
          <h3 className="font-headline text-xl md:text-2xl font-bold text-primary mb-1 uppercase">
            💸 ÚNICA TAXA DE ACESSO!
          </h3>
          <p className="text-muted-foreground line-through text-2xl md:text-3xl mb-0">DE R$297,00</p>
          <p className="text-7xl md:text-8xl font-extrabold text-accent mb-1">
            R$47<span className="text-5xl md:text-6xl align-top">,90</span>
          </p>
          <p className="text-lg md:text-xl font-bold text-primary mb-2 uppercase">(VOCÊ ACABA DE ECONOMIZAR R$249,10 HOJE!)</p>
          <p className="text-sm md:text-md text-foreground/90 max-w-lg mx-auto">
            <strong>IMPORTANTE:</strong> Pague <strong>SOMENTE AGORA</strong> esta taxa para cobrir os custos de <strong>processamento SEGURO</strong> e <strong>liberação automática</strong> dos seus R$1.200,00 via PIX! <strong className="text-accent underline">SAQUE GARANTIDO IMEDIATAMENTE APÓS O PIX!</strong>
          </p>
        </div>

        <Button
          className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl animate-bounce transform hover:scale-105 transition-transform duration-150 ease-out ring-4 ring-green-300 hover:ring-green-400"
          onClick={handleLiberarAcessoClick}
        >
          <span className="mr-2 text-3xl">👉</span>
          <span className="uppercase">SIM! EU QUERO MEUS R$1.200,00 AGORA! (VIA PIX)!</span>
        </Button>
        <div className="text-center text-xs text-muted-foreground flex items-center justify-center">
          <ShieldCheck className="h-4 w-4 mr-1 text-green-600" /> Pagamento 100% SEGURO e Criptografado! Processado por AppMax.
        </div>
        
        {/* SEÇÃO DE PROVA SOCIAL */}
        <div className="my-6 md:my-8">
          <h3 className="font-headline text-xl md:text-2xl font-bold text-primary text-center mb-5 uppercase">
            👀 COMUNIDADE SAQUE RÁPIDO: VEJA QUEM JÁ <span className="text-accent underline">ENCHEU O BOLSO</span> HOJE!
          </h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-muted/30 border-secondary shadow-md rounded-lg hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start">
                      {testimonial.photoUrl && (
                          <Image
                          src={testimonial.photoUrl}
                          alt={`Foto de ${testimonial.name}`}
                          width={56} 
                          height={56}
                          data-ai-hint={testimonial.dataAiHint || "person avatar"}
                          className="rounded-full mr-4 border-2 border-accent shadow-md"
                          />
                      )}
                      <div className="flex-1">
                          <p className="font-headline text-lg font-semibold text-primary mb-1">🔥 SAQUE CONFIRMADO!</p>
                          <p className="text-sm md:text-base text-foreground italic leading-tight" dangerouslySetInnerHTML={{ __html: testimonial.text }} />
                          <p className="text-sm text-muted-foreground mt-2 font-bold">- {testimonial.name}, {testimonial.location}</p>
                          <p className="text-xs text-green-600 font-semibold mt-1">(VERIFICADO AGORA ✅)</p>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center p-5 bg-primary text-primary-foreground rounded-lg shadow-xl border-2 border-yellow-300">
            <TrendingUp className="h-10 md:h-12 w-10 md:h-12 mx-auto mb-2 text-yellow-300 animate-pulse" />
            <p className="text-5xl md:text-6xl font-bold text-yellow-300">{peopleServed.toLocaleString('pt-BR')}</p>
            <p className="text-md md:text-lg font-semibold uppercase">📈 BRASILEIROS JÁ SACARAM SÓ HOJE! <span className="text-yellow-300">NÃO FIQUE PRA TRÁS, SEU LERDO!</span></p>
          </div>
        </div>
          <p className="text-xs text-muted-foreground/70 text-center mt-6 px-2">
              Taxa única de serviço (R$47,90) para acesso ao sistema GOV+ e processamento seguro da consulta. Valor promocional válido apenas hoje até 23:59.
              Este sistema realiza consultas em bases de dados públicas e privadas de forma automatizada. Não possuímos vínculo direto com o governo federal ou programas sociais específicos.
              Renda Expressa &copy; {new Date().getFullYear()} - Todos os direitos (não tão) reservados. CNPJ: XX.XXX.XXX/0001-XX. 
              <a href="#" className="underline hover:text-primary">Termos de Uso</a>. <a href="#" className="underline hover:text-primary">Política de Privacidade</a>.
          </p>
      </div>
    </div>
  );
};

export default OfferStep;

// Helper style for staggered animation if needed, not directly used by Tailwind animate-pulse default
// Add to globals.css if you want to use custom animation delays for the dots
/*
.animation-delay-0 { animation-delay: 0s; }
.animation-delay-150 { animation-delay: 0.15s; }
.animation-delay-300 { animation-delay: 0.3s; }
*/
