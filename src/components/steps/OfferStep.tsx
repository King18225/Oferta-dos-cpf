
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, TrendingUp, Zap, AlertTriangle, ShieldCheck, Check, Star } from 'lucide-react';

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
    text: "Finalmente algo que funciona! R$1200 na conta em MINUTOS. A taxa de R$47,90 é NADA perto disso. SALVOU MEU MÊS!",
    stars: 5,
    photoUrl: "https://placehold.co/48x48.png",
  },
  {
    name: "J. SILVA",
    location: "Interior de SP",
    text: "Estava desconfiado, mas arrisquei. Valeu CADA CENTAVO dos R$47,90! Grana extra na mão quando MAIS PRECISEI. Indico DEMAIS!",
    stars: 5,
    photoUrl: "https://placehold.co/48x48.png",
  },
  {
    name: "ANA P.",
    location: "Salvador/BA",
    text: "Rápido e fácil. Paguei os R$47,90 no PIX e o benefício caiu rapidinho. Plataforma simples de usar, direto pelo celular.",
    stars: 5,
    photoUrl: "https://placehold.co/48x48.png",
  },
];

const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [peopleServed, setPeopleServed] = useState(1423);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fakeTestimonialsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleServed(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const handleLiberarAcessoClick = () => {
    console.log("LIBERAR ACESSO IMEDIATO AGORA clicado! CPF:", cpf, "Redirect to R$47,90 checkout.");
    alert("Simulando redirecionamento para pagamento da taxa de R$47,90...");
  };

  const formattedCpf = cpf ? `***.${cpf.substring(4, 7)}.${cpf.substring(8, 11)}-**` : '***.***.***-**';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-4 md:px-6 md:pb-6 bg-background text-foreground pt-0">
      <Image
        src="https://user-images.githubusercontent.com/16915938/294723461-d356b2a0-7d19-4f1d-9f23-3774f40775e0.png"
        alt="gov.br logo oficial"
        width={80} 
        height={80} 
        data-ai-hint="government logo"
        className="mb-3 shadow-sm" 
      />

      <Card className="border-primary shadow-2xl rounded-lg overflow-hidden">
        <CardContent className="p-4 md:p-6 space-y-5">
          <div className="text-center">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-2">
              <span className="text-destructive">⚠️ SEU CPF FOI SELECIONADO!</span> <br/>Benefícios <strong className="text-accent">LIBERADOS</strong> para o CPF: {formattedCpf}
            </h2>
            
            <ul className="space-y-2 text-left text-sm md:text-base max-w-md mx-auto bg-secondary/20 p-4 rounded-lg border border-primary/30 shadow">
              {[
                { text: "**SAQUE IMEDIATO:** R$1.200,00 direto na sua conta HOJE!", original: "Liberação Imediata de R$ 1.200,00 em sua conta." },
                { text: "**ACESSO VIP:** Plataforma Exclusiva (Valor R$197,00 - <span class='text-accent font-bold'>INCLUSO HOJE</span>)", original: "Acesso à Plataforma VIP de Consultas Financeiras." },
                { text: "**SUPORTE PRIORITÁRIO 24h:** Atendimento VIP via WhatsApp.", original: "Suporte Prioritário 24/7 via WhatsApp." },
                { text: "**BÔNUS EXCLUSIVO:** Análise de Crédito Completa (SPC/Serasa).", original: "Relatório de Crédito Detalhado (SPC/Serasa)." },
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-accent mr-2 mt-0.5 shrink-0" />
                  <span className="font-medium" dangerouslySetInnerHTML={{ __html: benefit.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-foreground/90">$1</strong>') }} />
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-destructive text-destructive-foreground p-3 sm:p-4 rounded-lg border-2 border-red-800 text-center shadow-xl">
            <div className="flex flex-wrap items-center justify-center text-center font-bold text-md sm:text-lg md:text-xl mb-1">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5 sm:mr-2 animate-ping" />
              <span className="text-sm sm:text-base md:text-lg mr-1">ÚLTIMA CHANCE: SEU ACESSO EXPIRA EM:</span> <OfferTimer initialMinutes={5} initialSeconds={27} />
            </div>
            <p className="text-xs sm:text-sm md:text-md font-semibold uppercase">RISCO DE PERDA IMINENTE DO BENEFÍCIO!</p>
          </div>

          <div className="text-center p-4 md:p-6 bg-secondary/30 rounded-xl shadow-lg border-2 border-accent">
            <h3 className="font-headline text-lg md:text-xl font-bold text-primary-foreground mb-1 uppercase">Taxa ÚNICA de Liberação do Sistema</h3>
            <p className="text-5xl md:text-7xl font-bold text-accent mb-1">
              R$ 47<span className="text-3xl md:text-5xl align-top">,90</span>
            </p>
            <p className="text-muted-foreground line-through text-xl md:text-2xl mb-2">DE <span className="font-semibold">R$197,00</span></p>
            <p className="text-sm md:text-md text-primary-foreground/80 max-w-lg mx-auto">
              Pague <strong className="text-accent">somente esta taxa administrativa HOJE</strong> para custos de processamento e consulta segura. <strong class="text-accent">Liberação instantânea dos seus R$1.200,00 GARANTIDA!</strong>
            </p>
          </div>

          <Button
            className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold bg-green-500 text-white hover:bg-green-600 shadow-xl animate-pulse transform hover:scale-105 transition-transform duration-150 ease-out"
            onClick={handleLiberarAcessoClick}
          >
            <svg className="mr-2 h-7 md:h-8 w-7 md:h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M10.5 2.25a.75.75 0 00-1.5 0v2.385c0 .46.17.903.488 1.241l2.012 2.262a.75.75 0 001.138-.954L10.5 4.865V2.25zm0 0V.938A24.243 24.243 0 008.043 2.03a.75.75 0 000 1.458A22.742 22.742 0 0110.5 2.25zm3.998 1.03L17.32 2.03a.75.75 0 10-.936-1.158l-2.82 2.273a.75.75 0 00.936 1.158zM10.5 6a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM6.75 10.5a3.75 3.75 0 107.5 0 3.75 3.75 0 00-7.5 0zM13.5 2.25V.938a24.243 24.243 0 012.457-1.108.75.75 0 01.936 1.158 22.742 22.742 0 00-2.457 1.109V2.25a.75.75 0 01-1.5 0v-2.385a.75.75 0 01.41-1.302 24.041 24.041 0 014.367 1.013.75.75 0 01.59 1.338 22.542 22.542 0 00-4.43 3.837.75.75 0 01-1.336-.62V2.25z"></path>
              <path d="M3.187 10.193A23.952 23.952 0 001.75 12.52a.75.75 0 000 1.462A23.952 23.952 0 003.187 15.81a.75.75 0 10.625-1.336 22.452 22.452 0 01-1.326-2.458.75.75 0 00-.625-1.336zm16.937-1.336a.75.75 0 00-.625 1.336 22.452 22.452 0 01-1.326 2.458.75.75 0 10.625 1.336 23.952 23.952 0 001.437-2.326.75.75 0 000-1.462 23.952 23.952 0 00-1.437-2.326z"></path>
              <path clipRule="evenodd" fillRule="evenodd" d="M12.277 19.36a.75.75 0 01.488-.292V17.25a.75.75 0 00-1.5 0v1.818c0 .23.086.448.238.62l1.142.976a.75.75 0 10.96-1.128l-.828-.706zM12 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-4.5 1.5a.75.75 0 000 1.5A1.5 1.5 0 009 15a.75.75 0 000-1.5H7.5zm6-1.5a.75.75 0 01.75.75c0 .414-.336.75-.75.75A.75.75 0 0112.75 12a.75.75 0 01.75-.75zm-3.75.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9.75z"></path>
            </svg>
            <span className="uppercase">SIM! Quero Liberar Meus R$1.200 Agora! (PIX)</span>
          </Button>
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-1 text-green-600" /> Pagamento 100% Seguro via PIX. Seus dados estão protegidos.
          </div>

          <div className="my-6 md:my-8">
            <h3 className="font-headline text-xl md:text-2xl font-bold text-primary text-center mb-5 uppercase">
              Pessoas Reais, Resultados <span className="text-accent">REAIS</span>!
            </h3>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-muted/40 border-secondary shadow-lg rounded-lg">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start">
                        {testimonial.photoUrl && (
                            <Image
                            src={testimonial.photoUrl}
                            alt={`Foto de ${testimonial.name}`}
                            width={48}
                            height={48}
                            data-ai-hint="person avatar"
                            className="rounded-full mr-4 border-2 border-accent shadow-md"
                            />
                        )}
                        <div className="flex-1">
                            <div className="flex items-center mb-1.5">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-0.5" />
                                ))}
                                <Check className="h-5 w-5 text-green-500 ml-auto mr-1" /> <span className="text-xs text-green-600 font-semibold uppercase">Verificado</span>
                            </div>
                            <p className="text-md md:text-lg text-foreground italic leading-tight">"{testimonial.text}"</p>
                            <p className="text-sm text-muted-foreground mt-2 font-semibold">- {testimonial.name}, {testimonial.location}</p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center p-5 bg-primary text-primary-foreground rounded-lg shadow-xl">
              <TrendingUp className="h-10 md:h-12 w-10 md:h-12 mx-auto mb-2 text-yellow-300" />
              <p className="text-4xl md:text-5xl font-bold">{peopleServed.toLocaleString('pt-BR')}</p>
              <p className="text-md md:text-lg font-semibold uppercase">Benefícios Liberados HOJE</p>
            </div>
          </div>
            <p className="text-xs text-muted-foreground/70 text-center mt-6 px-2">
                Este sistema realiza consultas públicas automáticas com base em dados fornecidos pelo usuário e fontes abertas.
                Não possuímos nenhum vínculo direto com o governo federal ou qualquer entidade governamental.
                As informações apresentadas são para fins ilustrativos e de demonstração de capacidade de consulta.
                O uso desta plataforma implica na aceitação destes termos. Pagamento único referente à taxa de serviço para acesso ao sistema.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferStep;
