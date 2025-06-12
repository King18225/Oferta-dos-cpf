
import { Suspense } from 'react';
import ProcessingContent from './ProcessingContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Processando sua Solicitação',
  description: 'Aguarde enquanto processamos suas informações.',
};

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Carregando...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
