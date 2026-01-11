import { zodiacSigns } from "./zodiac";

export type HoroscopePeriod = "daily" | "weekly" | "monthly";

export interface HoroscopeData {
  sign: typeof zodiacSigns[number];
  period: HoroscopePeriod;
  date: Date;
  prediction: string;
  mood: string;
  luckyNumber: number;
  luckyColor: string;
  luckyTime: string;
  compatibility: string;
  advice: string;
  rating: number;
}

// Generate a seeded random number from a string (user ID + date)
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate a unique seed for each user based on their ID and date
function getUserSeed(userId: string | undefined, date: Date, signName: string): number {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const seedString = `${userId || 'anonymous'}-${dateString}-${signName}`;
  return seededRandom(seedString);
}

const dailyPredictions: Record<string, string[]> = {
  Aries: [
    "Your fiery energy is unstoppable today! A creative project demands your attention, and you're ready to lead the charge. Don't let minor setbacks dim your spark.",
    "The universe is aligning in your favor. Bold moves in your career could pay off big. Trust your instincts and take that leap of faith.",
    "Today calls for patience, even for a fire sign like you. Slow down and let things unfold naturally. Your moment will come.",
  ],
  Taurus: [
    "Comfort and stability are your themes today. Focus on building something lasting, whether it's a relationship or a financial goal. Your persistence pays off.",
    "Venus brings romantic energy your way. If single, keep your eyes open for unexpected connections. If attached, plan something special.",
    "Your practical nature serves you well today. A problem that seemed complex has a simple solution. Trust your grounded approach.",
  ],
  Gemini: [
    "Your quick wit and charm are in full effect today! Communication flows easily, making it perfect for important conversations or networking.",
    "Curiosity leads you to exciting discoveries. Follow that random thought or idea—it could lead somewhere amazing.",
    "Balance your social energy with some alone time. Your mind needs space to process all the information it's absorbed.",
  ],
  Cancer: [
    "Your intuition is heightened today. Trust those gut feelings, especially regarding family matters. Your emotional intelligence is your superpower.",
    "Home is where the heart is, and today it's where you'll find peace. Create a cozy space for self-care and reflection.",
    "The moon amplifies your empathy. Use this gift to help someone who needs support, but remember to protect your own energy.",
  ],
  Leo: [
    "All eyes are on you today, and you're absolutely glowing! Your natural charisma attracts opportunities and admirers alike.",
    "Creativity flows through you like liquid gold. Express yourself through art, performance, or bold fashion choices. The world is your stage.",
    "Leadership opportunities arise. Step up with confidence—your ability to inspire others is exactly what's needed right now.",
  ],
  Virgo: [
    "Your attention to detail catches something others missed. This could lead to recognition at work or solving a personal puzzle.",
    "Organization is your friend today. Tackle that to-do list and watch your productivity soar. Small improvements lead to big results.",
    "Health and wellness take center stage. Start that new routine or perfect an existing one. Your body will thank you.",
  ],
  Libra: [
    "Harmony flows through your interactions today. Your diplomatic skills help resolve a conflict or bring people together.",
    "Beauty calls to you—visit a gallery, style your space, or simply appreciate the aesthetics around you. Feed your artistic soul.",
    "Partnership matters are highlighted. Whether romantic or professional, focus on creating balance and mutual benefit.",
  ],
  Scorpio: [
    "Your intensity is magnetic today. Others are drawn to your mysterious aura. Use this power wisely in negotiations or romance.",
    "Deep truths surface—you're ready to face them. Transformation is your specialty, and today marks a turning point.",
    "Research and investigation yield results. Your ability to dig beneath the surface uncovers valuable information.",
  ],
  Sagittarius: [
    "Adventure beckons! Whether it's a physical journey or an intellectual exploration, embrace the call of the unknown.",
    "Your optimism is contagious. Share your enthusiasm and watch it inspire positive change in those around you.",
    "Philosophy and big-picture thinking capture your attention. Expand your worldview through learning or meaningful conversations.",
  ],
  Capricorn: [
    "Your ambition is rewarded today. Hard work pays off in visible ways—a promotion, recognition, or breakthrough moment.",
    "Structure and planning lead to success. Map out your goals and take concrete steps toward achieving them.",
    "Legacy and long-term thinking guide your decisions. Build something that will stand the test of time.",
  ],
  Aquarius: [
    "Your innovative ideas capture attention. Share your unique perspective—the world needs your forward-thinking vision.",
    "Community and friendship bring joy. Connect with your tribe and collaborate on projects that benefit everyone.",
    "Technology and innovation play a key role today. Embrace new tools or methods that can streamline your life.",
  ],
  Pisces: [
    "Your imagination is limitless today. Creative and spiritual pursuits bring deep fulfillment. Let yourself dream big.",
    "Compassion flows naturally from you. Your empathy helps heal a wounded soul—sometimes including your own.",
    "Intuitive messages arrive through dreams or meditation. Pay attention to symbols and synchronicities.",
  ],
};

const weeklyPredictions: Record<string, string> = {
  Aries: "This week ignites your passion for new beginnings. Career opportunities arise mid-week, while the weekend favors romantic adventures. Stay open to unexpected invitations that could change your trajectory.",
  Taurus: "Financial matters take center stage this week. A practical approach to money brings rewards. Relationships deepen toward the weekend. Trust the slow and steady progress you're making.",
  Gemini: "Communication is your superpower this week. Important conversations lead to breakthroughs. Social activities peak mid-week. Balance mental stimulation with rest for optimal results.",
  Cancer: "Home and family themes dominate this week. Creating emotional security brings peace. Career matters improve by Friday. Trust your intuition when making important decisions.",
  Leo: "The spotlight finds you this week. Creative projects gain momentum, and romantic prospects brighten. Lead with your heart, but don't ignore practical considerations.",
  Virgo: "Health and daily routines are your focus. Small adjustments create big improvements. Work projects require attention to detail. The weekend brings social opportunities.",
  Libra: "Relationships take priority this week. Partnerships—both romantic and professional—need balance. Creative ventures flourish. Seek harmony in all your interactions.",
  Scorpio: "Transformation accelerates this week. Deep insights lead to personal growth. Financial matters improve mid-week. Trust the process of change you're experiencing.",
  Sagittarius: "Adventure and learning call to you. Travel or educational pursuits bring joy. Expand your horizons through new experiences. Optimism attracts positive outcomes.",
  Capricorn: "Career ambitions advance significantly. Your hard work gains recognition. Balance professional goals with personal connections. Structure leads to success this week.",
  Aquarius: "Innovation and community unite this week. Your unique ideas inspire others. Friendships bring unexpected opportunities. Embrace your individuality fully.",
  Pisces: "Spiritual and creative pursuits flourish. Intuition guides important decisions. Rest and reflection are essential. The universe communicates through dreams and synchronicities.",
};

const monthlyPredictions: Record<string, string> = {
  Aries: "January 2025 brings transformative energy to your career sector. The first week favors bold initiatives, while mid-month requires patience with colleagues. Romance heats up after the 20th. Financial opportunities arise through unexpected channels. Focus on long-term goals rather than quick wins.",
  Taurus: "This month emphasizes growth through stability. Financial planning in early January sets the tone for prosperity. Relationships deepen significantly around the full moon. Career matters stabilize mid-month. The final week is perfect for self-care and reflection on your achievements.",
  Gemini: "Communication reaches new heights in January. The first half of the month favors networking and new connections. Creative projects gain momentum around the 15th. Travel opportunities arise toward month's end. Balance social activities with personal projects for best results.",
  Cancer: "Home and family take center stage this month. Early January is ideal for domestic improvements. Career opportunities emerge around the second week. Emotional healing accelerates mid-month. The final days bring romantic possibilities and creative inspiration.",
  Leo: "January puts you in the spotlight. Creative endeavors flourish in the first two weeks. Leadership opportunities arise mid-month. Romance is especially favored after the 22nd. Financial matters require careful attention throughout. Your natural charisma opens important doors.",
  Virgo: "Health and self-improvement dominate January's themes. The first week is perfect for starting new wellness routines. Work recognition comes around the 12th. Relationships improve steadily throughout the month. End the month with decluttering and organization projects.",
  Libra: "Partnerships of all kinds are highlighted this month. Early January brings relationship clarity. Creative projects thrive mid-month. Financial matters improve after the 18th. Social activities peak toward month's end. Balance is key in all areas.",
  Scorpio: "Deep transformation continues through January. Inner work in the first week yields powerful insights. Career matters accelerate around the 14th. Romance intensifies mid-month. Financial intuition is especially strong. Trust the process of personal evolution.",
  Sagittarius: "Adventure and expansion define your January. The first half of the month favors travel and learning. New opportunities emerge around the 17th. Relationships benefit from honest communication. The final week is ideal for planning future adventures.",
  Capricorn: "Your birthday month brings powerful manifestation energy. Career ambitions advance significantly in the first two weeks. Financial opportunities arise mid-month. Relationships require attention after the 20th. End the month celebrating your achievements and setting new intentions.",
  Aquarius: "January prepares you for your upcoming birthday season. The first half of the month emphasizes friendships and community. Innovative ideas gain traction around the 15th. Rest and reflection are essential toward month's end. Trust your unique vision.",
  Pisces: "Spiritual growth accelerates through January. Dreams and intuition are especially powerful in the first week. Creative projects flourish mid-month. Relationships deepen emotionally after the 18th. The final days bring clarity about your path forward.",
};

const moods = ["Energetic", "Romantic", "Introspective", "Adventurous", "Peaceful", "Ambitious", "Creative", "Social"];
const colors = ["Gold", "Silver", "Purple", "Blue", "Green", "Rose", "Coral", "Lavender", "Teal", "Crimson"];
const times = ["7:00 AM", "11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM", "10:00 PM"];

export function generateHoroscope(
  sign: typeof zodiacSigns[number], 
  period: HoroscopePeriod, 
  date: Date,
  userId?: string
): HoroscopeData {
  const signIndex = zodiacSigns.findIndex(z => z.name === sign.name);
  const seed = getUserSeed(userId, date, sign.name);
  
  let prediction: string;
  if (period === "daily") {
    const predictions = dailyPredictions[sign.name] || dailyPredictions.Aries;
    prediction = predictions[seed % predictions.length];
  } else if (period === "weekly") {
    prediction = weeklyPredictions[sign.name] || weeklyPredictions.Aries;
  } else {
    prediction = monthlyPredictions[sign.name] || monthlyPredictions.Aries;
  }
  
  const compatibleSigns = zodiacSigns.filter((_, i) => {
    const diff = Math.abs(signIndex - i);
    return diff === 4 || diff === 8 || diff === 0;
  });
  
  return {
    sign,
    period,
    date,
    prediction,
    mood: moods[seed % moods.length],
    luckyNumber: (seed % 99) + 1,
    luckyColor: colors[seed % colors.length],
    luckyTime: times[seed % times.length],
    compatibility: compatibleSigns[(seed % compatibleSigns.length)]?.name || "Leo",
    advice: getAdvice(sign.element, seed),
    rating: Math.min(5, Math.max(3, (seed % 3) + 3)),
  };
}

function getAdvice(element: string, seed: number): string {
  const advices: Record<string, string[]> = {
    Fire: [
      "Channel your passion into productive pursuits",
      "Your enthusiasm inspires others—share it generously",
      "Take bold action, but consider the consequences",
    ],
    Earth: [
      "Trust the process and be patient with results",
      "Ground yourself in nature for clarity",
      "Build on solid foundations for lasting success",
    ],
    Air: [
      "Let your ideas flow freely without judgment",
      "Connect with others to expand your perspective",
      "Balance mental activity with physical movement",
    ],
    Water: [
      "Honor your emotions—they carry wisdom",
      "Trust your intuition above logic today",
      "Create space for reflection and healing",
    ],
  };
  
  const elementAdvices = advices[element] || advices.Fire;
  return elementAdvices[seed % elementAdvices.length];
}

export function getDateOffset(date: Date, offset: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset);
  return newDate;
}

export function formatDateForPeriod(date: Date, period: HoroscopePeriod): string {
  if (period === "daily") {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  } else if (period === "weekly") {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  } else {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
}
