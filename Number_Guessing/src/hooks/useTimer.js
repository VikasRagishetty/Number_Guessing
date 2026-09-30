import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ initialSeconds = 30, onTimeUp, autoStart = false }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const start = useCallback((newDuration) => {
    if (newDuration !== undefined) {
      setSecondsLeft(newDuration);
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newDuration = initialSeconds) => {
    setIsRunning(false);
    setSecondsLeft(newDuration);
  }, [initialSeconds]);

  const addTime = useCallback((extraSeconds) => {
    setSecondsLeft((prev) => prev + extraSeconds);
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            if (onTimeUpRef.current) onTimeUpRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    addTime,
  };
}
