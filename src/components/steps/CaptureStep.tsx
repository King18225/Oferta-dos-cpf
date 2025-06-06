
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import CpfForm from '@/components/features/CpfForm';
import { ShieldCheckIcon } from 'lucide-react';

interface CaptureStepProps {
  onSubmitSuccess: (cpf: string) => void;
}

const CaptureStep: React.FC<CaptureStepProps> = ({ onSubmitSuccess }) => {
  const [consultations, setConsultations] = useState(8742);

  useEffect(() => {
    const interval = setInterval(() => {
      setConsultations(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg text-center p-6 bg-card shadow-xl rounded-lg border border-primary/20">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-2">
        Verifique seus direitos em 30 segundos
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sistema integrado ao Ministério da Cidadania
      </p>
      
      <CpfForm onSubmitSuccess={onSubmitSuccess} buttonText="VERIFICAR AGORA" />

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-center text-md text-green-600 font-semibold">
          <ShieldCheckIcon className="h-6 w-6 mr-2 text-accent" />
          Consulta 100% Segura
        </div>
        <p className="text-sm text-muted-foreground">
          Hoje: <span className="font-bold text-primary">{consultations.toLocaleString('pt-BR')}</span> consultas realizadas
        </p>
      </div>
    </div>
  );
};

export default CaptureStep;
