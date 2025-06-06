
"use client";

import type React from 'react';
import CpfForm from '@/components/features/CpfForm';
import UrgentHeader from '@/components/features/UrgentHeader'; // Import the new header

interface CaptureStepProps {
  onSubmitSuccess: (cpf: string) => void;
}

const CaptureStep: React.FC<CaptureStepProps> = ({ onSubmitSuccess }) => {
  return (
    <div className="w-full max-w-lg text-center">
      <UrgentHeader />
      <div className="p-6 bg-card shadow-xl rounded-lg border border-primary/20">
        <CpfForm onSubmitSuccess={onSubmitSuccess} />
      </div>
    </div>
  );
};

export default CaptureStep;
