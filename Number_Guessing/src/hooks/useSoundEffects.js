import { useEffect } from 'react';
import { sound } from '../utils/soundSynth';
import { useLocalStorage } from './useLocalStorage';

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('quantum_guess_sound', true);

  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.setEnabled(nextState);
    if (nextState) {
      sound.playClick();
    }
  };

  return {
    soundEnabled,
    toggleSound,
    playClick: () => sound.playClick(),
    playGuessLow: () => sound.playGuessLow(),
    playGuessHigh: () => sound.playGuessHigh(),
    playHot: () => sound.playHot(),
    playCold: () => sound.playCold(),
    playHint: () => sound.playHint(),
    playWin: () => sound.playWin(),
    playGameOver: () => sound.playGameOver(),
    playTick: () => sound.playTick(),
  };
}
