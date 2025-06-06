"use client";

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

const MAX_VACANCIES = 15;

const VacancyCountdown: FC = () => {
  const [vacancies, setVacancies] = useState(MAX_VACANCIES);

  useEffect(() => {
    const decreaseVacancy = () => {
      setVacancies((prevVacancies) => {
        if (prevVacancies <= 1) return 1;
        const decreaseAmount = Math.floor(Math.random() * 2) + 1; // Decrease by 1 or 2
        return Math.max(1, prevVacancies - decreaseAmount);
      });
    };

    const intervalTime = Math.random() * 3000 + 2000; // Random interval between 2-5 seconds
    const timer = setTimeout(decreaseVacancy, intervalTime);
    
    return () => clearTimeout(timer);
  }, [vacancies]);
  
  const progressPercentage = (vacancies / MAX_VACANCIES) * 100;
  let progressColorClass = 'bg-accent'; // Green
  if (vacancies <= 5) {
    progressColorClass = 'bg-destructive'; // Red
  } else if (vacancies <= 10) {
    progressColorClass = 'bg-yellow-500'; // Yellow - specific override for warning
  }


  return (
    <div className="my-4 text-center">
      <p className="text-xl font-bold text-primary mb-2">
        ÚLTIMAS <span className="text-destructive">{vacancies}</span> VAGAS DISPONÍVEIS!
      </p>
      <Progress value={progressPercentage} className="w-full h-4 bg-muted" indicatorClassName={progressColorClass} />
      <p className="text-xs text-muted-foreground mt-1">
        {vacancies > 1 ? `${vacancies} pessoas estão garantindo agora!` : `Apenas ${vacancies} vaga restante!`}
      </p>
    </div>
  );
};

export default VacancyCountdown;
