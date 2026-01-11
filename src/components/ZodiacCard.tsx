import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ZodiacCardProps {
  name: string;
  symbol: string;
  dates: string;
  element: string;
  emoji: string;
  onClick?: () => void;
  delay?: number;
}

export function ZodiacCard({ name, symbol, dates, element, emoji, onClick, delay = 0 }: ZodiacCardProps) {
  const elementColors: Record<string, string> = {
    Fire: "from-orange-500/20 to-red-600/20 border-orange-500/30 hover:border-orange-400",
    Earth: "from-emerald-500/20 to-green-700/20 border-emerald-500/30 hover:border-emerald-400",
    Air: "from-sky-400/20 to-blue-500/20 border-sky-400/30 hover:border-sky-400",
    Water: "from-cyan-400/20 to-blue-600/20 border-cyan-400/30 hover:border-cyan-400",
  };

  const glowColors: Record<string, string> = {
    Fire: "hover:shadow-orange-500/20",
    Earth: "hover:shadow-emerald-500/20",
    Air: "hover:shadow-sky-400/20",
    Water: "hover:shadow-cyan-400/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300",
        "bg-gradient-to-br",
        elementColors[element],
        glowColors[element],
        "hover:shadow-2xl"
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-zodiac text-4xl">{symbol}</span>
        <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{dates}</p>
        <span className="mt-1 rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          {element} {emoji}
        </span>
      </div>
    </motion.div>
  );
}
