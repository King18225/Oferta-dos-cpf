
"use client";

import type React from 'react';
import CpfForm from '@/components/features/CpfForm';

interface CaptureStepProps {
  onSubmitSuccess: (cpf: string) => void;
}

const GovBrLogo: React.FC = () => (
  <svg viewBox="0 0 150 48" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto" aria-label="gov.br logo">
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
    <div className="w-full max-w-xs sm:max-w-sm mx-auto">
      <div className="flex justify-center mb-6">
        <GovBrLogo />
      </div>
      <p className="text-lg text-foreground mb-3">Identifique-se no gov.br com:</p>
      <div className="bg-card shadow-md rounded-lg p-6 border border-border">
        <CpfForm onSubmitSuccess={onSubmitSuccess} />
      </div>
    </div>
  );
};

export default CaptureStep;
