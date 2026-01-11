import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { ZodiacCard } from "@/components/ZodiacCard";
import { Navbar } from "@/components/Navbar";
import { zodiacSigns } from "@/lib/zodiac";
import { Link } from "react-router-dom";
import { Moon, Star, Heart, Zap, TrendingUp } from "lucide-react";
import jellyscopeLogo from "@/assets/jellyscope-logo.png";

const Index = () => {
  const features = [
    {
      icon: Moon,
      title: "Daily Horoscopes",
      description: "Get personalized predictions every day based on your zodiac sign",
    },
    {
      icon: Heart,
      title: "Love Compatibility",
      description: "Discover your perfect match with our zodiac compatibility checker",
    },
    {
      icon: Zap,
      title: "Luck Intelligence",
      description: "Know your lucky colors, numbers, and best times for success",
    },
    {
      icon: TrendingUp,
      title: "Weekly Forecasts",
      description: "Plan ahead with detailed weekly and monthly predictions",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <CosmicBackground orbCount={8} starCount={100} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm overflow-hidden"
            >
              <img src={jellyscopeLogo} alt="Jellyscope" className="h-full w-full object-cover" />
            </motion.div>
            
            <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
              <span className="text-gradient">Your Stars.</span>
              <br />
              <span className="text-foreground">Your Story.</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              Discover your daily luck intelligence, zodiac insights, and cosmic guidance — 
              all in one aesthetic, bite-sized experience.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button variant="cosmic" size="xl" asChild>
                <Link to="/signup">
                  <Star className="mr-2 h-5 w-5" />
                  Start Free
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/horoscope">Read Today's Horoscope</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Zodiac Ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex gap-4"
            >
              {zodiacSigns.slice(0, 6).map((sign, i) => (
                <span
                  key={sign.name}
                  className="font-zodiac text-2xl text-muted-foreground/50"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {sign.symbol}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Unlock Your <span className="text-gradient">Cosmic Potential</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Everything you need to navigate life with the stars as your guide
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Signs Grid */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Find Your <span className="text-gradient-gold">Sign</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Select your zodiac sign to unlock personalized insights and daily guidance
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {zodiacSigns.map((sign, i) => (
              <ZodiacCard
                key={sign.name}
                {...sign}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 overflow-hidden py-24">
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-card/80 p-8 text-center backdrop-blur-xl md:p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full overflow-hidden">
              <img src={jellyscopeLogo} alt="Jellyscope" className="h-full w-full object-cover" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to Read the Stars?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of cosmic explorers getting daily insights, luck predictions, 
              and zodiac wisdom delivered to their fingertips.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/upgrade">View Premium</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <img src={jellyscopeLogo} alt="Jellyscope" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-display text-lg font-bold text-gradient">Jellyscope</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Jellyscope. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
