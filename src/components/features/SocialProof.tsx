"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, CheckCircle } from 'lucide-react';

interface Beneficiary {
  name: string;
  city: string;
  amount: string;
}

const initialBeneficiaries: Beneficiary[] = [
  { name: 'Maria S.', city: 'Fortaleza/CE', amount: 'R$1.200' },
  { name: 'João P.', city: 'Salvador/BA', amount: 'R$1.200' },
  { name: 'Ana L.', city: 'Recife/PE', amount: 'R$1.200' },
];

const SocialProof: FC = () => {
  const [confirmedDeposits, setConfirmedDeposits] = useState(2347);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setConfirmedDeposits((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 2500); // Update every 2.5 seconds

    const beneficiaryUpdateInterval = setInterval(() => {
      // Simulate a new beneficiary
      const newName = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`;
      const cities = ["São Paulo/SP", "Rio de Janeiro/RJ", "Belo Horizonte/MG", "Curitiba/PR"];
      const newCity = cities[Math.floor(Math.random() * cities.length)];
      const newBeneficiary: Beneficiary = { name: newName, city: newCity, amount: 'R$1.200' };
      
      setBeneficiaries(prev => [newBeneficiary, ...prev.slice(0, initialBeneficiaries.length -1)]);

    }, 7000); // New beneficiary every 7 seconds

    return () => {
      clearInterval(intervalId);
      clearInterval(beneficiaryUpdateInterval);
    };
  }, []);

  return (
    <Card className="my-8 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center">
          <Users className="mr-2 h-7 w-7" /> Pessoas Reais, Resultados Reais!
        </CardTitle>
        <CardDescription>Veja quem já garantiu o benefício HOJE:</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md shadow-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-accent mr-2" />
                <div>
                  <p className="font-semibold text-primary-foreground">{beneficiary.name}</p>
                  <p className="text-xs text-muted-foreground">{beneficiary.city}</p>
                </div>
              </div>
              <p className="font-bold text-accent">{beneficiary.amount}</p>
            </div>
          ))}
        </div>
        <div className="text-center p-4 bg-primary text-primary-foreground rounded-md">
          <p className="text-2xl font-bold">{confirmedDeposits.toLocaleString('pt-BR')}</p>
          <p className="text-sm">DEPÓSITOS CONFIRMADOS HOJE</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialProof;
