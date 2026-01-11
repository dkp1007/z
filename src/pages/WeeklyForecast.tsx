import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Star, Calendar, ArrowLeft, Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const getDayName = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getDateString = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Generate a seeded random number from a string
const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const generateWeeklyForecast = (sign: ZodiacSign, weekOffset: number, userId?: string) => {
  const forecasts = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);

  const moods = ["Energetic", "Reflective", "Passionate", "Calm", "Creative", "Focused", "Social"];
  const ratings = [3, 4, 5, 4, 3, 5, 4];

  for (let i = 0; i < 7; i++) {
    const dateString = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const seed = seededRandom(`${userId || 'anonymous'}-${dateString}-${sign.name}-weekly`);
    
    forecasts.push({
      dayOffset: weekOffset * 7 + i,
      mood: moods[seed % moods.length],
      rating: (seed % 3) + 3, // 3-5 stars
      highlight: (seed % 5) === 0, // Random highlights based on seed
      prediction: `Today brings ${["opportunity", "clarity", "harmony", "challenges", "surprises", "growth", "connections"][seed % 7]} for ${sign.name}.`,
    });
  }

  return forecasts;
};

const WeeklyForecast = () => {
  const { user, userZodiacSign, isPremium } = useAuth();
  const defaultSign = userZodiacSign || zodiacSigns[0];
  
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(defaultSign);
  const [weekOffset, setWeekOffset] = useState(0);

  const forecasts = generateWeeklyForecast(selectedSign, weekOffset, user?.id);

  const getWeekRange = () => {
    const start = new Date();
    start.setDate(start.getDate() + weekOffset * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

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
              Unlock Weekly Forecasts with a premium subscription to plan your week ahead with cosmic insights!
            </p>
            <Link to="/upgrade">
              <Button variant="cosmic" size="lg" className="mt-8">
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={5} starCount={60} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-gradient">Weekly Forecast</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Sign Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-x-auto"
        >
          <div className="flex gap-2 pb-2">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign)}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all",
                  selectedSign.name === sign.name
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <span className="font-zodiac text-xl">{sign.symbol}</span>
                <span className="text-xs font-medium">{sign.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-xl"
        >
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            disabled={weekOffset <= 0}
            className={cn(
              "rounded-full p-2 transition-colors",
              weekOffset <= 0 ? "text-muted" : "hover:bg-muted"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="font-display text-lg font-bold">{getWeekRange()}</p>
            <p className="text-sm text-muted-foreground">
              {weekOffset === 0 ? "This Week" : weekOffset === 1 ? "Next Week" : `In ${weekOffset} weeks`}
            </p>
          </div>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 3}
            className={cn(
              "rounded-full p-2 transition-colors",
              weekOffset >= 3 ? "text-muted" : "hover:bg-muted"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 font-display text-lg font-bold">Weekly Overview</h3>
          <p className="text-muted-foreground">
            This week brings a blend of opportunities and introspection for {selectedSign.name}. 
            With the {selectedSign.element.toLowerCase()} energy flowing strongly, 
            you'll find yourself {selectedSign.element === "Fire" ? "taking bold initiatives" : 
            selectedSign.element === "Earth" ? "grounding your ambitions" :
            selectedSign.element === "Air" ? "communicating more effectively" : "tuning into your intuition"}.
            Key days to watch: {forecasts.filter(f => f.highlight).map(f => getDayName(f.dayOffset)).join(" and ")}.
          </p>
        </motion.div>

        {/* Daily Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7"
        >
          {forecasts.map((forecast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={cn(
                "rounded-2xl border p-4 backdrop-blur-xl transition-all hover:scale-105",
                forecast.highlight
                  ? "border-accent/50 bg-accent/10"
                  : "border-border bg-card/80"
              )}
            >
              <div className="mb-2 text-center">
                <p className="font-display font-bold">{getDayName(forecast.dayOffset)}</p>
                <p className="text-xs text-muted-foreground">{getDateString(forecast.dayOffset)}</p>
              </div>

              {/* Star Rating */}
              <div className="mb-3 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3 w-3",
                      star <= forecast.rating
                        ? "fill-accent text-accent"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>

              {/* Mood Badge */}
              <div className="mb-2 flex justify-center">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  forecast.highlight
                    ? "bg-accent/30 text-accent"
                    : "bg-muted text-muted-foreground"
                )}>
                  {forecast.mood}
                </span>
              </div>

              {forecast.highlight && (
                <div className="flex justify-center">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Lucky Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-3xl border border-accent/30 bg-accent/10 p-6 text-center"
        >
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-accent" />
          <h3 className="font-display text-lg font-bold">Lucky Days This Week</h3>
          <p className="mt-2 text-muted-foreground">
            {forecasts.filter(f => f.highlight).map(f => `${getDayName(f.dayOffset)} (${getDateString(f.dayOffset)})`).join(" and ")} 
            show exceptional cosmic alignment for {selectedSign.name}!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WeeklyForecast;
