// hooks/useSpeechRecognition.ts
import { useEffect, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState(""); // Texte transcrit
  const [isListening, setIsListening] = useState(false); // État de l'écoute
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  useEffect(() => {
    // Vérifier si l'API SpeechRecognition est disponible
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    // Initialiser la reconnaissance vocale
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Continue à écouter même après une pause
    recognition.interimResults = true; // Affiche les résultats intermédiaires
    recognition.lang = "fr-FR"; // Langue française

    // Gérer les résultats de la reconnaissance vocale
    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erreur de reconnaissance vocale:", event.error);
      setError(event.error); // Enregistrer l'erreur
      setIsListening(false); // Arrêter l'écoute en cas d'erreur
    };

    // Redémarrer la reconnaissance vocale si elle s'arrête
    recognition.onend = () => {
      if (isListening) {
        console.log("Redémarrage de la reconnaissance vocale...");
        recognition.start();
      }
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
    setError(null); // Réinitialiser les erreurs
    setIsListening(true);
  };

  // Fonction pour arrêter l'écoute
  const stopListening = () => {
    setIsListening(false);
  };

  return {
    transcript, // Texte transcrit
    isListening, // État de l'écoute
    error, // Erreur de reconnaissance vocale
    startListening, // Fonction pour démarrer l'écoute
    stopListening, // Fonction pour arrêter l'écoute
  };
};

export default useSpeechRecognition;
