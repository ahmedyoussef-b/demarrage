const useSpeechSynthesis = () => {
  const speak = (text: string, onEnd?: () => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!("speechSynthesis" in window)) {
        const errorMessage =
          "Votre navigateur ne supporte pas la synthèse vocale.";
        console.error(errorMessage);
        reject(new Error(errorMessage));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR"; // Langue française

      // Gestion de la fin de la lecture
      utterance.onend = () => {
        onEnd?.(); // Appeler le callback onEnd s'il est défini
        resolve(); // Résoudre la promesse
      };

      // Gestion des erreurs
      utterance.onerror = (event) => {
        console.error("Erreur lors de la synthèse vocale :", event.error);
        reject(event.error); // Rejeter la promesse avec l'erreur
      };

      // Démarrer la synthèse vocale
      window.speechSynthesis.speak(utterance);
    });
  };

  return {
    speak,
  };
};

export default useSpeechSynthesis;
