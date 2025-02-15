// hooks/useSpeechSynthesis.ts
const useSpeechSynthesis = () => {
  const speak = (text: string, onEnd?: () => void) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR"; // Langue française

      // Toujours définir onend, même si onEnd est undefined
      utterance.onend = onEnd ? () => onEnd() : null;

      speechSynthesis.speak(utterance);
    } else {
      console.error("Votre navigateur ne supporte pas la synthèse vocale.");
    }
  };

  return {
    speak,
  };
};

export default useSpeechSynthesis;
