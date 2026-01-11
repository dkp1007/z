import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Bell, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { zodiacSigns } from "@/lib/zodiac";

const interests = [
  "Love & Relationships",
  "Career & Money",
  "Health & Wellness",
  "Personal Growth",
  "Daily Predictions",
  "Moon Phases",
  "Compatibility",
  "Affirmations",
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  // Mock detected sign - in real app this comes from signup
  const detectedSign = zodiacSigns[4]; // Leo

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  const steps = [
    // Step 0: Welcome with zodiac sign
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full gradient-cosmic glow"
      >
        <span className="font-zodiac text-6xl text-primary-foreground">{detectedSign.symbol}</span>
      </motion.div>
      <h1 className="font-display text-3xl font-bold">
        Welcome, <span className="text-gradient">{detectedSign.name}</span>!
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-muted-foreground">
        The stars have aligned for your arrival. Let's set up your cosmic profile.
      </p>
      <div className="mt-6 inline-block rounded-full bg-muted/50 px-6 py-3">
        <p className="text-sm text-muted-foreground">Your sign</p>
        <p className="font-zodiac text-lg">
          {detectedSign.name} • {detectedSign.element} Element {detectedSign.emoji}
        </p>
      </div>
    </motion.div>,

    // Step 1: Theme selection
    <motion.div
      key="theme"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h2 className="font-display text-2xl font-bold">Choose Your Vibe</h2>
      <p className="mt-2 text-muted-foreground">Select your preferred theme</p>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          onClick={() => setTheme("dark")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
            theme === "dark" 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <Moon className="h-10 w-10 text-primary" />
            <span className="font-medium">Cosmic Dark</span>
          </div>
          {theme === "dark" && (
            <div className="absolute right-2 top-2">
              <Check className="h-5 w-5 text-primary" />
            </div>
          )}
        </button>
        
        <button
          onClick={() => setTheme("light")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
            theme === "light" 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <Sun className="h-10 w-10 text-accent" />
            <span className="font-medium">Celestial Light</span>
          </div>
          {theme === "light" && (
            <div className="absolute right-2 top-2">
              <Check className="h-5 w-5 text-primary" />
            </div>
          )}
        </button>
      </div>
    </motion.div>,

    // Step 2: Notifications
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
        <Bell className="h-8 w-8 text-primary" />
      </div>
      <h2 className="font-display text-2xl font-bold">Stay Connected</h2>
      <p className="mt-2 text-muted-foreground">
        Get daily horoscope notifications and cosmic alerts
      </p>
      
      <div className="mt-8 space-y-4">
        <button
          onClick={() => setNotifications(true)}
          className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
            notifications 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable notifications</p>
              <p className="text-sm text-muted-foreground">Never miss your daily forecast</p>
            </div>
            {notifications && <Check className="h-5 w-5 text-primary" />}
          </div>
        </button>
        
        <button
          onClick={() => setNotifications(false)}
          className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
            !notifications 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maybe later</p>
              <p className="text-sm text-muted-foreground">You can enable this anytime in settings</p>
            </div>
            {!notifications && <Check className="h-5 w-5 text-primary" />}
          </div>
        </button>
      </div>
    </motion.div>,

    // Step 3: Interests
    <motion.div
      key="interests"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h2 className="font-display text-2xl font-bold">What Interests You?</h2>
      <p className="mt-2 text-muted-foreground">
        Select topics to personalize your experience
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {interests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              selectedInterests.includes(interest)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {selectedInterests.length} selected
      </p>
    </motion.div>,
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-12">
      <CosmicBackground orbCount={5} starCount={60} />
      
      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl">
          {/* Progress Indicator */}
          <div className="mb-8 flex justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-12 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              {steps[step]}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className={step === 0 ? "invisible" : ""}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {step < steps.length - 1 ? (
              <Button variant="cosmic" onClick={() => setStep(step + 1)}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="gold" onClick={handleComplete}>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
