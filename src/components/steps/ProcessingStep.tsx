
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle } from 'lucide-react';
import UrgentHeader from '@/components/features/UrgentHeader';

interface ProcessingStepProps {
  onComplete: () => void;
}

const loadingMessages = [
  { text: "Conectando ao sistema seguro GOV.BR...", duration: 1500, progress: 20 },
  { text: "Validando seu CPF junto à Receita Federal...", duration: 2000, progress: 40 },
  { text: "Verificando elegibilidade para benefícios federais...", duration: 2500, progress: 60 },
  { text: "Cruzando dados com programas sociais ativos...", duration: 2000, progress: 80 },
  { text: "Consulta finalizada! Preparando seu relatório...", duration: 1500, progress: 100 },
];

const ProcessingStep: React.FC<ProcessingStepProps> = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [allStepsComplete, setAllStepsComplete] = useState(false);

  useEffect(() => {
    if (currentMessageIndex < loadingMessages.length) {
      const currentStep = loadingMessages[currentMessageIndex];
      setProgress(currentStep.progress);

      const timer = setTimeout(() => {
        setCurrentMessageIndex(prevIndex => prevIndex + 1);
      }, currentStep.duration);

      return () => clearTimeout(timer);
    } else {
      setAllStepsComplete(true);
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000); 
      return () => clearTimeout(finalTimer);
    }
  }, [currentMessageIndex, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto text-center p-4">
      <UrgentHeader />
      
      {/* Conteúdo do card anterior agora diretamente aqui */}
      <div className="mt-6 md:mt-8"> {/* Adicionando margem para separar do header */}
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
          Aguarde, estamos consultando seu CPF...
        </h2>
        
        <div className="my-8">
          {allStepsComplete ? (
            <CheckCircle className="h-16 w-16 text-accent mx-auto animate-pulse" />
          ) : (
            <Loader2 className="h-16 w-16 text-primary-foreground mx-auto animate-spin" />
          )}
        </div>

        <Progress value={progress} className="w-full h-4 mb-4 bg-secondary/70" indicatorClassName="bg-accent" />
        
        <p className="text-lg text-primary-foreground font-medium h-12 flex items-center justify-center">
          {currentMessageIndex < loadingMessages.length ? loadingMessages[currentMessageIndex].text : "Tudo pronto!"}
        </p>
        
        <p className="text-sm text-primary-foreground opacity-80 mt-6">
          Por favor, não feche ou atualize esta página. Sua consulta segura está em andamento.
        </p>
      </div>
    </div>
  );
};

export default ProcessingStep;
