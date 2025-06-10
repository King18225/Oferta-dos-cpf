
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OfferStep from '@/components/steps/OfferStep';
import UrgentHeader from '@/components/features/UrgentHeader';
import FakeSms from '@/components/features/FakeSms';
import SocialProof from '@/components/features/SocialProof';
import ExitPopup from '@/components/features/ExitPopup';
import VacancyCountdown from '@/components/features/VacancyCountdown';
import FakeTimer from '@/components/features/FakeTimer';
// Toaster is usually in RootLayout, ensure it's not duplicated if not needed here specifically

function OfferContent() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf');
  
  // Derive cpfLastDigits for FakeSms if CPF exists
  let cpfLastDigits;
  if (cpf) {
    const cleanedCpf = cpf.replace(/\D/g, ''); // Ensure CPF is just digits
    if (cleanedCpf.length === 11) {
      cpfLastDigits = `${cleanedCpf.slice(6, 9)}-${cleanedCpf.slice(9, 11)}`; // Gets XXX-XX from the end part
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <UrgentHeader />
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <VacancyCountdown />
        <FakeTimer />
        <OfferStep cpf={cpf} /> {/* OfferStep will format the full CPF if needed */}
        <FakeSms cpfLastDigits={cpfLastDigits} />
        <SocialProof />
      </main>
      <ExitPopup />
    </div>
  );
}

export default function OfferPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Carregando oferta...</div>}>
      <OfferContent />
    </Suspense>
  );
}
