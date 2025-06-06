
"use client";

import { useState, type FC } from 'react';
import CaptureStep from '@/components/steps/CaptureStep';
import ProcessingStep from '@/components/steps/ProcessingStep';
import OfferStep from '@/components/steps/OfferStep';
import ExitPopup from '@/components/features/ExitPopup';

export default function RendaExpressaPage() {
  const [currentStep, setCurrentStep] = useState<'capture' | 'processing' | 'offer'>('capture');
  const [userCpf, setUserCpf] = useState<string | null>(null);

  const handleCaptureSubmit = (cpf: string) => {
    setUserCpf(cpf);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentStep('offer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {currentStep === 'capture' && <CaptureStep onSubmitSuccess={handleCaptureSubmit} />}
        {currentStep === 'processing' && <ProcessingStep onComplete={handleProcessingComplete} />}
        {currentStep === 'offer' && <OfferStep cpf={userCpf} />}
      </main>

      {currentStep !== 'capture' && (
        <footer className="py-6 text-center">
          <p className="text-xs text-muted-foreground px-4">
            Este sistema realiza consultas públicas automáticas com base em dados fornecidos pelo usuário e fontes abertas.
            Não possuímos nenhum vínculo direto com o governo federal ou qualquer entidade governamental.
            As informações apresentadas são para fins ilustrativos e de demonstração de capacidade de consulta.
            O uso desta plataforma implica na aceitação destes termos.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Renda Expressa &copy; {new Date().getFullYear()} - Todos os direitos (não tão) reservados.
          </p>
        </footer>
      )}
      
      <ExitPopup />
    </div>
  );
}
