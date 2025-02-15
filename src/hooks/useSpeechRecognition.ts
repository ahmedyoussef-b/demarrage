// hooks/useSpeechRecognition.ts
import { useEffect, useState } from "react";

// Déclaration des types pour SpeechRecognition (si nécessaire)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState(""); // Texte transcrit
  const [isListening, setIsListening] = useState(false); // État de l'écoute

  useEffect(() => {
    // Vérifier si l'API SpeechRecognition est disponible
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        "Votre navigateur ne supporte pas la reconnaissance vocale."
      );
      return;
    }

    // Initialiser la reconnaissance vocale
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Continue à écouter même après une pause
    recognition.interimResults = true; // Affiche les résultats intermédiaires
    recognition.lang = "fr-FR"; // Langue française

    // Gérer les résultats de la reconnaissance vocale
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPart + " ");
        } else {
          interimTranscript += transcriptPart;
        }
      }
      console.log("Interim Transcript:", interimTranscript);
    };

    // Gérer les erreurs
    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale:", event.error);
      setIsListening(false); // Arrêter l'écoute en cas d'erreur
    };

    // Démarrer ou arrêter la reconnaissance vocale en fonction de l'état
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // Nettoyer à la fin
    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Fonction pour démarrer l'écoute
  const startListening = () => {
    setTranscript(""); // Réinitialiser le transcript
    setIsListening(true);
  };

  // Fonction pour arrêter l'écoute
  const stopListening = () => {
    setIsListening(false);
  };

  return {
    transcript, // Texte transcrit
    isListening, // État de l'écoute
    startListening, // Fonction pour démarrer l'écoute
    stopListening, // Fonction pour arrêter l'écoute
  };
};

export default useSpeechRecognition;
