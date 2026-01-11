import { useMemo } from "react";
import { motion } from "framer-motion";

interface CosmicOrbProps {
  color: string;
  size: number;
  x: number;
  y: number;
  delay: number;
}

const CosmicOrb = ({ color, size, x, y, delay }: CosmicOrbProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {/* Main orb glow */}
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0.6,
        }}
      />
      {/* Inner core */}
      <div
        className="absolute rounded-full blur-md"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          left: size * 0.3,
          top: size * 0.3,
          background: `radial-gradient(circle, white 0%, ${color} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      {/* Tentacle drips */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: size * (0.3 + i * 0.2),
            top: size * 0.6,
            width: 2,
            height: size * (0.8 + i * 0.3),
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            opacity: 0.4,
            borderRadius: 2,
          }}
          animate={{
            height: [size * (0.8 + i * 0.3), size * (1 + i * 0.3), size * (0.8 + i * 0.3)],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + i * 0.5,
          }}
        />
      ))}
    </motion.div>
  );
};

interface StarProps {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

const Star = ({ x, y, size, delay, color }: StarProps) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 ${size * 2}px ${color}`,
    }}
    animate={{
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

interface CosmicBackgroundProps {
  orbCount?: number;
  starCount?: number;
  className?: string;
}

export const CosmicBackground = ({
  orbCount = 6,
  starCount = 60,
  className = "",
}: CosmicBackgroundProps) => {
  const orbs = useMemo(() => {
    const colors = [
      "#A855F7", // Purple
      "#EC4899", // Pink
      "#06B6D4", // Cyan
      "#8B5CF6", // Violet
      "#F472B6", // Light pink
      "#22D3EE", // Light cyan
    ];

    return Array.from({ length: orbCount }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: 80 + Math.random() * 100,
      x: 10 + (i * 80) / orbCount + Math.random() * 10,
      y: 15 + Math.random() * 60,
      delay: i * 0.8,
    }));
  }, [orbCount]);

  const stars = useMemo(() => {
    const starColors = ["#ffffff", "#E9D5FF", "#FBCFE8", "#A5F3FC", "#FDE68A"];
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 3,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));
  }, [starCount]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        background: "linear-gradient(180deg, hsl(260 50% 5%) 0%, hsl(240 40% 8%) 50%, hsl(260 45% 10%) 100%)",
        zIndex: 0,
      }}
    >
      {/* Stars layer */}
      {stars.map((star) => (
        <Star key={star.id} {...star} />
      ))}

      {/* Cosmic orbs layer */}
      {orbs.map((orb) => (
        <CosmicOrb key={orb.id} {...orb} />
      ))}

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, hsla(280, 80%, 40%, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 70% 70%, hsla(200, 80%, 40%, 0.1) 0%, transparent 50%)",
        }}
      />
    </div>
  );
};
