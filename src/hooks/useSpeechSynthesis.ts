import { useCallback } from "react";

const useSpeechSynthesis = () => {
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR"; // Langue française

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Votre navigateur ne supporte pas la synthèse vocale.");
    }
  }, []);

  return { speak };
};

export default useSpeechSynthesis;
