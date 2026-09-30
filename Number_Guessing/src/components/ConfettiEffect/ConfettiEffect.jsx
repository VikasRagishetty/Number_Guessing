import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function ConfettiEffect({ active }) {
  useEffect(() => {
    if (active) {
      // Multiple bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 1500,
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#6366f1', '#ec4899', '#06b6d4'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#10b981', '#f59e0b', '#8b5cf6'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#38bdf8', '#fbbf24', '#f43f5e'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [active]);

  return null;
}
