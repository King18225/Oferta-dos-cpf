
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Users, ShieldCheckIcon, PartyPopper } from 'lucide-react';

interface OfferStepProps {
  cpf: string | null; 
}

const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [viewers, setViewers] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) +1) ));
    }, 2500); // Update every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl text-center p-6 md:p-8 bg-card shadow-2xl rounded-lg border-2 border-accent">
      <PartyPopper className="h-16 w-16 text-accent mx-auto mb-4" />
      <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-3">
        SEU CPF TEM ELEGIBILIDADE CONFIRMADA!
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        Acesso liberado para:
      </p>

      <ul className="space-y-3 text-left mb-8 max-w-md mx-auto">
        <li className="flex items-center text-md text-foreground">
          <CheckCircle className="h-6 w-6 mr-3 text-accent flex-shrink-0" />
          Programa Auxílio Brasil (R$1200/mês)
        </li>
        <li className="flex items-center text-md text-foreground">
          <CheckCircle className="h-6 w-6 mr-3 text-accent flex-shrink-0" />
          Tarifa Social de Energia
        </li>
        <li className="flex items-center text-md text-foreground">
          <CheckCircle className="h-6 w-6 mr-3 text-accent flex-shrink-0" />
          Vale-Gás Federal
        </li>
      </ul>

      <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
        <div className="flex items-center justify-center text-destructive font-semibold text-lg mb-1">
          <AlertTriangle className="h-6 w-6 mr-2" />
          Sua janela exclusiva expira em: <OfferTimer initialMinutes={4} initialSeconds={59} />
        </div>
      </div>
      
      <Button 
        className="w-full h-16 text-lg md:text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse mb-6"
        onClick={() => console.log("Garantir acesso clicado!")}
      >
        GARANTIR MEU ACESSO AOS BENEFÍCIOS POR R$7
      </Button>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-center text-muted-foreground">
          <Users className="h-5 w-5 mr-2 text-primary" />
          {viewers} pessoas estão visualizando esta oferta agora.
        </div>
        <div className="flex items-center justify-center text-primary font-semibold">
          <ShieldCheckIcon className="h-5 w-5 mr-2 text-accent" />
          Disponível apenas para CPFs aprovados
        </div>
      </div>
    </div>
  );
};

export default OfferStep;
