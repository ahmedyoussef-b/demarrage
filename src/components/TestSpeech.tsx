// components/TestSpeech.tsx
'use client'; // Indique que ce composant est côté client

import { useEffect } from 'react';

export default function TestSpeech() {
    useEffect(() => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("Ceci est un test de synthèse vocale.");
            utterance.lang = 'fr-FR'; // Définir la langue
            utterance.volume = 1; // Volume maximal
            utterance.rate = 1; // Vitesse normale
            utterance.pitch = 1; // Hauteur normale

            window.speechSynthesis.speak(utterance);

            utterance.onend = () => {
                console.log("Lecture terminée.");
            };
        } else {
            console.error("L'API SpeechSynthesis n'est pas prise en charge sur cet appareil.");
        }
    }, []);

    return <div>Test de synthèse vocale en cours...</div>;
}