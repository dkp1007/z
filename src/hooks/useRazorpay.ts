import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (plan: "monthly" | "yearly", onSuccess: () => void) => {
    setIsLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please log in to continue");
      }

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { plan },
      });

      if (error) throw error;

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Zodiacz Premium",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const { error: verifyError } = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              },
            });

            if (verifyError) throw verifyError;

            toast({
              title: "Welcome to Premium! 🌟",
              description: "Your subscription is now active. Enjoy all premium features!",
            });

            onSuccess();
          } catch (err: any) {
            toast({
              title: "Payment Verification Failed",
              description: err.message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#8b5cf6",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, isLoading };
}
