import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: "default" | "ghost" | "outline" | "cosmic" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const ShareButton = ({ 
  title, 
  text, 
  url = window.location.href,
  variant = "ghost",
  size = "icon",
  className 
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${text}\n\n${url}`);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  };

  const openShareLink = (link: string) => {
    window.open(link, "_blank", "width=600,height=400");
  };

  // Use native share on mobile if available
  if (navigator.share) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleNativeShare}
      >
        <Share2 className="h-4 w-4" />
        {size !== "icon" && <span className="ml-2">Share</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4" />
          {size !== "icon" && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-border bg-card">
        <DropdownMenuItem 
          onClick={() => openShareLink(shareLinks.twitter)}
          className="cursor-pointer"
        >
          <Twitter className="mr-2 h-4 w-4" />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => openShareLink(shareLinks.facebook)}
          className="cursor-pointer"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => openShareLink(shareLinks.whatsapp)}
          className="cursor-pointer"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="cursor-pointer"
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Link2 className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
