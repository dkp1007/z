import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <CosmicBackground orbCount={6} starCount={80} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full gradient-cosmic glow"
        >
          <span className="font-zodiac text-5xl text-primary-foreground">✦</span>
        </motion.div>
        
        <h1 className="font-display text-6xl font-bold text-gradient">404</h1>
        <p className="mt-4 text-xl font-medium text-foreground">Lost in the Cosmos</p>
        <p className="mt-2 text-muted-foreground">
          The stars couldn't guide us to this page. It may have drifted into another dimension.
        </p>
        
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="cosmic" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Zodiacz</span>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
