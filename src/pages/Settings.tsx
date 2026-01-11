import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bell, Moon, Sun, Globe, Shield, Trash2, ArrowLeft, ChevronRight, Crown, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CosmicBackground } from "@/components/CosmicBackground";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState({
    dailyHoroscope: true,
    weeklyForecast: true,
    celestialEvents: true,
    promotions: false,
  });
  const [language, setLanguage] = useState("en");

  // Mock subscription data
  const subscription = {
    isPremium: true,
    plan: "Yearly",
    renewsAt: "January 15, 2025",
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email to confirm.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={4} starCount={50} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-gradient">Settings</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Crown className="h-5 w-5 text-accent" />
            Subscription
          </h3>
          {subscription.isPremium ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Premium {subscription.plan}</p>
                  <p className="text-sm text-muted-foreground">Renews on {subscription.renewsAt}</p>
                </div>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-500">Active</span>
              </div>
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </div>
          ) : (
            <Link to="/upgrade">
              <Button variant="cosmic" className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                theme === "dark"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Moon className="h-5 w-5" />
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                theme === "light"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Sun className="h-5 w-5" />
              <span className="font-medium">Light</span>
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Horoscope</p>
                <p className="text-sm text-muted-foreground">Get your daily reading at 8 AM</p>
              </div>
              <Switch
                checked={notifications.dailyHoroscope}
                onCheckedChange={(checked) => setNotifications({ ...notifications, dailyHoroscope: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Forecast</p>
                <p className="text-sm text-muted-foreground">Sunday evening summaries</p>
              </div>
              <Switch
                checked={notifications.weeklyForecast}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyForecast: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Celestial Events</p>
                <p className="text-sm text-muted-foreground">Full moons, eclipses & retrogrades</p>
              </div>
              <Switch
                checked={notifications.celestialEvents}
                onCheckedChange={(checked) => setNotifications({ ...notifications, celestialEvents: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-sm text-muted-foreground">Special offers and updates</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Globe className="h-5 w-5" />
            Language
          </h3>
          <button className="flex w-full items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
            <span className="font-medium">English (US)</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </h3>
          <div className="space-y-2">
            <button className="flex w-full items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
              <span className="font-medium">Privacy Policy</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex w-full items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
              <span className="font-medium">Terms of Service</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex w-full items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
              <span className="font-medium">Data & Privacy</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need help? <a href="mailto:support@zodiacz.com" className="text-primary hover:underline">Contact Support</a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Zodiacz v1.0.0</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
