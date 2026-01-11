import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Users, Share2, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { zodiacSigns, ZodiacSign } from "@/lib/zodiac";
import { cn } from "@/lib/utils";

const calculateCompatibility = (sign1: ZodiacSign, sign2: ZodiacSign): { love: number; friendship: number; communication: number; trust: number } => {
  const elementCompatibility: Record<string, Record<string, number>> = {
    Fire: { Fire: 85, Earth: 50, Air: 90, Water: 40 },
    Earth: { Fire: 50, Earth: 80, Air: 55, Water: 85 },
    Air: { Fire: 90, Earth: 55, Air: 75, Water: 60 },
    Water: { Fire: 40, Earth: 85, Air: 60, Water: 90 },
  };

  const baseScore = elementCompatibility[sign1.element][sign2.element];
  const variance = () => Math.floor(Math.random() * 15) - 7;

  return {
    love: Math.min(100, Math.max(20, baseScore + variance())),
    friendship: Math.min(100, Math.max(20, baseScore + variance() + 5)),
    communication: Math.min(100, Math.max(20, baseScore + variance())),
    trust: Math.min(100, Math.max(20, baseScore + variance() - 3)),
  };
};

const getCompatibilityMessage = (score: number): string => {
  if (score >= 85) return "Cosmic soulmates! Your connection is written in the stars.";
  if (score >= 70) return "Strong compatibility! You bring out the best in each other.";
  if (score >= 55) return "Good potential! With effort, you can build something beautiful.";
  if (score >= 40) return "Challenging but possible. Differences can lead to growth.";
  return "Opposites attract? This pairing requires patience and understanding.";
};

const Compatibility = () => {
  const [yourSign, setYourSign] = useState<ZodiacSign>(zodiacSigns[0]);
  const [theirSign, setTheirSign] = useState<ZodiacSign | null>(null);
  const [mode, setMode] = useState<"love" | "friendship">("love");
  const [showResult, setShowResult] = useState(false);
  const [compatibility, setCompatibility] = useState<{ love: number; friendship: number; communication: number; trust: number } | null>(null);

  const handleCheck = () => {
    if (theirSign) {
      setCompatibility(calculateCompatibility(yourSign, theirSign));
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setTheirSign(null);
    setShowResult(false);
    setCompatibility(null);
  };

  const overallScore = compatibility
    ? mode === "love"
      ? Math.round((compatibility.love + compatibility.trust) / 2)
      : Math.round((compatibility.friendship + compatibility.communication) / 2)
    : 0;

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
            <span className="font-display text-xl font-bold text-gradient">Compatibility</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex rounded-full bg-muted/50 p-1">
            <button
              onClick={() => setMode("love")}
              className={cn(
                "flex items-center gap-2 rounded-full px-6 py-2 transition-all",
                mode === "love" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className="h-4 w-4" />
              <span>Love</span>
            </button>
            <button
              onClick={() => setMode("friendship")}
              className={cn(
                "flex items-center gap-2 rounded-full px-6 py-2 transition-all",
                mode === "friendship" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="h-4 w-4" />
              <span>Friendship</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Your Sign */}
              <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl">
                <h3 className="mb-4 text-center font-display text-lg font-semibold">Your Sign</h3>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-12">
                  {zodiacSigns.map((sign) => (
                    <button
                      key={sign.name}
                      onClick={() => setYourSign(sign)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl p-2 transition-all",
                        yourSign.name === sign.name
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <span className="font-zodiac text-2xl">{sign.symbol}</span>
                      <span className="text-[10px] font-medium">{sign.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Their Sign */}
              <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl">
                <h3 className="mb-4 text-center font-display text-lg font-semibold">Their Sign</h3>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-12">
                  {zodiacSigns.map((sign) => (
                    <button
                      key={sign.name}
                      onClick={() => setTheirSign(sign)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl p-2 transition-all",
                        theirSign?.name === sign.name
                          ? "bg-accent/20 ring-2 ring-accent"
                          : "hover:bg-muted"
                      )}
                    >
                      <span className="font-zodiac text-2xl">{sign.symbol}</span>
                      <span className="text-[10px] font-medium">{sign.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Check Button */}
              <div className="flex justify-center">
                <Button
                  variant="cosmic"
                  size="lg"
                  onClick={handleCheck}
                  disabled={!theirSign}
                  className="px-12"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Check Compatibility
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Main Result Card */}
              <div className="rounded-3xl border border-border bg-card/80 p-8 text-center backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-cosmic">
                      <span className="font-zodiac text-4xl text-primary-foreground">{yourSign.symbol}</span>
                    </div>
                    <span className="mt-2 font-medium">{yourSign.name}</span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    {mode === "love" ? (
                      <Heart className="h-6 w-6 text-accent" />
                    ) : (
                      <Users className="h-6 w-6 text-accent" />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-cosmic">
                      <span className="font-zodiac text-4xl text-primary-foreground">{theirSign?.symbol}</span>
                    </div>
                    <span className="mt-2 font-medium">{theirSign?.name}</span>
                  </div>
                </div>

                {/* Score Circle */}
                <div className="relative mx-auto mb-6 h-40 w-40">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: overallScore / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ strokeDasharray: "440", strokeDashoffset: "0" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="font-display text-4xl font-bold text-gradient"
                    >
                      {overallScore}%
                    </motion.span>
                    <span className="text-sm text-muted-foreground">Match</span>
                  </div>
                </div>

                <p className="mb-6 text-lg text-muted-foreground">{getCompatibilityMessage(overallScore)}</p>

                {/* Detailed Scores */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {compatibility && (
                    <>
                      <div className="rounded-xl bg-muted/50 p-4">
                        <Heart className="mx-auto mb-2 h-5 w-5 text-pink-500" />
                        <div className="font-display text-2xl font-bold">{compatibility.love}%</div>
                        <div className="text-xs text-muted-foreground">Love</div>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-4">
                        <Users className="mx-auto mb-2 h-5 w-5 text-blue-500" />
                        <div className="font-display text-2xl font-bold">{compatibility.friendship}%</div>
                        <div className="text-xs text-muted-foreground">Friendship</div>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-4">
                        <Sparkles className="mx-auto mb-2 h-5 w-5 text-accent" />
                        <div className="font-display text-2xl font-bold">{compatibility.communication}%</div>
                        <div className="text-xs text-muted-foreground">Communication</div>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-4">
                        <Heart className="mx-auto mb-2 h-5 w-5 text-green-500" />
                        <div className="font-display text-2xl font-bold">{compatibility.trust}%</div>
                        <div className="text-xs text-muted-foreground">Trust</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="cosmic">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Results
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Compatibility;
