// Game Calculation & Feedback Engine

export const generateSecretNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculates proximity percentage and temperature classification
 * @param {number} guess 
 * @param {number} secret 
 * @param {number} min 
 * @param {number} max 
 */
export const calculateProximity = (guess, secret, min, max) => {
  const totalRange = max - min;
  const distance = Math.abs(guess - secret);
  
  if (distance === 0) {
    return {
      distance: 0,
      percentClose: 100,
      temp: 'CORRECT',
      label: 'Exact Match!',
      emoji: '🎯',
      color: 'var(--temp-correct)',
      badgeClass: 'badge-correct',
    };
  }

  // Calculate percentage closeness
  const percentClose = Math.max(0, Math.min(99, Math.round((1 - distance / totalRange) * 100)));

  // Temperature ranges based on distance ratio
  const ratio = distance / totalRange;

  if (ratio <= 0.03 || distance <= 2) {
    return {
      distance,
      percentClose,
      temp: 'BOILING',
      label: 'Boiling Hot!',
      emoji: '🔥',
      color: 'var(--temp-boiling)',
      badgeClass: 'badge-boiling',
    };
  } else if (ratio <= 0.08 || distance <= 5) {
    return {
      distance,
      percentClose,
      temp: 'HOT',
      label: 'Very Warm / Hot',
      emoji: '♨️',
      color: 'var(--temp-hot)',
      badgeClass: 'badge-hot',
    };
  } else if (ratio <= 0.18 || distance <= 12) {
    return {
      distance,
      percentClose,
      temp: 'WARM',
      label: 'Getting Warm',
      emoji: '🌤️',
      color: 'var(--temp-warm)',
      badgeClass: 'badge-warm',
    };
  } else if (ratio <= 0.35) {
    return {
      distance,
      percentClose,
      temp: 'COLD',
      label: 'Chilly / Cold',
      emoji: '❄️',
      color: 'var(--temp-cold)',
      badgeClass: 'badge-cold',
    };
  } else {
    return {
      distance,
      percentClose,
      temp: 'FREEZING',
      label: 'Freezing Ice Cold',
      emoji: '🧊',
      color: 'var(--temp-freezing)',
      badgeClass: 'badge-freezing',
    };
  }
};

/**
 * Calculates score earned upon victory
 */
export const calculateGameScore = ({
  attemptsTaken,
  maxAttempts,
  baseScore = 2000,
  hintsUsed = 0,
  streak = 0,
  timeRemaining = 0,
  isTimeAttack = false,
}) => {
  const attemptsRatio = Math.max(0.1, (maxAttempts - attemptsTaken + 1) / maxAttempts);
  let score = Math.round(baseScore * attemptsRatio);

  // Time attack speed bonus
  if (isTimeAttack && timeRemaining > 0) {
    score += timeRemaining * 100;
  }

  // Hint penalty
  score = Math.max(100, score - hintsUsed * 250);

  // Streak multiplier (e.g. +15% per streak level)
  const streakBonus = 1 + Math.min(streak, 10) * 0.15;
  score = Math.round(score * streakBonus);

  return score;
};
