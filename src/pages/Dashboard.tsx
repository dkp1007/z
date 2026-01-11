import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Star, Heart, Zap, Home, User, Compass, Menu, X, Crown, Settings, LogOut, Share2 } from "lucide-react";
import jellyscopeLogo from "@/assets/jellyscope-logo.png";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { ShareButton } from "@/components/ShareButton";
import { zodiacSigns } from "@/lib/zodiac";
import { generateHoroscope } from "@/lib/horoscope-data";
import { generateLuckValues } from "@/lib/luck-utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, userZodiacSign, isPremium, signOut, loading } = useAuth();
  
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Cosmic Explorer";
  const currentSign = userZodiacSign || zodiacSigns[4]; // Fallback to Leo

  // Generate personalized horoscope based on user ID
  const todayHoroscope = useMemo(() => {
    const horoscope = generateHoroscope(currentSign, "daily", new Date(), user?.id);
    return {
      mood: horoscope.mood,
      summary: horoscope.prediction,
      luckyNumber: horoscope.luckyNumber,
      luckyColor: horoscope.luckyColor,
    };
  }, [currentSign, user?.id]);

  // Generate personalized luck meters using shared utility
  const luckValues = useMemo(() => 
    generateLuckValues(user?.id, currentSign.name),
    [user?.id, currentSign.name]
  );

  const luckMeters = [
    { label: "Love", value: luckValues.love, icon: Heart, color: "from-pink-500 to-rose-500" },
    { label: "Career", value: luckValues.career, icon: Zap, color: "from-amber-500 to-orange-500" },
    { label: "Health", value: luckValues.health, icon: Star, color: "from-emerald-500 to-green-500" },
    { label: "Money", value: luckValues.money, icon: Crown, color: "from-violet-500 to-purple-500" },
  ];

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Moon, label: "Horoscope", href: "/horoscope" },
    { icon: Compass, label: "Compatibility", href: "/compatibility" },
    { icon: Star, label: "Luck Meter", href: "/luck-meter", premium: true },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "See you among the stars! ✨",
    });
    navigate("/");
  };

  const horoscopeShareText = `✨ ${currentSign.name} ${currentSign.symbol} Daily Horoscope\n\n${todayHoroscope.summary}\n\n🌙 Mood: ${todayHoroscope.mood}\n🔢 Lucky Number: ${todayHoroscope.luckyNumber}\n🎨 Lucky Color: ${todayHoroscope.luckyColor}\n\n— via Zodiacz ✨`;

  return (
    <div className="relative flex min-h-screen">
      <CosmicBackground orbCount={4} starCount={40} />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card/95 backdrop-blur-xl transition-transform duration-300 md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <img src={jellyscopeLogo} alt="Jellyscope" className="h-8 w-8 object-contain" />
            <span className="font-display text-xl font-bold text-gradient">Jellyscope</span>
          </div>

          {/* User Info */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent">
                <span className="font-zodiac text-xl text-primary-foreground">{currentSign.symbol}</span>
              </div>
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-sm text-muted-foreground">{currentSign.name}</p>
              </div>
            </div>
            {!isPremium && (
              <Button variant="gold" size="sm" className="mt-3 w-full" asChild>
                <Link to="/upgrade">
                  <Crown className="mr-2 h-4 w-4" />
                  Go Premium
                </Link>
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      item.active 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.premium && !isPremium && (
                      <Crown className="ml-auto h-3.5 w-3.5 text-accent" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-xl md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src={jellyscopeLogo} alt="Jellyscope" className="h-6 w-6 object-contain" />
            <span className="font-display font-bold text-gradient">Jellyscope</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="p-6 md:p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold">
              Good morning, <span className="text-gradient">{displayName}</span> ✨
            </h1>
            <p className="mt-2 text-muted-foreground">
              Here's your cosmic forecast for today
            </p>
          </motion.div>

          {/* Today's Horoscope Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-cosmic">
                  <span className="font-zodiac text-2xl text-primary-foreground">{currentSign.symbol}</span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">Today's Horoscope</h2>
                  <p className="text-sm text-muted-foreground">{currentSign.name} • {currentSign.dates}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton 
                  title={`${currentSign.name} Daily Horoscope`}
                  text={horoscopeShareText}
                />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Mood</p>
                  <p className="font-medium text-primary">{todayHoroscope.mood}</p>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-foreground/90">{todayHoroscope.summary}</p>
            
            <div className="mt-4 flex gap-4">
              <div className="rounded-lg bg-muted/50 px-4 py-2">
                <p className="text-xs text-muted-foreground">Lucky Number</p>
                <p className="font-zodiac text-lg text-primary">{todayHoroscope.luckyNumber}</p>
              </div>
              <div className="rounded-lg bg-muted/50 px-4 py-2">
                <p className="text-xs text-muted-foreground">Lucky Color</p>
                <p className="font-zodiac text-lg text-accent">{todayHoroscope.luckyColor}</p>
              </div>
            </div>
          </motion.div>

          {/* Luck Meters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Daily Luck Intelligence</h2>
              {!isPremium && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/upgrade">
                    <Crown className="mr-2 h-4 w-4 text-accent" />
                    Unlock Full Insights
                  </Link>
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {luckMeters.map((meter, i) => (
                <motion.div
                  key={meter.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm",
                    !isPremium && i > 0 && "opacity-50"
                  )}
                >
                  {!isPremium && i > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <Crown className="h-6 w-6 text-accent" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <meter.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{meter.label}</span>
                    </div>
                    <span className="font-zodiac text-lg">{meter.value}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meter.value}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      className={cn("h-full rounded-full bg-gradient-to-r", meter.color)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Link
              to="/horoscope"
              className="group rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <Moon className="mb-3 h-8 w-8 text-secondary transition-colors group-hover:text-primary" />
              <h3 className="font-display font-semibold">Full Horoscope</h3>
              <p className="mt-1 text-sm text-muted-foreground">Read your detailed daily prediction</p>
            </Link>
            
            <Link
              to="/compatibility"
              className="group rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <Heart className="mb-3 h-8 w-8 text-cosmic-pink transition-colors group-hover:text-primary" />
              <h3 className="font-display font-semibold">Compatibility</h3>
              <p className="mt-1 text-sm text-muted-foreground">Check your zodiac match</p>
            </Link>
            
            <Link
              to="/feed"
              className="group rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <Compass className="mb-3 h-8 w-8 text-cosmic-teal transition-colors group-hover:text-primary" />
              <h3 className="font-display font-semibold">Zodiac Feed</h3>
              <p className="mt-1 text-sm text-muted-foreground">Memes, quotes & more</p>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
