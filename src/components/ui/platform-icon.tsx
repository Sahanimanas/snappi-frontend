import { Instagram, Youtube, Twitter, Facebook, Twitch } from "lucide-react";

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export const PlatformIcon = ({ platform, className = "h-4 w-4" }: PlatformIconProps) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "x (twitter)":
    case "twitter":
      return <Twitter className={className} />;
    case "facebook":
      return <Facebook className={className} />;
    case "tiktok":
      return <div className={`${className} bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold`}>T</div>;
    case "twitch":
      return <Twitch className={className} />;
    case "threads":
      return <div className={`${className} bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold`}>@</div>;
    case "pinterest":
      return <div className={`${className} bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold`}>P</div>;
    default:
      return <div className={`${className} bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold`}>?</div>;
  }
};