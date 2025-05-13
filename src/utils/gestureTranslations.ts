
// Define types for gesture translations
export type GestureTranslation = {
  meaning: string;
  description: string;
};

// Map of gestures to their translations
export const gestureTranslations: Record<string, GestureTranslation> = {
  "Wave": {
    meaning: "Hello / Goodbye",
    description: "A greeting or farewell gesture"
  },
  "Thumbs Up": {
    meaning: "Yes / Approve",
    description: "Indicates agreement or approval"
  },
  "Peace Sign": {
    meaning: "Peace / Victory",
    description: "Represents peace, victory, or the number 2"
  },
  "Pointing": {
    meaning: "Attention / Direction",
    description: "Directs attention to something specific"
  },
  "Open Palm": {
    meaning: "Stop / Wait",
    description: "Indicates a request to pause or wait"
  },
  "No gesture detected": {
    meaning: "N/A",
    description: "No specific gesture is currently being detected"
  }
};

/**
 * Get the translation for a specific gesture
 * @param gesture The detected gesture
 * @returns The translation object or a default if not found
 */
export const getGestureTranslation = (gesture: string): GestureTranslation => {
  return gestureTranslations[gesture] || {
    meaning: "Unknown",
    description: "This gesture is not in our database"
  };
};
