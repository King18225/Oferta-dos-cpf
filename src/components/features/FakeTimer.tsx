"use client";

import { useState, useEffect } from 'react';

const FakeTimer: FC = () => {
  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(59);
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 59));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div className="text-center my-4">
      <p className="text-destructive font-semibold text-lg">
        TEMPO RESTANTE PARA GARANTIR: <span className="font-bold text-2xl tabular-nums">{String(timeLeft).padStart(2, '0')}s</span>
      </p>
    </div>
  );
};

export default FakeTimer;
