
import React from "react";
import { cn } from "@/lib/utils";

interface HandProps extends React.HTMLAttributes<HTMLDivElement> {
  gesture?: string;
}

/**
 * Hand component for displaying gesture information
 */
const Hand = React.forwardRef<HTMLDivElement, HandProps>(
  ({ className, gesture, ...props }, ref) => {
    // Map gestures to appropriate emojis
    const getGestureEmoji = (gesture: string): string => {
      switch (gesture) {
        case "Wave": return "👋";
        case "Thumbs Up": return "👍";
        case "Peace Sign": return "✌️";
        case "Pointing": return "👉";
        case "Open Palm": return "✋";
        default: return "🤲";
      }
    };

    return (
      <div 
        ref={ref} 
        className={cn("flex items-center justify-center p-4", className)} 
        {...props}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">{getGestureEmoji(gesture || "")}</div>
          <p className="text-sm text-muted-foreground">{gesture || "No gesture detected"}</p>
        </div>
      </div>
    );
  }
);

Hand.displayName = "Hand";

export { Hand };
