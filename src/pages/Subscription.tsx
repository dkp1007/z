import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, CreditCard, Calendar, AlertCircle, ArrowLeft, Check, XCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, subscription, isPremium, loading, refreshSubscription } = useAuth();
  const [cancelling, setCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return;
    
    setCancelling(true);
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          status: "cancelled",
          end_date: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshSubscription();
      
      toast({
        title: "Subscription Cancelled",
        description: "Your premium access has been cancelled. You can resubscribe anytime.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "monthly":
        return "Monthly Premium";
      case "yearly":
        return "Yearly Premium";
      default:
        return "Free Plan";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={5} starCount={60} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-gradient">Subscription</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Current Plan</h2>
            {isPremium && (
              <div className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
                <Crown className="h-4 w-4" />
                Active
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${isPremium ? 'gradient-cosmic' : 'bg-muted'}`}>
              <Crown className={`h-8 w-8 ${isPremium ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">
                {getPlanLabel(subscription?.plan || "free")}
              </h3>
              <p className={`text-sm font-medium ${getStatusColor(subscription?.status || "inactive")}`}>
                {subscription?.status === "active" ? "Active" : 
                 subscription?.status === "cancelled" ? "Cancelled" : "Inactive"}
              </p>
            </div>
          </div>

          {/* Plan Details */}
          {subscription && (
            <div className="space-y-3 rounded-2xl bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Amount Paid</span>
                </div>
                <span className="font-medium">
                  {subscription.amount_paid 
                    ? `₹${(subscription.amount_paid / 100).toFixed(2)}`
                    : "Free"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Start Date</span>
                </div>
                <span className="font-medium">{formatDate(subscription.start_date)}</span>
              </div>
              {subscription.end_date && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{subscription.status === "cancelled" ? "Ended" : "Renews"}</span>
                  </div>
                  <span className="font-medium">{formatDate(subscription.end_date)}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Premium Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl"
        >
          <h3 className="font-display text-lg font-bold mb-4">Premium Benefits</h3>
          <div className="space-y-3">
            {[
              "Access to Luck Meter",
              "Personalized daily readings",
              "Detailed compatibility analysis",
              "Ad-free experience",
              "Priority cosmic insights",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isPremium ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                  <Check className="h-4 w-4" />
                </div>
                <span className={isPremium ? "text-foreground" : "text-muted-foreground"}>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {!isPremium ? (
            <Link to="/upgrade" className="block">
              <Button variant="cosmic" className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Cancel Subscription?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your premium subscription? You'll lose access to:
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Luck Meter</li>
                      <li>Personalized daily readings</li>
                      <li>Detailed compatibility analysis</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border">Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {cancelling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;
