import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Crown, Zap, Star, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRazorpay } from "@/hooks/useRazorpay";

const plans = [
  {
    id: "monthly" as const,
    name: "Monthly",
    price: 4.99,
    priceINR: "₹415",
    period: "/month",
    savings: null,
  },
  {
    id: "yearly" as const,
    name: "Yearly",
    price: 49.99,
    priceINR: "₹4,150",
    period: "/year",
    savings: "Save 17%",
    popular: true,
  },
];

const features = {
  free: [
    "Basic daily horoscope",
    "Zodiac personality profile",
    "Limited content feed",
    "Today's mood vibe",
    "Dark/light theme",
  ],
  premium: [
    "Everything in Free, plus:",
    "Daily Luck Intelligence dashboard",
    "Lucky color, number & time",
    "Love, career, money & health meters",
    "Personalized affirmations based on your sign",
    "Weekly & monthly forecasts",
    "Advanced compatibility checker",
    "Celestial event alerts",
    "Shareable zodiac cards",
    "AI Zodiac Assistant",
    "Ad-free experience",
    "Priority support",
  ],
};

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "We offer a 7-day free trial for new premium subscribers. Cancel within 7 days and you won't be charged.",
  },
  {
    q: "How accurate are the predictions?",
    a: "Our predictions combine traditional astrology with AI-powered personalization for highly relevant insights.",
  },
  {
    q: "Can I switch between plans?",
    a: "Absolutely! You can upgrade from monthly to yearly at any time. We'll prorate your remaining balance.",
  },
];

const Upgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const navigate = useNavigate();
  const { user, isPremium, refreshSubscription, loading } = useAuth();
  const { initiatePayment, isLoading } = useRazorpay();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isPremium) {
      navigate("/luck-meter");
    }
  }, [isPremium, navigate]);

  const handleSubscribe = async () => {
    await initiatePayment(selectedPlan, async () => {
      await refreshSubscription();
      navigate("/luck-meter");
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <CosmicBackground orbCount={7} starCount={70} />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-center">
            <Sparkles className="mx-auto h-12 w-12 text-accent" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={7} starCount={70} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-cosmic glow">
            <Crown className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold">
            Unlock Your <span className="text-gradient">Cosmic Potential</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Get personalized daily luck intelligence, advanced forecasts, and exclusive zodiac insights with Premium.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 md:grid-cols-2"
        >
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative rounded-3xl border-2 p-6 text-left transition-all",
                selectedPlan === plan.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/80 hover:border-primary/50"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-foreground">
                  MOST POPULAR
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-bold">{plan.name}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold">{plan.priceINR}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">(≈ ${plan.price} USD)</p>
                  {plan.savings && (
                    <span className="mt-2 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-500">
                      {plan.savings}
                    </span>
                  )}
                </div>
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  selectedPlan === plan.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}>
                  {selectedPlan === plan.id && <Check className="h-4 w-4 text-primary-foreground" />}
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Subscribe Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <Button
            variant="cosmic"
            size="lg"
            className="px-12 py-6 text-lg"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Pay with Razorpay
              </>
            )}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Secure payment via Razorpay. Cancel anytime.
          </p>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 grid gap-6 md:grid-cols-2"
        >
          {/* Free */}
          <div className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-display text-lg font-bold">Free</h3>
            </div>
            <ul className="space-y-3">
              {features.free.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="rounded-3xl border border-primary/50 bg-primary/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-accent" />
              <h3 className="font-display text-lg font-bold text-gradient">Premium</h3>
            </div>
            <ul className="space-y-3">
              {features.premium.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-6 text-center font-display text-xl font-bold">Frequently Asked Questions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl bg-muted/50 p-4">
                <p className="font-medium">{faq.q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Maybe Later */}
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
            Maybe later
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
