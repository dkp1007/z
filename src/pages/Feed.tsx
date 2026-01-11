import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Share2, MessageCircle, Bookmark, Filter, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import { zodiacSigns } from "@/lib/zodiac";
import { cn } from "@/lib/utils";

type ContentType = "all" | "memes" | "quotes" | "tips";

interface FeedItem {
  id: string;
  type: "meme" | "quote" | "tip";
  content: string;
  author?: string;
  zodiacSign?: string;
  likes: number;
  comments: number;
  gradient: string;
}

const feedItems: FeedItem[] = [
  {
    id: "1",
    type: "quote",
    content: "The stars incline us, they do not bind us. Your destiny is written by your choices.",
    author: "Cosmic Wisdom",
    likes: 2847,
    comments: 156,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    id: "2",
    type: "meme",
    content: "When Mercury is in retrograde but you still have to adult... 😅",
    zodiacSign: "Gemini",
    likes: 5621,
    comments: 423,
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    id: "3",
    type: "tip",
    content: "Aries tip: Channel your fire energy into productive tasks today. Your natural leadership shines brightest when focused.",
    zodiacSign: "Aries",
    likes: 1923,
    comments: 87,
    gradient: "from-red-600 to-orange-600",
  },
  {
    id: "4",
    type: "quote",
    content: "In the cosmic dance of life, every ending is simply a new beginning in disguise.",
    author: "Stellar Thoughts",
    likes: 3421,
    comments: 201,
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    id: "5",
    type: "meme",
    content: "Scorpios pretending they're not overthinking everything: 🙂 (internal screaming)",
    zodiacSign: "Scorpio",
    likes: 8934,
    comments: 567,
    gradient: "from-slate-700 to-purple-900",
  },
  {
    id: "6",
    type: "tip",
    content: "Taurus: Today's energy favors financial planning. Trust your practical instincts when it comes to money matters.",
    zodiacSign: "Taurus",
    likes: 1567,
    comments: 92,
    gradient: "from-green-600 to-emerald-600",
  },
  {
    id: "7",
    type: "quote",
    content: "Like the moon, we all go through phases. Embrace your current phase—it's exactly where you need to be.",
    author: "Luna Whispers",
    likes: 4102,
    comments: 234,
    gradient: "from-slate-600 to-blue-800",
  },
  {
    id: "8",
    type: "meme",
    content: "Libras trying to make a simple decision: *creates 47 pro/con lists*",
    zodiacSign: "Libra",
    likes: 7234,
    comments: 445,
    gradient: "from-pink-500 to-rose-600",
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

const FeedCard = ({ item }: { item: FeedItem }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const sign = item.zodiacSign ? zodiacSigns.find(s => s.name === item.zodiacSign) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-xl"
    >
      {/* Content Area */}
      <div className={cn("flex min-h-[200px] items-center justify-center bg-gradient-to-br p-8", item.gradient)}>
        <div className="text-center">
          {sign && (
            <span className="mb-4 inline-block font-zodiac text-4xl">{sign.symbol}</span>
          )}
          <p className="max-w-md font-display text-lg font-medium text-white sm:text-xl">
            {item.content}
          </p>
          {item.author && (
            <p className="mt-4 text-sm text-white/70">— {item.author}</p>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className={cn(
              "flex items-center gap-1 transition-colors",
              liked ? "text-pink-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
            <span className="text-sm">{formatNumber(item.likes + (liked ? 1 : 0))}</span>
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{formatNumber(item.comments)}</span>
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={cn(
            "transition-colors",
            saved ? "text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
        </button>
      </div>

      {/* Tag */}
      <div className="border-t border-border px-4 py-2">
        <span className={cn(
          "inline-block rounded-full px-3 py-1 text-xs font-medium",
          item.type === "quote" && "bg-purple-500/20 text-purple-400",
          item.type === "meme" && "bg-blue-500/20 text-blue-400",
          item.type === "tip" && "bg-green-500/20 text-green-400",
        )}>
          {item.type === "quote" && "✨ Quote"}
          {item.type === "meme" && "😂 Meme"}
          {item.type === "tip" && "💡 Tip"}
        </span>
      </div>
    </motion.div>
  );
};

const Feed = () => {
  const [filter, setFilter] = useState<ContentType>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = filter === "all"
    ? feedItems
    : feedItems.filter(item => item.type === filter.slice(0, -1) as FeedItem["type"]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground orbCount={5} starCount={50} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold text-gradient">Cosmic Feed</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "rounded-full p-2 transition-colors",
              showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-xl">
                {(["all", "quotes", "memes", "tips"] as ContentType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all",
                      filter === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type === "all" && "✨ All"}
                    {type === "quotes" && "💫 Quotes"}
                    {type === "memes" && "😂 Memes"}
                    {type === "tips" && "💡 Tips"}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeedCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
