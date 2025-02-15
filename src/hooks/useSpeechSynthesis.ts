// hooks/useSpeechSynthesis.ts
const useSpeechSynthesis = () => {
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR"; // Langue française
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
