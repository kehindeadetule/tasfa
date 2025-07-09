import { useState, useEffect, useRef } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
}

interface UseCountdownOptions {
  onExpire?: () => void;
  updateInterval?: number; // in milliseconds, default 1000
}

export const useCountdown = (
  targetDate: Date | string | number,
  options: UseCountdownOptions = {}
): CountdownTime => {
  const { onExpire, updateInterval = 1000 } = options;
  const onExpireRef = useRef(onExpire);
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() => 
    calculateTimeLeft(targetDate)
  );

  // Update the ref when onExpire changes
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      // Call onExpire callback when countdown reaches zero
      if (newTimeLeft.isExpired && newTimeLeft.totalMs <= 0 && onExpireRef.current) {
        onExpireRef.current();
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [targetDate, updateInterval]);

  return timeLeft;
};

function calculateTimeLeft(targetDate: Date | string | number): CountdownTime {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: difference,
    isExpired: false,
  };
}

// Utility function to format countdown display
export const formatCountdown = (timeLeft: CountdownTime): string => {
  if (timeLeft.isExpired) {
    return "Available now";
  }

  const parts: string[] = [];
  
  if (timeLeft.days > 0) {
    parts.push(`${timeLeft.days}d`);
  }
  if (timeLeft.hours > 0) {
    parts.push(`${timeLeft.hours}h`);
  }
  if (timeLeft.minutes > 0) {
    parts.push(`${timeLeft.minutes}m`);
  }
  
  // Only show seconds if less than 1 hour remaining
  if (timeLeft.days === 0 && timeLeft.hours === 0) {
    parts.push(`${timeLeft.seconds}s`);
  }

  return parts.join(' ') || '0s';
}; 