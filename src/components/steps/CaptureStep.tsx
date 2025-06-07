
"use client";

import type React from 'react';
import CpfForm from '@/components/features/CpfForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Landmark, Smartphone, Cloud, Moon, Globe, CreditCard } from 'lucide-react';

interface CaptureStepProps {
  onSubmitSuccess: (cpf: string) => void;
}

const GovBrLogo: React.FC = () => (
  <svg viewBox="0 0 150 48" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto" aria-label="gov.br logo">
    <text x="75" y="37" style={{ fontFamily: "'Nunito', Arial, Helvetica, sans-serif", fontSize: "40px", fontWeight: "bold", textAnchor: "middle" }}>
      <tspan style={{ fill: "#0059A4" }}>g</tspan>
      <tspan style={{ fill: "#FFCC29" }}>o</tspan>
      <tspan style={{ fill: "#009B3A" }}>v</tspan>
      <tspan style={{ fill: "#009B3A" }}>.</tspan>
      <tspan style={{ fill: "#0059A4" }}>b</tspan>
      <tspan style={{ fill: "#FFCC29" }}>r</tspan>
    </text>
  </svg>
);

const CaptureStep: React.FC<CaptureStepProps> = ({ onSubmitSuccess }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-6 bg-background text-foreground">
      <header className="flex justify-between items-center mb-10">
        <GovBrLogo />
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="ghost" size="icon" aria-label="Mudar tema" className="h-9 w-9 sm:h-10 sm:w-10">
            <Moon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Mudar idioma" className="h-9 w-9 sm:h-10 sm:w-10">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main>
        <p className="text-xl font-semibold text-foreground mb-6">Identifique-se no gov.br com:</p>
        
        <div className="flex items-center space-x-3 p-3 mb-4">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="font-medium text-primary">Número do CPF</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Digite seu CPF para <strong className="text-foreground font-semibold">criar</strong> ou <strong className="text-foreground font-semibold">acessar</strong> sua conta gov.br
        </p>

        <CpfForm onSubmitSuccess={onSubmitSuccess} />

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-md font-semibold text-foreground mb-4">Outras opções de identificação:</p>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start p-3 text-base text-foreground hover:bg-secondary/30 h-auto rounded-md">
              <Smartphone className="mr-3 h-5 w-5 text-primary shrink-0" />
              <span className="flex-grow text-left">Seu aplicativo gov.br</span>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 ml-2 shrink-0 text-xs px-1.5 py-0.5">NOVO</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-start p-3 text-base text-foreground hover:bg-secondary/30 h-auto rounded-md">
              <Landmark className="mr-3 h-5 w-5 text-primary shrink-0" />
              <span className="flex-grow text-left">Seu banco</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start p-3 text-base text-foreground hover:bg-secondary/30 h-auto rounded-md">
              <Cloud className="mr-3 h-5 w-5 text-primary shrink-0" />
              <span className="flex-grow text-left">Seu certificado digital em nuvem</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaptureStep;
