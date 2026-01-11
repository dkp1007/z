export const zodiacSigns = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", emoji: "🐏", traits: ["Bold", "Ambitious", "Energetic", "Confident", "Passionate"] },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", emoji: "🐂", traits: ["Reliable", "Patient", "Practical", "Devoted", "Sensual"] },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", emoji: "👯", traits: ["Curious", "Adaptable", "Witty", "Expressive", "Social"] },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", emoji: "🦀", traits: ["Intuitive", "Protective", "Compassionate", "Loyal", "Nurturing"] },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", emoji: "🦁", traits: ["Dramatic", "Creative", "Generous", "Warm-hearted", "Charismatic"] },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", emoji: "👸", traits: ["Analytical", "Practical", "Loyal", "Hardworking", "Kind"] },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", emoji: "⚖️", traits: ["Diplomatic", "Fair-minded", "Social", "Graceful", "Peaceful"] },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", emoji: "🦂", traits: ["Passionate", "Determined", "Brave", "Mysterious", "Loyal"] },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", emoji: "🏹", traits: ["Adventurous", "Optimistic", "Independent", "Honest", "Philosophical"] },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", emoji: "🐐", traits: ["Disciplined", "Responsible", "Ambitious", "Patient", "Strategic"] },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", emoji: "🏺", traits: ["Progressive", "Original", "Independent", "Humanitarian", "Inventive"] },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", emoji: "🐟", traits: ["Intuitive", "Artistic", "Gentle", "Wise", "Compassionate"] },
] as const;

// Full zodiac sign object type
export type ZodiacSign = typeof zodiacSigns[number];

// Just the name type for simpler cases
export type ZodiacSignName = ZodiacSign["name"];

// Name to zodiac sign mapping based on first letter (Rashi system)
const nameLetterToZodiac: Record<string, string> = {
  // Aries (Mesha) - A, L, E, I, O
  A: "Aries", L: "Aries", E: "Aries", I: "Aries", O: "Aries",
  // Taurus (Vrishabha) - B, V, U, W
  B: "Taurus", V: "Taurus", U: "Taurus", W: "Taurus",
  // Gemini (Mithun) - K, C, G, Q
  K: "Gemini", C: "Gemini", Q: "Gemini",
  // Cancer (Karka) - D, H (using DD, H)
  H: "Cancer",
  // Leo (Sinh) - M, T (using M, TT)
  M: "Leo",
  // Virgo (Kanya) - P
  P: "Virgo",
  // Libra (Tula) - R, T
  R: "Libra", T: "Libra",
  // Scorpio (Vruschika) - N, Y
  N: "Scorpio", Y: "Scorpio",
  // Sagittarius (Dhanu) - F
  F: "Sagittarius",
  // Capricorn (Makar) - J
  J: "Capricorn",
  // Aquarius (Kumbha) - G, S
  G: "Aquarius", S: "Aquarius",
  // Pisces (Meena) - D, Z
  D: "Pisces", Z: "Pisces",
};

// Get zodiac sign based on name's first letter
export function getZodiacSignByName(name: string): ZodiacSign | null {
  if (!name || name.trim().length === 0) return null;
  
  const firstLetter = name.trim().charAt(0).toUpperCase();
  const signName = nameLetterToZodiac[firstLetter];
  
  if (signName) {
    return zodiacSigns.find(z => z.name === signName) || null;
  }
  
  return null;
}

// Get zodiac sign based on birth date (traditional Western astrology)
export function getZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10]; // Aquarius
  return zodiacSigns[11]; // Pisces
}

export function getElementColor(element: string): string {
  switch (element) {
    case "Fire": return "from-orange-500 to-red-600";
    case "Earth": return "from-emerald-500 to-green-700";
    case "Air": return "from-sky-400 to-blue-500";
    case "Water": return "from-cyan-400 to-blue-600";
    default: return "from-primary to-secondary";
  }
}
