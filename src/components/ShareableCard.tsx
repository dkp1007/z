import { motion } from "framer-motion";
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoroscopeData } from "@/lib/horoscope-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ShareableCardProps {
  horoscope: HoroscopeData;
  onClose: () => void;
}

const elementGradients: Record<string, string> = {
  Fire: "from-orange-500 via-red-500 to-rose-600",
  Earth: "from-emerald-500 via-green-600 to-teal-700",
  Air: "from-sky-400 via-blue-500 to-indigo-600",
  Water: "from-cyan-400 via-blue-500 to-purple-600",
};

export const ShareableCard = ({ horoscope, onClose }: ShareableCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const gradient = elementGradients[horoscope.sign.element] || elementGradients.Fire;
  
  const shareText = `✨ ${horoscope.sign.name} ${horoscope.sign.symbol} ${horoscope.period.charAt(0).toUpperCase() + horoscope.period.slice(1)} Horoscope\n\n${horoscope.prediction.slice(0, 150)}...\n\n🌙 Mood: ${horoscope.mood}\n🔢 Lucky Number: ${horoscope.luckyNumber}\n🎨 Lucky Color: ${horoscope.luckyColor}\n\n— via Zodiacz ✨`;
  
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(window.location.href);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText + `\n\n${window.location.href}`);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Share your horoscope with friends",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${horoscope.sign.name} Horoscope`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    }
  };

  const openShareLink = (link: string) => {
    window.open(link, "_blank", "width=600,height=400");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shareable Card Preview */}
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl",
            gradient
          )}
        >
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <span className="font-zodiac text-3xl">{horoscope.sign.symbol}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{horoscope.sign.name}</h3>
                  <p className="text-sm text-white/80">{horoscope.sign.dates}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-white/60">
                  {horoscope.period}
                </p>
                <p className="font-zodiac text-lg">{horoscope.mood}</p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-white/90">
              {horoscope.prediction.slice(0, 180)}...
            </p>

            <div className="flex justify-between rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-xs text-white/60">Lucky #</p>
                <p className="font-zodiac text-lg font-bold">{horoscope.luckyNumber}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60">Color</p>
                <p className="font-zodiac text-lg font-bold">{horoscope.luckyColor}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60">Match</p>
                <p className="font-zodiac text-lg font-bold">{horoscope.compatibility}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60">
              <span>✨</span>
              <span className="font-display font-medium">Zodiacz</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {navigator.share ? (
            <Button
              variant="glass"
              className="col-span-2"
              onClick={handleNativeShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          ) : (
            <>
              <Button
                variant="glass"
                onClick={() => openShareLink(shareLinks.twitter)}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="glass"
                onClick={() => openShareLink(shareLinks.whatsapp)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </>
          )}
          <Button
            variant="glass"
            className={navigator.share ? "" : "col-span-2"}
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Text"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="mt-3 w-full text-muted-foreground"
          onClick={onClose}
        >
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
};
