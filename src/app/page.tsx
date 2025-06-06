import UrgentHeader from '@/components/features/UrgentHeader';
import FakeTimer from '@/components/features/FakeTimer';
import VacancyCountdown from '@/components/features/VacancyCountdown';
import CpfForm from '@/components/features/CpfForm';
import SocialProof from '@/components/features/SocialProof';
import FakeSms from '@/components/features/FakeSms';
import ExitPopup from '@/components/features/ExitPopup';
import { ShieldCheckIcon } from 'lucide-react'; // Using lucide-react ShieldCheck for the seal

export default function RendaExpressaPage() {
  const cityName = "SUA CIDADE"; // Placeholder for city name

  return (
    <div className="min-h-screen flex flex-col">
      <UrgentHeader text="⚠️ ATENÇÃO: SEU CPF FOI PRÉ-SELECIONADO! ⚠️" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-3">
            {cityName.toUpperCase()}, VOCÊ TEM DIREITO A <span className="text-accent">R$1.200,00</span> HOJE!
          </h1>
          <div className="flex items-center justify-center text-lg md:text-xl text-primary font-semibold mb-2">
            <ShieldCheckIcon className="h-7 w-7 text-accent mr-2 animate-pulse" />
            <p>97% DE APROVAÇÃO - <span className="italic">SISTEMA OFICIAL GOV.BR</span></p>
          </div>
          <p className="text-md text-muted-foreground">
            Não perca esta oportunidade exclusiva! Seu CPF foi selecionado para um benefício especial.
          </p>
        </section>

        <section className="mb-10 bg-card p-6 rounded-lg shadow-xl border border-primary/20">
          <h2 className="font-headline text-2xl text-destructive text-center font-bold mb-2">URGENTE: OFERTA EXPIRA EM BREVE!</h2>
          <FakeTimer />
          <VacancyCountdown />
        </section>
        
        <section className="mb-10">
          <CpfForm />
        </section>

        <section className="mb-10">
          <SocialProof />
        </section>

        <section className="mb-10">
          <FakeSms />
        </section>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground px-4">
          Este sistema realiza consultas públicas automáticas com base em dados fornecidos pelo usuário e fontes abertas.
          Não possuímos nenhum vínculo direto com o governo federal ou qualquer entidade governamental.
          As informações apresentadas são para fins ilustrativos e de demonstração de capacidade de consulta.
          O uso desta plataforma implica na aceitação destes termos.
        </p>
         <p className="text-xs text-muted-foreground mt-2">
          Renda Expressa &copy; {new Date().getFullYear()} - Todos os direitos (não tão) reservados.
        </p>
      </footer>
      
      <ExitPopup />
    </div>
  );
}
