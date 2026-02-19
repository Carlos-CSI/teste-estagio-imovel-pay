import { useState, useEffect } from 'react';

interface TimerProps {
  seconds: number;
  onTimerEnd?: () => void;
}

export default function Timer({ seconds, onTimerEnd }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (onTimerEnd) {
        onTimerEnd();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newValue = Math.max(0, prev - 1);
        if (newValue === 0 && onTimerEnd) {
          onTimerEnd();
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimerEnd]);

  if (timeLeft === 0) {
    return null;
  }

  return <span>({timeLeft}s)</span>;
}
