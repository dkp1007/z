// Shared utility for generating consistent luck values across the app

// Generate a seeded random number from a string
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export interface LuckValues {
  love: number;
  career: number;
  money: number;
  health: number;
}

// Generate consistent luck values based on user ID, date, and zodiac sign
export function generateLuckValues(userId: string | undefined, signName: string): LuckValues {
  const today = new Date().toISOString().split('T')[0];
  const userSeed = seededRandom(`${userId || 'anonymous'}-${today}-${signName}-luck-values`);
  
  return {
    love: 40 + (userSeed % 60),
    career: 30 + ((userSeed * 2) % 70),
    money: 35 + ((userSeed * 3) % 65),
    health: 45 + ((userSeed * 4) % 55),
  };
}
