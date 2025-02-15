// hooks/useSpeechRecognition.ts
import { useEffect, useState } from "react";

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR"; // Langue française

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

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale:", event.error);
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const startListening = () => {
    setTranscript("");
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;
