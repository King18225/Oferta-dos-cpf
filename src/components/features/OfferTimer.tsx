
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';

interface OfferTimerProps {
  initialMinutes: number;
  initialSeconds: number;
}

const OfferTimer: React.FC<OfferTimerProps> = ({ initialMinutes, initialSeconds }) => {
  const totalInitialSeconds = initialMinutes * 60 + initialSeconds;
  const [timeLeft, setTimeLeft] = useState(totalInitialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(totalInitialSeconds); // Reset timer
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : totalInitialSeconds));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, totalInitialSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-bold text-xl md:text-2xl tabular-nums text-destructive">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
};

export default OfferTimer;
