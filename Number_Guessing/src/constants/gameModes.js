export const GAME_MODES = {
  CLASSIC: {
    id: 'classic',
    name: 'Classic Mode',
    icon: 'Target',
    tagline: 'Standard target guessing with attempts counter & thermal radar.',
    features: ['Fixed Attempts', 'Smart Hints', 'Proximity Radar'],
  },
  TIME_ATTACK: {
    id: 'time_attack',
    name: 'Time Attack',
    icon: 'Zap',
    tagline: 'Race the clock! Guess quickly to earn remaining-time score bonuses.',
    features: ['Countdown Clock', 'Time Rush Bonus', 'Quick Input'],
  },
  AI_GUESSER: {
    id: 'ai_guesser',
    name: 'AI Reverse Mode',
    icon: 'Bot',
    tagline: 'Think of a secret number. Let our intelligent AI deduce it in minimal tries!',
    features: ['You Choose Number', 'AI Binary Deduction', 'Step Analytics'],
  },
  SURVIVAL: {
    id: 'survival',
    name: 'Survival Streak',
    icon: 'Flame',
    tagline: 'Endless streak! With each win, the range expands and score multipliers skyrocket.',
    features: ['Expanding Range', 'Streak Multipliers', 'Sudden Death'],
  },
  MULTIPLAYER: {
    id: 'multiplayer',
    name: 'Multiplayer Mode',
    icon: 'Users',
    tagline: 'Play with a friend! Player 1 sets the secret number, Player 2 guesses it.',
    features: ['Custom Secret Number', 'Hidden Input', '2-Player Action'],
  },
};
