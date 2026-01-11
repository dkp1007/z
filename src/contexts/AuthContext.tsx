import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ZodiacSign, zodiacSigns, getZodiacSign, getZodiacSignByName } from "@/lib/zodiac";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  birth_date: string | null;
  zodiac_sign: string | null;
}

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  amount_paid: number | null;
  start_date: string | null;
  end_date: string | null;
  currency: string | null;
  razorpay_order_id: string | null;
  razorpay_subscription_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isPremium: boolean;
  userZodiacSign: ZodiacSign | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const isPremium = subscription?.status === "active" && 
    (subscription?.plan === "monthly" || subscription?.plan === "yearly") &&
    (!subscription?.end_date || new Date(subscription.end_date) > new Date());

  // Determine zodiac sign: first from stored value, then from birth date, then from name
  const userZodiacSign = (() => {
    // First check if there's a stored zodiac sign in profile
    if (profile?.zodiac_sign) {
      return zodiacSigns.find(z => z.name === profile.zodiac_sign) || null;
    }
    
    // If no stored sign but has birth date, calculate from birth date
    if (profile?.birth_date) {
      const birthDate = new Date(profile.birth_date);
      return getZodiacSign(birthDate);
    }
    
    // As fallback, try to get sign from display name using Rashi system
    if (profile?.display_name) {
      return getZodiacSignByName(profile.display_name);
    }
    
    return null;
  })();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
  };

  const fetchSubscription = async (userId: string) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();
    setSubscription(data);
  };

  const refreshSubscription = async () => {
    if (user) {
      await fetchSubscription(user.id);
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
          fetchSubscription(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchSubscription(session.user.id);
      }
      setLoading(false);
    });
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: displayName },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("Not authenticated") };
    
    // Calculate zodiac sign if birth_date is being updated
    let zodiacSign = updates.zodiac_sign;
    if (updates.birth_date && !zodiacSign) {
      const birthDate = new Date(updates.birth_date);
      const sign = getZodiacSign(birthDate);
      zodiacSign = sign.name;
    }
    
    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, zodiac_sign: zodiacSign })
      .eq("user_id", user.id);
    
    if (!error) {
      await fetchProfile(user.id);
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        subscription,
        isPremium,
        userZodiacSign,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
