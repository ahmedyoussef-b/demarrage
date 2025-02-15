// components/TestSpeech.tsx
'use client';

import { useState } from 'react';

export default function TestSpeech() {
    const [message, setMessage] = useState('Cliquez pour tester la synthèse vocale.');

    const testerSynthèseVocale = () => {
        try {
            if ('speechSynthesis' in window) {
                // Annuler toute lecture en cours
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance("Ceci est un test de synthèse vocale.");
                utterance.lang = 'fr-FR'; // Définir la langue
                utterance.volume = 1; // Volume maximal
                utterance.rate = 1; // Vitesse normale
                utterance.pitch = 1; // Hauteur normale

                utterance.onstart = () => {
                    setMessage("Lecture en cours...");
                    console.log("Lecture démarrée");
                };

                utterance.onend = () => {
                    setMessage("Lecture terminée.");
                    console.log("Lecture terminée");
                };

                utterance.onerror = (event) => {
                    console.error("Erreur lors de la lecture :", event);
                    setMessage("Erreur lors de la lecture.");
                };

                // Ajouter un léger délai pour éviter les conflits
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                }, 100); // Délai de 100 ms
            } else {
                setMessage("L'API SpeechSynthesis n'est pas prise en charge sur cet appareil.");
                console.error("L'API SpeechSynthesis n'est pas prise en charge sur cet appareil.");
            }
        } catch (error) {
            console.error("Erreur lors de la lecture audio :", error);
            setMessage("Erreur lors de la lecture audio.");
        }
    };

    return (
        <div>
            <button
                onClick={testerSynthèseVocale}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Tester la synthèse vocale
            </button>
            <p className="mt-2">{message}</p>
        </div>
    );
}