import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Camera, Edit3, Crown, Settings, LogOut, ArrowLeft, Calendar, Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isPremium, userZodiacSign, loading, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "See you among the stars! ✨",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CosmicBackground orbCount={5} starCount={60} />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Cosmic Traveler";
  const joinedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={5} starCount={60} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-gradient">Profile</span>
          </div>
          <Link to="/settings" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 text-center backdrop-blur-xl"
        >
          {/* Avatar */}
          <div className="relative mx-auto mb-4 h-28 w-28">
            <div className="flex h-full w-full items-center justify-center rounded-full gradient-cosmic text-4xl font-bold text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
              <Camera className="h-5 w-5" />
            </button>
            {isPremium && (
              <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Crown className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Name & Email */}
          <h1 className="font-display text-2xl font-bold">{displayName}</h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>

          {/* Premium Badge */}
          {isPremium && (
            <Link to="/subscription" className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/30 transition-colors">
              <Crown className="h-4 w-4" />
              Premium Member
            </Link>
          )}

          {/* Edit Button */}
          <div className="mt-6">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Zodiac Sign */}
        {userZodiacSign ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-cosmic">
                <span className="font-zodiac text-4xl text-primary-foreground">{userZodiacSign.symbol}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Zodiac Sign</p>
                <h2 className="font-display text-2xl font-bold">{userZodiacSign.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {userZodiacSign.element} Element • {userZodiacSign.dates}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl text-center"
          >
            <p className="text-muted-foreground mb-4">Set your birth date to discover your zodiac sign</p>
            <Link to="/onboarding">
              <Button variant="cosmic">
                <Sparkles className="mr-2 h-4 w-4" />
                Complete Setup
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Personality Traits */}
        {userZodiacSign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
          >
            <h3 className="mb-4 font-display text-lg font-bold">Personality Traits</h3>
            <div className="flex flex-wrap gap-2">
              {userZodiacSign.traits.map((trait, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary"
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 font-display text-lg font-bold">Account Info</h3>
          <div className="space-y-4">
            {profile?.birth_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Birthday</p>
                  <p className="font-medium">
                    {new Date(profile.birth_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{joinedDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {!isPremium && (
            <Link to="/upgrade" className="block">
              <Button variant="cosmic" className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          )}
          {isPremium && (
            <Link to="/subscription" className="block">
              <Button variant="outline" className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </Link>
          )}
          <Link to="/settings" className="block">
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
