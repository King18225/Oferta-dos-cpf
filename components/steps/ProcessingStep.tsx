
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from 'lucide-react';

interface ProcessingStepProps {
  onComplete: () => void;
}

const loadingMessages = [
  { text: "Estabelecendo conexão segura...", duration: 500, progress: 10 },
  { text: "Analisando seu CPF...", duration: 500, progress: 30 },
  { text: "Consultando base de dados da Receita Federal...", duration: 500, progress: 50 },
  { text: "Cruzando dados com CadÚnico...", duration: 500, progress: 75 },
  { text: "Verificando benefícios disponíveis...", duration: 500, progress: 90 },
  { text: "Quase lá! Finalizando...", duration: 500, progress: 100 },
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
    <div className="w-full max-w-md mx-auto text-center p-4 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-lg shadow-xl w-full">
        <Image
          src="https://i.imgur.com/MLJKIv0.jpeg"
          alt="Logo GOV.BR"
          width={64}
          height={64}
          className="mx-auto mb-6 rounded-full"
          priority
        />

        <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
          Analisando seu CPF
        </h2>
        
        <Progress value={progress} className="w-full h-3 mb-2 bg-muted" indicatorClassName="bg-accent h-3" />
        
        <p className="text-2xl font-bold text-accent text-center mb-4">
          {progress}%
        </p>
        
        <p className="text-sm text-muted-foreground text-center mb-6 h-5">
          {currentMessageIndex < loadingMessages.length ? loadingMessages[currentMessageIndex].text : "Consulta concluída!"}
        </p>

        {allStepsComplete && (
           <CheckCircle className="h-12 w-12 text-accent mx-auto mb-6 animate-pulse" />
        )}

        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
            Conexão segura
          </span>
          <span className="flex items-center">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-500"></span>
            Dados criptografados
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStep;
