import { useState, useCallback } from 'react';
import { useSoundEffects } from './useSoundEffects';

export function useAiGuesser() {
  const soundFX = useSoundEffects();
  const [minBound, setMinBound] = useState(1);
  const [maxBound, setMaxBound] = useState(100);
  const [currentMin, setCurrentMin] = useState(1);
  const [currentMax, setCurrentMax] = useState(100);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [aiStatus, setAiStatus] = useState('CONFIG'); // 'CONFIG', 'THINKING', 'GUESSING', 'WON', 'ERROR'
  const [guessHistory, setGuessHistory] = useState([]);
  const [aiMessage, setAiMessage] = useState('Pick a secret number and start!');

  const startAiSearch = useCallback((min = minBound, max = maxBound) => {
    if (min >= max) return;
    setMinBound(min);
    setMaxBound(max);
    setCurrentMin(min);
    setCurrentMax(max);
    setStepCount(1);
    setGuessHistory([]);
    setAiStatus('THINKING');

    const firstGuess = Math.floor((min + max) / 2);

    setTimeout(() => {
      setCurrentGuess(firstGuess);
      setAiStatus('GUESSING');
      setAiMessage(`I'll start right in the middle: is it ${firstGuess}?`);
      soundFX.playClick();
    }, 400);
  }, [minBound, maxBound, soundFX]);

  const handleUserFeedback = useCallback((feedback) => {
    // feedback: 'HIGHER', 'LOWER', 'CORRECT'
    if (aiStatus !== 'GUESSING' || currentGuess === null) return;

    if (feedback === 'CORRECT') {
      soundFX.playWin();
      setAiStatus('WON');
      setAiMessage(`Aha! I found your secret number (${currentGuess}) in ${stepCount} ${stepCount === 1 ? 'step' : 'steps'}! 🧠✨`);
      setGuessHistory((prev) => [
        {
          step: stepCount,
          guess: currentGuess,
          feedback: 'CORRECT',
          remainingRange: `${currentMin} – ${currentMax}`,
        },
        ...prev,
      ]);
      return;
    }

    let nextMin = currentMin;
    let nextMax = currentMax;

    if (feedback === 'HIGHER') {
      soundFX.playGuessLow();
      nextMin = currentGuess + 1;
    } else if (feedback === 'LOWER') {
      soundFX.playGuessHigh();
      nextMax = currentGuess - 1;
    }

    // Record step
    setGuessHistory((prev) => [
      {
        step: stepCount,
        guess: currentGuess,
        feedback,
        remainingRange: `${nextMin} – ${nextMax}`,
      },
      ...prev,
    ]);

    if (nextMin > nextMax) {
      soundFX.playGameOver();
      setAiStatus('ERROR');
      setAiMessage('Wait a second... The feedback contradicts itself! Did you change your mind? 🤔');
      return;
    }

    setCurrentMin(nextMin);
    setCurrentMax(nextMax);
    const nextStep = stepCount + 1;
    setStepCount(nextStep);
    setAiStatus('THINKING');

    // Binary search midpoint
    const nextGuess = Math.floor((nextMin + nextMax) / 2);

    setTimeout(() => {
      setCurrentGuess(nextGuess);
      setAiStatus('GUESSING');
      const searchSpace = nextMax - nextMin + 1;
      setAiMessage(
        searchSpace === 1
          ? `By deduction, it MUST be ${nextGuess}!`
          : `Narrowed search space to ${searchSpace} numbers. Is it ${nextGuess}?`
      );
    }, 450);
  }, [aiStatus, currentGuess, stepCount, currentMin, currentMax, soundFX]);

  const resetAi = useCallback(() => {
    setAiStatus('CONFIG');
    setCurrentGuess(null);
    setStepCount(0);
    setGuessHistory([]);
    setAiMessage('Set your range, think of a number, and click Start!');
  }, []);

  return {
    minBound,
    setMinBound,
    maxBound,
    setMaxBound,
    currentMin,
    currentMax,
    currentGuess,
    stepCount,
    aiStatus,
    guessHistory,
    aiMessage,
    startAiSearch,
    handleUserFeedback,
    resetAi,
  };
}
