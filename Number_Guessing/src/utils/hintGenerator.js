// Intelligent Mathematical Clues Generator

const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

export const generateAvailableHints = (secret, min, max) => {
  const hints = [];

  // 1. Parity Clue (Even / Odd)
  const isEven = secret % 2 === 0;
  hints.push({
    id: 'parity',
    title: 'Parity Clue',
    icon: '⚖️',
    description: `The secret number is ${isEven ? 'EVEN' : 'ODD'}.`,
    cost: 150,
  });

  // 2. Prime / Composite Clue
  const primeStatus = isPrime(secret);
  hints.push({
    id: 'prime',
    title: 'Prime Status',
    icon: '💎',
    description: `The number is ${primeStatus ? 'a PRIME number' : 'a COMPOSITE (non-prime) number'}.`,
    cost: 200,
  });

  // 3. Divisibility Clue
  const divisors = [3, 4, 5, 7, 9, 10].filter((d) => secret % d === 0);
  if (divisors.length > 0) {
    const chosenDivisor = divisors[Math.floor(Math.random() * divisors.length)];
    hints.push({
      id: 'divisor',
      title: 'Divisibility',
      icon: '➗',
      description: `The secret number is divisible by ${chosenDivisor}.`,
      cost: 250,
    });
  } else {
    hints.push({
      id: 'divisor',
      title: 'Divisibility',
      icon: '➗',
      description: 'The secret number is NOT divisible by 2, 3, or 5.',
      cost: 250,
    });
  }

  // 4. Sum of Digits
  const digitsSum = secret
    .toString()
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  hints.push({
    id: 'digit_sum',
    title: 'Digit Sum',
    icon: '🔢',
    description: `The sum of its digits equals ${digitsSum}.`,
    cost: 300,
  });

  // 5. Narrow Window
  const span = Math.max(8, Math.round((max - min) * 0.25));
  let lowerBound = Math.max(min, secret - Math.floor(Math.random() * (span / 2)));
  let upperBound = lowerBound + span;
  if (upperBound > max) {
    upperBound = max;
    lowerBound = Math.max(min, upperBound - span);
  }
  hints.push({
    id: 'window',
    title: 'Radar Slice',
    icon: '🎯',
    description: `Target is trapped in the range [ ${lowerBound} – ${upperBound} ].`,
    cost: 400,
  });

  return hints;
};
