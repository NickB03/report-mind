
import { FolderIcon, MessageCircleIcon } from "lucide-react";

interface AnalystAILogoProps {
  className?: string;
}

const AnalystAILogo = ({ className = "h-8" }: AnalystAILogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2">
        <FolderIcon className="h-full w-full text-black" />
        <MessageCircleIcon className="absolute -top-1 -right-1 h-3/5 w-3/5 text-black" />
      </div>
      <span className="font-bold">AnalystAI</span>
    </div>
  );
};

export default AnalystAILogo;
