
"use client";

import type React from 'react';
import CpfForm from '@/components/features/CpfForm';

interface CaptureStepProps {
  onSubmitSuccess: (cpf: string) => void;
}

const GovBrLogo: React.FC = () => (
  <svg viewBox="0 0 130 40" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" aria-label="gov.br logo">
    <text x="0" y="30" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "30px", fontWeight: "bold" }}>
      <tspan style={{ fill: "#0059A4" }}>gov</tspan>
      <tspan style={{ fill: "#009B3A" }}>.</tspan>
      <tspan style={{ fill: "#FFCC29" }}>br</tspan>
    </text>
  </svg>
);

const CaptureStep: React.FC<CaptureStepProps> = ({ onSubmitSuccess }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto">
      <div className="flex justify-center pt-8 pb-6">
        <GovBrLogo />
      </div>
      <div className="px-2 sm:px-4">
        <p className="text-lg text-foreground mb-4 text-gray-700">Identifique-se no gov.br com:</p>
        <div className="bg-card shadow-md rounded-lg p-6 border border-gray-200">
          <CpfForm onSubmitSuccess={onSubmitSuccess} />
        </div>
      </div>
    </div>
  );
};

export default CaptureStep;
