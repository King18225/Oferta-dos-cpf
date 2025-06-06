
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';

interface ProcessingStepProps {
  onComplete: () => void;
}

const messages = [
  "Conectando ao SISBEN...",
  "Verificando elegibilidade...",
  "Cruzando dados com CadÚnico...",
  "Finalizando consulta..."
];

const ProcessingStep: React.FC<ProcessingStepProps> = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 2.5)); // ~3 seconds to reach 75 then jump
    }, 75); 

    let messageIdx = 0;
    const messageInterval = setInterval(() => {
      messageIdx++;
      if (messageIdx < messages.length) {
        setCurrentMessageIndex(messageIdx);
      } else {
        clearInterval(messageInterval);
      }
    }, 750); 

    const timer = setTimeout(() => {
      setProgress(100); // Ensure it hits 100 before completing
      setTimeout(onComplete, 500); // Brief pause at 100%
    }, 3000); 

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-md text-center p-8 bg-card shadow-xl rounded-lg border border-primary/20">
      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
      <h2 className="font-headline text-2xl font-semibold text-primary mb-4">
        Processando sua Solicitação
      </h2>
      <p className="text-muted-foreground mb-6 h-6">
        {messages[currentMessageIndex]}
      </p>
      <Progress value={progress} className="w-full h-3 mb-2" indicatorClassName="bg-accent" />
      <p className="text-sm text-accent font-medium">{Math.round(progress)}%</p>
    </div>
  );
};

export default ProcessingStep;
