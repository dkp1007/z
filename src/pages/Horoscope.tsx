import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Star, 
  Moon, 
  Sparkles, 
  Heart, 
  Clock,
  Palette,
  Hash,
  ArrowLeft,
  Crown,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { ShareableCard } from "@/components/ShareableCard";
import { zodiacSigns } from "@/lib/zodiac";
import { 
  generateHoroscope, 
  getDateOffset, 
  formatDateForPeriod, 
  HoroscopePeriod, 
  HoroscopeData 
} from "@/lib/horoscope-data";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const periods: { id: HoroscopePeriod; label: string; icon: typeof Calendar }[] = [
  { id: "daily", label: "Daily", icon: Calendar },
  { id: "weekly", label: "Weekly", icon: Calendar },
  { id: "monthly", label: "Monthly", icon: Calendar },
];

const Horoscope = () => {
  const { user, userZodiacSign } = useAuth();
  
  // Use user's sign from auth context, fallback to Leo
  const userSign = userZodiacSign || zodiacSigns[4];
  
  const [selectedSign, setSelectedSign] = useState<typeof zodiacSigns[number]>(userSign);
  const [selectedPeriod, setSelectedPeriod] = useState<HoroscopePeriod>("daily");
  const [dateOffset, setDateOffset] = useState(0);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showSignSelector, setShowSignSelector] = useState(false);

  const currentDate = useMemo(() => getDateOffset(new Date(), dateOffset), [dateOffset]);
  
  // Pass user ID to generate unique horoscope
  const horoscope = useMemo(() => 
    generateHoroscope(selectedSign, selectedPeriod, currentDate, user?.id),
    [selectedSign, selectedPeriod, currentDate, user?.id]
  );

  const canGoForward = dateOffset < 0;
  const canGoBack = selectedPeriod === "daily" ? dateOffset > -7 : selectedPeriod === "weekly" ? dateOffset > -28 : dateOffset > -60;

  const handlePreviousPeriod = () => {
    if (canGoBack) {
      if (selectedPeriod === "daily") setDateOffset(d => d - 1);
      else if (selectedPeriod === "weekly") setDateOffset(d => d - 7);
      else setDateOffset(d => d - 30);
    }
  };

  const handleNextPeriod = () => {
    if (canGoForward) {
      if (selectedPeriod === "daily") setDateOffset(d => d + 1);
      else if (selectedPeriod === "weekly") setDateOffset(d => d + 7);
      else setDateOffset(d => d + 30);
    }
  };

  const elementColors: Record<string, string> = {
    Fire: "from-orange-500 to-red-600",
    Earth: "from-emerald-500 to-green-700",
    Air: "from-sky-400 to-blue-500",
    Water: "from-cyan-400 to-blue-600",
  };

  return (
    <div className="relative min-h-screen">
      <CosmicBackground orbCount={5} starCount={50} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">Horoscope</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowShareCard(true)}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        {/* Sign Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            className="w-full justify-between rounded-xl border-border bg-card/50 p-4 backdrop-blur-sm"
            onClick={() => setShowSignSelector(!showSignSelector)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                elementColors[selectedSign.element]
              )}>
                <span className="font-zodiac text-2xl text-white">{selectedSign.symbol}</span>
              </div>
              <div className="text-left">
                <p className="font-display font-semibold">{selectedSign.name}</p>
                <p className="text-sm text-muted-foreground">{selectedSign.dates}</p>
              </div>
            </div>
            <ChevronRight className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              showSignSelector && "rotate-90"
            )} />
          </Button>

          <AnimatePresence>
            {showSignSelector && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm"
              >
                <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                  {zodiacSigns.map((sign) => (
                    <button
                      key={sign.name}
                      onClick={() => {
                        setSelectedSign(sign);
                        setShowSignSelector(false);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg p-3 transition-colors",
                        selectedSign.name === sign.name
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <span className="font-zodiac text-2xl">{sign.symbol}</span>
                      <span className="text-xs font-medium">{sign.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Period Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex gap-2"
        >
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => {
                setSelectedPeriod(period.id);
                setDateOffset(0);
              }}
              className={cn(
                "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                selectedPeriod === period.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              {period.label}
            </button>
          ))}
        </motion.div>

        {/* Date Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousPeriod}
            disabled={!canGoBack}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="font-display font-semibold">
              {formatDateForPeriod(currentDate, selectedPeriod)}
            </p>
            {dateOffset === 0 && (
              <p className="text-xs text-primary">Today</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPeriod}
            disabled={!canGoForward}
            className="h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Main Horoscope Card */}
        <motion.div
          key={`${selectedSign.name}-${selectedPeriod}-${dateOffset}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
        >
          {/* Header */}
          <div className={cn(
            "bg-gradient-to-r p-6",
            elementColors[selectedSign.element]
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <span className="font-zodiac text-4xl text-white">{selectedSign.symbol}</span>
                </div>
                <div className="text-white">
                  <h1 className="font-display text-2xl font-bold">{selectedSign.name}</h1>
                  <p className="text-white/80">{selectedSign.element} Sign • {selectedSign.emoji}</p>
                </div>
              </div>
              <div className="text-right text-white">
                <p className="text-sm text-white/60">Mood</p>
                <p className="font-display text-lg font-semibold">{horoscope.mood}</p>
              </div>
            </div>
          </div>

          {/* Prediction */}
          <div className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold">
                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Prediction
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-foreground/90">
              {horoscope.prediction}
            </p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall Rating:</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < horoscope.rating
                        ? "fill-accent text-accent"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lucky Info Grid */}
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            <div className="flex items-center gap-3 bg-card/80 p-4">
              <Hash className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Lucky Number</p>
                <p className="font-zodiac text-xl font-bold text-primary">{horoscope.luckyNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/80 p-4">
              <Palette className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Lucky Color</p>
                <p className="font-zodiac text-xl font-bold text-accent">{horoscope.luckyColor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/80 p-4">
              <Clock className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Lucky Time</p>
                <p className="font-zodiac text-xl font-bold text-secondary">{horoscope.luckyTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/80 p-4">
              <Heart className="h-5 w-5 text-cosmic-pink" />
              <div>
                <p className="text-xs text-muted-foreground">Best Match</p>
                <p className="font-zodiac text-xl font-bold" style={{ color: "hsl(var(--cosmic-pink))" }}>
                  {horoscope.compatibility}
                </p>
              </div>
            </div>
          </div>

          {/* Advice Section */}
          <div className="border-t border-border p-6">
            <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-4">
              <Moon className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cosmic Advice</p>
                <p className="mt-1 text-foreground">{horoscope.advice}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="cosmic"
            size="lg"
            className="w-full"
            onClick={() => setShowShareCard(true)}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Your Horoscope
          </Button>
        </motion.div>

        {/* Premium Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-accent/20 p-3">
              <Crown className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold">Unlock Full Insights</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get personalized AI predictions, celestial alerts, and unlimited horoscope access with Premium.
              </p>
              <Button variant="gold" size="sm" className="mt-3" asChild>
                <Link to="/upgrade">
                  Go Premium
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Share Card Modal */}
      <AnimatePresence>
        {showShareCard && (
          <ShareableCard
            horoscope={horoscope}
            onClose={() => setShowShareCard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Horoscope;
