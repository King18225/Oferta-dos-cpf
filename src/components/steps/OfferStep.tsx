
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
     {
        nome: "Vale Estudante",
        valor: "R$ 1489/mês",
        icon: "🎓",
        descricao: "Apoio mensal para seus estudos!",
    },
];

const enrollmentSteps = [
  {
    title: "1. Verifique sua Elegibilidade",
    description: "Confirme se você atende aos critérios de idade, renda e demais requisitos do programa.",
    iconPlaceholder: "https://placehold.co/50x50.png",
    iconHint: "clipboard check",
  },
  {
    title: "2. Realize seu Cadastro",
    description: "Preencha o formulário online com seus dados pessoais e de contato de forma segura.",
    iconPlaceholder: "https://placehold.co/50x50.png",
    iconHint: "form input",
  },
  {
    title: "3. Acompanhe sua Solicitação",
    description: "Após a submissão, você poderá acompanhar o status da sua inscrição diretamente na plataforma.",
    iconPlaceholder: "https://placehold.co/50x50.png",
    iconHint: "progress status",
  },
];


const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(2402);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fakeTestimonialsData);
  const enrollmentSectionRef = useRef<HTMLDivElement>(null);

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
  
  const handleStartRegistration = () => {
    setTimeout(() => {
      console.log("Iniciar Minha Inscrição Agora clicado! CPF:", cpf);
      alert("Você será redirecionado para a plataforma de cadastro oficial do Governo Federal.");
      window.location.href = "https://gov.br/inscricao-jovem-cidadao"; // Example placeholder URL
    }, 100);
  };
  
  const handleEligibilityCheckClick = () => {
    enrollmentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formattedCpf = cpf || '***.***.***-**';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 bg-background text-foreground">
        
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
        <div className="text-center py-[50px] px-[20px] bg-[#0056b3] rounded-lg font-[Arial,sans-serif]">
          <h2 className="text-[2.2em] text-white mb-[20px] font-bold">
            Pronto para dar o Próximo Passo?
          </h2>
          <p className="text-[1.2em] text-white max-w-[700px] mx-auto mb-[30px]">
            Descubra se você se qualifica para os benefícios do Programa Jovem Cidadão Ativo e inicie sua jornada. Todo o processo é seguro, transparente e realizado via plataforma oficial do Governo Federal.
          </p>
          <Button
            onClick={handleEligibilityCheckClick}
            className="bg-[#ffc107] text-[#003366] py-[18px] px-[40px] text-[1.6em] font-bold border-none rounded-[10px] cursor-pointer transition-colors duration-300 ease-linear hover:bg-[#e0a800] no-underline h-auto"
          >
            Verificar Minha Elegibilidade Agora
          </Button>
          <p className="text-[0.9em] mt-[20px] text-[rgba(255,255,255,0.8)]">
            Sua segurança e privacidade são prioridade.
          </p>
        </div>
          
        {/* Nova Seção de Processo de Inscrição */}
        <div ref={enrollmentSectionRef} className="py-[60px] px-[20px] bg-[#f8f9fa] text-center font-[Arial,sans-serif]">
          <h2 className="text-[2.5em] text-[#003366] mb-[40px] font-bold font-headline">
            Como Participar do Programa Jovem Cidadão Ativo
          </h2>
          <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[30px]">
            {enrollmentSteps.map((step, index) => (
              <div key={index} className="bg-white p-[30px] rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.05)] text-left">
                <Image
                  src={step.iconPlaceholder}
                  alt={`Ícone para ${step.title}`}
                  width={50}
                  height={50}
                  data-ai-hint={step.iconHint}
                  className="mb-[15px]"
                />
                <h3 className="text-[1.6em] text-[#0056b3] mb-[10px] font-bold font-headline">{step.title}</h3>
                <p className="text-[1.1em] text-[#555]">{step.description}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={handleStartRegistration}
            className="bg-[#28a745] text-white py-[18px] px-[40px] text-[1.6em] font-bold border-none rounded-[10px] cursor-pointer mt-[50px] transition-colors duration-300 ease-linear hover:bg-[#218838] h-auto"
          >
            Iniciar Minha Inscrição Agora
          </Button>
          <p className="text-[0.9em] text-[#666] mt-[30px]">
            <span className="font-bold text-[#003366]">Ambiente Seguro e Oficial do Governo Federal.</span> Sua privacidade é nossa prioridade.
          </p>
        </div>
        
        {/* SEÇÃO DE PROVA SOCIAL */}
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
    
    

    

    

    

    







