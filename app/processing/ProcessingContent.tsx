
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProcessingStep from '@/components/steps/ProcessingStep';

export default function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleProcessingComplete = () => {
    // Construct new query parameters, preserving existing ones and CPF
    const newQueryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      newQueryParams.set(key, value);
    });
    // Note: CPF should already be in searchParams from the previous page

    router.push(`/offer?${newQueryParams.toString()}`);
  };

  // Optional: Add a check if essential params like CPF are missing
  useEffect(() => {
    const cpf = searchParams.get('cpf');
    if (!cpf) {
      // console.warn("CPF not found in query params, redirecting to home.");
      // router.replace('/'); // Or to an error page, or handle as needed
    }
  }, [searchParams, router]);

  return <ProcessingStep onComplete={handleProcessingComplete} />;
}
