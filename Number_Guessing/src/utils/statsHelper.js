// Player Statistics & Records Management

const STATS_STORAGE_KEY = 'quantum_guess_user_stats';

export const getInitialStats = () => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  highScore: 0,
  totalGuesses: 0,
  history: [], // Recent games log
  attemptsDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    '6+': 0,
  },
});

export const loadStoredStats = () => {
  if (typeof window === 'undefined') return getInitialStats();
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return getInitialStats();
    return { ...getInitialStats(), ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load player stats:', e);
    return getInitialStats();
  }
};

export const saveStoredStats = (stats) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats:', e);
  }
};

export const recordGameResult = (currentStats, { won, attempts, score, mode, difficulty, secret }) => {
  const gamesPlayed = currentStats.gamesPlayed + 1;
  const gamesWon = currentStats.gamesWon + (won ? 1 : 0);
  const currentStreak = won ? currentStats.currentStreak + 1 : 0;
  const bestStreak = Math.max(currentStats.bestStreak, currentStreak);
  const highScore = Math.max(currentStats.highScore, score || 0);
  const totalGuesses = currentStats.totalGuesses + attempts;

  // Update distribution
  const attemptsDistribution = { ...currentStats.attemptsDistribution };
  if (won) {
    const key = attempts <= 5 ? attempts : '6+';
    attemptsDistribution[key] = (attemptsDistribution[key] || 0) + 1;
  }

  // History entry
  const gameEntry = {
    id: Date.now(),
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    won,
    attempts,
    score,
    mode,
    difficulty,
    secret,
  };

  const updatedHistory = [gameEntry, ...(currentStats.history || [])].slice(0, 20);

  const updatedStats = {
    gamesPlayed,
    gamesWon,
    currentStreak,
    bestStreak,
    highScore,
    totalGuesses,
    attemptsDistribution,
    history: updatedHistory,
  };

  saveStoredStats(updatedStats);
  return updatedStats;
};
