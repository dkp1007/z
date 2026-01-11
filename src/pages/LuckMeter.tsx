import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Briefcase, DollarSign, Activity, Clock, Palette, Hash, Share2, ArrowLeft, Lock, Crown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { useAuth } from "@/contexts/AuthContext";
import { zodiacDetailedData, ZodiacDataKey } from "@/lib/zodiac-data";
import { generateHoroscope } from "@/lib/horoscope-data";
import { generateLuckValues } from "@/lib/luck-utils";
import { cn } from "@/lib/utils";

const CircularProgress = ({ value, label, icon: Icon, color, delay = 0 }: {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayValue((prev) => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: displayValue / 100 }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="mb-1 h-5 w-5" style={{ color }} />
          <span className="font-display text-xl font-bold">{displayValue}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

const LuckMeter = () => {
  const { user, isPremium, userZodiacSign, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <CosmicBackground orbCount={6} starCount={60} />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-center">
            <Sparkles className="mx-auto h-12 w-12 text-accent" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <CosmicBackground orbCount={6} starCount={60} />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">Premium Feature</h1>
            <p className="mt-4 text-muted-foreground">
              Unlock Daily Luck Intelligence with a premium subscription to get personalized luck predictions, lucky colors, numbers, and more!
            </p>
            <Link to="/upgrade">
              <Button variant="cosmic" size="lg" className="mt-8">
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!userZodiacSign) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <CosmicBackground orbCount={6} starCount={60} />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center"
          >
            <Sparkles className="mx-auto mb-6 h-16 w-16 text-accent" />
            <h1 className="font-display text-3xl font-bold">Set Your Birth Date</h1>
            <p className="mt-4 text-muted-foreground">
              Please update your profile with your birth date to see your personalized luck meter.
            </p>
            <Link to="/profile">
              <Button variant="cosmic" size="lg" className="mt-8">
                Go to Profile
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const signName = userZodiacSign.name as ZodiacDataKey;
  const signData = zodiacDetailedData[signName];
  
  // Get horoscope data for consistent lucky color, number, time
  const horoscope = useMemo(() => 
    generateHoroscope(userZodiacSign, "daily", new Date(), user?.id),
    [userZodiacSign, user?.id]
  );
  
  // Generate personalized luck values using shared utility (same as Dashboard)
  const luckValues = useMemo(() => 
    generateLuckValues(user?.id, signName),
    [user?.id, signName]
  );
  
  // Generate a seeded random for affirmation
  const seededRandom = (seed: string): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const today = new Date().toISOString().split('T')[0];
  const affirmationSeed = seededRandom(`${user?.id || 'anonymous'}-${today}-${signName}-affirmation`);
  
  const luckData = {
    love: luckValues.love,
    career: luckValues.career,
    money: luckValues.money,
    health: luckValues.health,
    // Use same values as horoscope for consistency
    luckyColor: horoscope.luckyColor,
    luckyNumber: horoscope.luckyNumber,
    luckyTime: horoscope.luckyTime,
    affirmation: signData.dailyAffirmations[affirmationSeed % signData.dailyAffirmations.length],
    dos: signData.luckProfile.bestActivities.slice(0, 3),
    donts: signData.luckProfile.avoidActivities.slice(0, 3),
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={6} starCount={60} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-gradient">Luck Meter</span>
          </div>
        </div>

        {/* Your Sign */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-primary/20 px-6 py-3 ring-2 ring-primary">
            <span className="font-zodiac text-3xl">{userZodiacSign.symbol}</span>
            <span className="font-display text-xl font-bold">{userZodiacSign.name}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{userZodiacSign.dates}</p>
        </motion.div>

        {/* Luck Meters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-center font-display text-xl font-bold">Today's Luck</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <CircularProgress value={luckData.love} label="Love" icon={Heart} color="#ec4899" delay={0} />
            <CircularProgress value={luckData.career} label="Career" icon={Briefcase} color="#3b82f6" delay={0.2} />
            <CircularProgress value={luckData.money} label="Money" icon={DollarSign} color="#22c55e" delay={0.4} />
            <CircularProgress value={luckData.health} label="Health" icon={Activity} color="#f59e0b" delay={0.6} />
          </div>
        </motion.div>

        {/* Lucky Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-cosmic">
              <Palette className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucky Color</p>
              <p className="font-display font-bold">{luckData.luckyColor}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
              <Hash className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucky Number</p>
              <p className="font-display font-bold">{luckData.luckyNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
              <Clock className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucky Time</p>
              <p className="font-display font-bold">{luckData.luckyTime}</p>
            </div>
          </div>
        </motion.div>

        {/* Affirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-3xl border border-accent/30 bg-accent/10 p-6 text-center backdrop-blur-xl"
        >
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-accent" />
          <p className="font-display text-lg italic text-foreground">"{luckData.affirmation}"</p>
        </motion.div>

        {/* Do's and Don'ts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-green-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm text-white">✓</span>
              Best Activities Today
            </h3>
            <ul className="space-y-2">
              {luckData.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-red-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white">✗</span>
              Activities to Avoid
            </h3>
            <ul className="space-y-2">
              {luckData.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 text-red-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button variant="cosmic" size="lg">
            <Share2 className="mr-2 h-5 w-5" />
            Share Your Luck
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LuckMeter;
