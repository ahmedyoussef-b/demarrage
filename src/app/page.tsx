// src/app/page.tsx
'use client'; // Indique que ce composant est côté client

import { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

export default function Home() {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

  const etapes = [
    { id: 1, titre: "Préparation de la chaudière", description: "Suivez les étapes pour préparer la chaudière." },
    { id: 2, titre: "Remplissage de la chaudière", description: "Remplissez la chaudière selon les instructions." },
    { id: 3, titre: "Conditions d'armement", description: "Vérifiez les conditions d'armement de la chaudière." },
    { id: 4, titre: "Sécurité chaudière (FSE)", description: "Assurez-vous que toutes les conditions de sécurité sont remplies." },
    { id: 5, titre: "Conditions de contournement", description: "Vérifiez les conditions de contournement." },
  ];

  // Gérer les commandes vocales
  const handleVoiceCommand = () => {
    if (transcript.includes('suivant')) {
      setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev));
    } else if (transcript.includes('précédent')) {
      setEtapeActuelle((prev) => (prev > 1 ? prev - 1 : prev));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Copilote de démarrage de centrale</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{etapes[etapeActuelle - 1].titre}</h2>
          <p className="mt-2 text-gray-700">{etapes[etapeActuelle - 1].description}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setEtapeActuelle((prev) => (prev > 1 ? prev - 1 : prev))}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Précédent
          </button>
          <button
            onClick={() => setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Suivant
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 ${isListening ? 'bg-red-500' : 'bg-green-500'
              } text-white rounded hover:opacity-80`}
          >
            {isListening ? 'Arrêter la reconnaissance vocale' : 'Démarrer la reconnaissance vocale'}
          </button>
          <p className="mt-2 text-gray-600">Transcript: {transcript}</p>
        </div>
      </div>
    </div>
  );
}