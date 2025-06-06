"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, CheckSquare } from 'lucide-react';

interface FakeSmsProps {
  cpfLastDigits?: string; // e.g., "456-78"
}

const FakeSms: FC<FakeSmsProps> = ({ cpfLastDigits }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [dynamicCpf, setDynamicCpf] = useState(" ***.***.XXX-XX ");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    
    if (cpfLastDigits) {
       setDynamicCpf(` ***.***.${cpfLastDigits.slice(0,3)}-${cpfLastDigits.slice(4,6)} `);
    } else {
      // Generate random last digits if not provided
      const randomPart1 = Math.floor(Math.random() * 900) + 100;
      const randomPart2 = Math.floor(Math.random() * 90) + 10;
      setDynamicCpf(` ***.***.${randomPart1}-${randomPart2} `);
    }

  }, [cpfLastDigits]);


  return (
    <Card className="my-8 shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary flex items-center">
          <CheckSquare className="mr-2 h-6 w-6 text-accent" /> Comprovante de Depósito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary p-4 rounded-lg shadow-inner">
          <div className="flex items-center mb-3">
            {/* Simplified Gov icon */}
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mr-3">
              GOV
            </div>
            <div>
              <p className="font-semibold text-primary-foreground">GOV.BR</p>
              <p className="text-xs text-muted-foreground">Mensagem Oficial</p>
            </div>
          </div>
          <div className="bg-background p-4 rounded-md border border-border">
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-accent">GOV.BR:</strong> Seu benefício de <strong className="text-accent">R$1.200,00</strong> foi depositado com sucesso na conta vinculada ao CPF final
              <span className="font-mono bg-muted p-1 rounded">{dynamicCpf}</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Data: {currentDate}
            </p>
          </div>
        </div>
         <p className="text-xs text-muted-foreground mt-3 text-center">
            * Este é um comprovante digital da sua transação. Guarde para referência.
        </p>
      </CardContent>
    </Card>
  );
};

export default FakeSms;
