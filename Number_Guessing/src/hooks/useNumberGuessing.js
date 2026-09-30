import { useState, useCallback, useEffect } from 'react';
import { DIFFICULTY_PRESETS } from '../constants/difficulty';
import {
  generateSecretNumber,
  calculateProximity,
  calculateGameScore,
} from '../utils/gameLogic';
import { generateAvailableHints } from '../utils/hintGenerator';
import { recordGameResult, loadStoredStats } from '../utils/statsHelper';
import { useSoundEffects } from './useSoundEffects';
import { useTimer } from './useTimer';

export function useNumberGuessing() {
  const soundFX = useSoundEffects();
  const [stats, setStats] = useState(loadStoredStats);
  const [gameMode, setGameMode] = useState('classic'); // classic, time_attack, ai_guesser, survival
  const [difficultyKey, setDifficultyKey] = useState('MEDIUM');
  
  // Custom range configs
  const [customRange, setCustomRange] = useState({ min: 1, max: 100, maxAttempts: 10, timeLimit: 30 });

  // Survival specific state
  const [survivalLevel, setSurvivalLevel] = useState(1);
  const [survivalStreak, setSurvivalStreak] = useState(0);

  // Active game config based on difficulty/mode
  const getActiveConfig = useCallback(() => {
    if (gameMode === 'multiplayer') {
      return {
        min: 1,
        max: 100,
        maxAttempts: 999, // unlimited practically
        timeLimit: 0,
        baseScore: 1000,
        name: 'Multiplayer',
      };
    }

    if (gameMode === 'survival') {
      const min = 1;
      const max = 50 + (survivalLevel - 1) * 35;
      return {
        min,
        max,
        maxAttempts: Math.max(5, 10 - Math.floor(survivalLevel / 3)),
        timeLimit: Math.max(15, 35 - survivalLevel * 2),
        baseScore: 2000 + survivalLevel * 1000,
        name: `Survival Wave ${survivalLevel}`,
      };
    }

    if (difficultyKey === 'CUSTOM') {
      return {
        ...customRange,
        baseScore: 1500,
        name: 'Custom',
      };
    }

    return DIFFICULTY_PRESETS[difficultyKey] || DIFFICULTY_PRESETS.MEDIUM;
  }, [gameMode, difficultyKey, customRange, survivalLevel]);

  const activeConfig = getActiveConfig();

  // Core Game State
  const [secretNumber, setSecretNumber] = useState(1);
  const [gameStatus, setGameStatus] = useState('IDLE'); // 'IDLE', 'PLAYING', 'WON', 'LOST'
  const [attemptsTaken, setAttemptsTaken] = useState(0);
  const [guessHistory, setGuessHistory] = useState([]);
  const [currentBounds, setCurrentBounds] = useState({ min: 1, max: 100 });
  const [lastProximity, setLastProximity] = useState(null);
  const [lastGuessFeedback, setLastGuessFeedback] = useState(null); // 'HIGH', 'LOW', 'CORRECT', null
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(0);

  // Hints
  const [availableHints, setAvailableHints] = useState([]);
  const [unlockedHints, setUnlockedHints] = useState([]);

  // Time Attack Timer Hook
  const handleTimeUp = useCallback(() => {
    if (gameStatus === 'PLAYING' && gameMode === 'time_attack') {
      setGameStatus('LOST');
      soundFX.playGameOver();
      const updated = recordGameResult(stats, {
        won: false,
        attempts: attemptsTaken,
        score: 0,
        mode: gameMode,
        difficulty: difficultyKey,
        secret: secretNumber,
      });
      setStats(updated);
    }
  }, [gameStatus, gameMode, soundFX, stats, attemptsTaken, difficultyKey, secretNumber]);

  const timer = useTimer({
    initialSeconds: activeConfig.timeLimit || 30,
    onTimeUp: handleTimeUp,
  });

  // Start new game session
  const startNewGame = useCallback((overrideMode, overrideDiff) => {
    const targetMode = overrideMode || gameMode;
    const targetDiff = overrideDiff || difficultyKey;

    let cfg;
    if (targetMode === 'survival') {
      const min = 1;
      const max = 50 + (survivalLevel - 1) * 35;
      cfg = {
        min,
        max,
        maxAttempts: Math.max(5, 10 - Math.floor(survivalLevel / 3)),
        timeLimit: Math.max(15, 35 - survivalLevel * 2),
      };
    } else if (targetMode === 'multiplayer') {
      cfg = {
        min: 1,
        max: 100,
        maxAttempts: 999,
        timeLimit: 0,
      };
    } else if (targetDiff === 'CUSTOM') {
      cfg = customRange;
    } else {
      cfg = DIFFICULTY_PRESETS[targetDiff] || DIFFICULTY_PRESETS.MEDIUM;
    }

    let newSecret = null;
    if (targetMode === 'multiplayer') {
      setGameStatus('MULTIPLAYER_SETUP');
      setSecretNumber(null);
    } else {
      newSecret = generateSecretNumber(cfg.min, cfg.max);
      setSecretNumber(newSecret);
      setGameStatus('PLAYING');
    }
    setAttemptsTaken(0);
    setGuessHistory([]);
    setCurrentBounds({ min: cfg.min, max: cfg.max });
    setLastProximity(null);
    setLastGuessFeedback(null);
    setScoreEarned(0);

    const hints = newSecret != null ? generateAvailableHints(newSecret, cfg.min, cfg.max) : [];
    setAvailableHints(hints);
    setUnlockedHints([]);

    if (targetMode === 'time_attack') {
      timer.reset(cfg.timeLimit || 35);
      timer.start();
    } else {
      timer.pause();
    }
  }, [gameMode, difficultyKey, customRange, survivalLevel, timer]);

  const setMultiplayerSecret = useCallback((num) => {
    setSecretNumber(num);
    setGameStatus('PLAYING');
    setAttemptsTaken(0);
    setGuessHistory([]);
    setCurrentBounds({ min: 1, max: 100 });
    setLastProximity(null);
    setLastGuessFeedback(null);
    setScoreEarned(0);
    setAvailableHints([]); // No hints in multiplayer
    setUnlockedHints([]);
  }, []);

  // Handle Guess Submission
  const submitGuess = useCallback((num) => {
    if (gameStatus !== 'PLAYING') return;

    const guess = Number(num);
    const cfg = getActiveConfig();

    if (isNaN(guess) || guess < cfg.min || guess > cfg.max) {
      soundFX.playCold();
      setShakeTrigger((prev) => prev + 1);
      return;
    }

    const nextAttempts = attemptsTaken + 1;
    setAttemptsTaken(nextAttempts);

    const prox = calculateProximity(guess, secretNumber, cfg.min, cfg.max);
    setLastProximity(prox);

    let feedbackType;
    if (guess === secretNumber) {
      feedbackType = 'CORRECT';
    } else if (guess > secretNumber) {
      feedbackType = 'HIGH';
    } else {
      feedbackType = 'LOW';
    }
    setLastGuessFeedback(feedbackType);

    // Narrow visual range bounds dynamically
    setCurrentBounds((prev) => {
      let nextMin = prev.min;
      let nextMax = prev.max;
      if (guess < secretNumber && guess >= nextMin) {
        nextMin = guess + 1;
      } else if (guess > secretNumber && guess <= nextMax) {
        nextMax = guess - 1;
      }
      return { min: nextMin, max: nextMax };
    });

    // Append to history
    const historyItem = {
      attemptNumber: nextAttempts,
      guess,
      feedback: feedbackType,
      proximity: prox,
      timestamp: Date.now(),
    };
    setGuessHistory((prev) => [historyItem, ...prev]);

    // Check Win/Loss Condition
    if (guess === secretNumber) {
      // Won!
      setGameStatus('WON');
      timer.pause();
      soundFX.playWin();

      const finalScore = calculateGameScore({
        attemptsTaken: nextAttempts,
        maxAttempts: cfg.maxAttempts,
        baseScore: cfg.baseScore || 2000,
        hintsUsed: unlockedHints.length,
        streak: gameMode === 'survival' ? survivalStreak : stats.currentStreak,
        timeRemaining: timer.secondsLeft,
        isTimeAttack: gameMode === 'time_attack',
      });
      setScoreEarned(finalScore);

      if (gameMode === 'survival') {
        setSurvivalStreak((prev) => prev + 1);
        setSurvivalLevel((prev) => prev + 1);
      }

      const updatedStats = recordGameResult(stats, {
        won: true,
        attempts: nextAttempts,
        score: finalScore,
        mode: gameMode,
        difficulty: difficultyKey,
        secret: secretNumber,
      });
      setStats(updatedStats);

    } else {
      // Incorrect guess
      setShakeTrigger((prev) => prev + 1);

      if (feedbackType === 'HIGH') {
        soundFX.playGuessHigh();
      } else {
        soundFX.playGuessLow();
      }

      // Check if attempts exhausted
      if (nextAttempts >= cfg.maxAttempts) {
        setGameStatus('LOST');
        timer.pause();
        soundFX.playGameOver();

        if (gameMode === 'survival') {
          setSurvivalStreak(0);
          setSurvivalLevel(1);
        }

        const updatedStats = recordGameResult(stats, {
          won: false,
          attempts: nextAttempts,
          score: 0,
          mode: gameMode,
          difficulty: difficultyKey,
          secret: secretNumber,
        });
        setStats(updatedStats);
      }
    }
  }, [
    gameStatus,
    getActiveConfig,
    secretNumber,
    attemptsTaken,
    unlockedHints.length,
    gameMode,
    survivalStreak,
    stats,
    timer,
    difficultyKey,
    soundFX,
  ]);

  // Unlock Hint
  const unlockHint = useCallback((hintId) => {
    const hint = availableHints.find((h) => h.id === hintId);
    if (!hint || unlockedHints.some((h) => h.id === hintId)) return;

    soundFX.playHint();
    setUnlockedHints((prev) => [...prev, hint]);
  }, [availableHints, unlockedHints, soundFX]);

  // Initialize first game automatically
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    gameMode,
    setGameMode: (m) => {
      setGameMode(m);
      startNewGame(m);
    },
    difficultyKey,
    setDifficultyKey: (d) => {
      setDifficultyKey(d);
      startNewGame(gameMode, d);
    },
    customRange,
    setCustomRange,
    activeConfig,
    secretNumber,
    gameStatus,
    attemptsTaken,
    maxAttempts: activeConfig.maxAttempts,
    guessHistory,
    currentBounds,
    lastProximity,
    lastGuessFeedback,
    shakeTrigger,
    scoreEarned,
    availableHints,
    unlockedHints,
    unlockHint,
    stats,
    resetStats: () => {
      localStorage.removeItem('quantum_guess_user_stats');
      setStats(loadStoredStats());
    },
    survivalLevel,
    survivalStreak,
    timer,
    startNewGame: () => startNewGame(),
    submitGuess,
    setMultiplayerSecret,
    soundFX,
  };
}
