
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, TrendingUp, Zap, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface OfferStepProps {
  cpf: string | null;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  stars: number;
}

const fakeTestimonialsData: Testimonial[] = [
  {
    name: "Maria S.",
    location: "Fortaleza, CE",
    text: "Deu certo! Nem acreditei, R$1200 na conta já! 🙌",
    stars: 5,
  },
  {
    name: "J. Silva",
    location: "Interior de SP",
    text: "Estava apertado esse mês, essa grana salvou! Taxa valeu a pena.",
    stars: 5,
  },
  {
    name: "Ana P.",
    location: "Salvador, BA",
    text: "Rápido e fácil. Consegui pelo celular mesmo. Recomendo!! 👍",
    stars: 4,
  },
];

const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(1387);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fakeTestimonialsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleServed(prev => prev + Math.floor(Math.random() * 5) + 2); // More aggressive increase
    }, 2500); // Faster update

    // Simulate new testimonials appearing periodically (optional, can make it complex)
    // For now, we'll stick to the static but updated list.

    return () => clearInterval(interval);
  }, []);

  const handleLiberarAcessoClick = () => {
    console.log("LIBERAR ACESSO IMEDIATO AGORA clicado! CPF:", cpf, "Redirect to R$47,90 checkout.");
    // window.location.href = 'YOUR_CHECKOUT_URL_HERE';
    alert("Simulando redirecionamento para pagamento da taxa de R$47,90...");
  };

  const formattedCpf = cpf ? `***.${cpf.substring(4, 7)}.${cpf.substring(8, 11)}-**` : '***.***.***-**';

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-background text-foreground">
      <Image
        src="https://i.imgur.com/oP20qzf.png"
        alt="gov.br logo oficial"
        width={65}
        height={65}
        data-ai-hint="government logo"
        className="mb-4 shadow-sm"
      />

      <Card className="border-primary shadow-2xl">
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="text-center">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-primary mb-1">
              <span className="text-destructive">⚠️ SEU CPF FOI SELECIONADO!</span>
            </h2>
            <p className="font-headline text-lg md:text-xl font-semibold text-primary mb-3">
              Benefícios de <strong className="text-accent">R$1.200,00</strong> LIBERADOS para o CPF: {formattedCpf}
            </p>
            <ul className="space-y-2 text-left text-sm md:text-base max-w-md mx-auto bg-secondary/30 p-3 rounded-md border border-secondary">
              {[
                { text: "**SAQUE IMEDIATO:** R$1.200,00 direto na sua conta.", original: "Liberação Imediata de R$ 1.200,00 em sua conta." },
                { text: "**ACESSO VIP:** Plataforma Exclusiva (Valor R$197,00 - Incluso HOJE)", original: "Acesso à Plataforma VIP de Consultas Financeiras." },
                { text: "**SUPORTE PRIORITÁRIO 24h:** Atendimento VIP via WhatsApp.", original: "Suporte Prioritário 24/7 via WhatsApp." },
                { text: "**BÔNUS EXCLUSIVO:** Análise de Crédito Completa (SPC/Serasa).", original: "Relatório de Crédito Detalhado (SPC/Serasa)." },
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: benefit.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-destructive text-destructive-foreground p-3 sm:p-4 rounded-lg border-2 border-red-700 text-center shadow-lg">
            <div className="flex flex-wrap items-center justify-center text-center font-bold text-sm sm:text-base md:text-lg mb-1">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 animate-ping" />
              ATENÇÃO: SEU ACESSO EXPIRA EM: <OfferTimer initialMinutes={5} initialSeconds={27} />
            </div>
            <p className="text-xs sm:text-sm font-semibold">RISCO DE PERDA IMINENTE DO BENEFÍCIO!</p>
          </div>

          <div className="text-center p-4 md:p-6 bg-secondary rounded-lg shadow-md border border-primary/30">
            <h3 className="font-headline text-md md:text-lg font-bold text-primary-foreground mb-2">TAXA ÚNICA DE SERVIÇO</h3>
            <p className="text-4xl md:text-6xl font-bold text-accent mb-1">
              R$ 47<span className="text-3xl md:text-5xl align-top">,90</span>
            </p>
            <p className="text-muted-foreground line-through text-lg md:text-xl mb-2">DE <span className="font-semibold">R$197,00</span></p>
            <p className="text-xs md:text-sm text-primary-foreground/90 max-w-md mx-auto">
              Taxa administrativa para custos de processamento e consulta segura. <strong className="text-accent">Liberação instantânea do seu benefício de R$1.200,00!</strong>
            </p>
          </div>

          <Button
            className="w-full h-16 md:h-20 text-lg md:text-2xl font-bold bg-accent text-accent-foreground hover:bg-accent/80 shadow-xl animate-pulse"
            onClick={handleLiberarAcessoClick}
          >
            <Zap className="mr-2 h-6 md:h-8 w-6 md:h-8" />
            SIM! QUERO LIBERAR MEUS R$1.200 AGORA! (PIX)
          </Button>
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-green-600" /> Pagamento 100% Seguro via PIX. Seus dados estão protegidos.
          </div>

          <div className="my-6 md:my-8">
            <h3 className="font-headline text-lg md:text-xl font-semibold text-primary text-center mb-4">VEJA QUEM JÁ RESGATOU HOJE:</h3>
            <div className="space-y-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-muted/30 border-secondary shadow-sm">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center mb-1">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current mr-0.5" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                      ))}
                       <Check className="h-4 w-4 text-green-500 ml-2 mr-1" /> <span className="text-xs text-green-600 font-semibold">Verificado</span>
                    </div>
                    <p className="text-sm md:text-base text-foreground italic">"{testimonial.text}"</p>
                    <p className="text-xs text-muted-foreground mt-2 font-semibold">- {testimonial.name}, {testimonial.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center p-4 bg-primary text-primary-foreground rounded-lg shadow-lg">
              <TrendingUp className="h-8 md:h-10 w-8 md:h-10 mx-auto mb-2 text-yellow-300" />
              <p className="text-3xl md:text-4xl font-bold">{peopleServed.toLocaleString('pt-BR')}</p>
              <p className="text-sm md:text-base font-semibold">BENEFÍCIOS LIBERADOS NAS ÚLTIMAS 24H</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferStep;

    