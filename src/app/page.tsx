// src/app/page.tsx
'use client'; // Indique que ce composant est côté client

import { useState, useEffect, useCallback, useMemo } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

export default function Home() {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  // Mémoriser le tableau etapes pour éviter qu'il soit recréé à chaque rendu
  const etapes = useMemo(
    () => [
      {
        id: 1,
        titre: "Préparation de la chaudière",
        description: "Suivez les étapes pour préparer la chaudière.",
        sousEtapes: [
          "Vérifier l'état de la chaudière.",
          "Ouvrir les vannes d'alimentation en eau.",
          "Vérifier les niveaux de pression.",
        ],
      },
      {
        id: 2,
        titre: "Remplissage de la chaudière",
        description: "Remplissez la chaudière selon les instructions.",
        sousEtapes: [
          "Ouvrir la vanne de remplissage.",
          "Surveiller le niveau d'eau jusqu'à atteindre le niveau requis.",
          "Fermer la vanne de remplissage.",
        ],
      },
      {
        id: 3,
        titre: "Conditions d'armement",
        description: "Vérifiez les conditions d'armement de la chaudière.",
        sousEtapes: [
          "Vérifier les capteurs de sécurité.",
          "Activer les systèmes de contrôle.",
          "Confirmer l'état des vannes.",
        ],
      },
      // Ajoutez d'autres étapes ici...
    ],
    [] // Aucune dépendance, le tableau est constant
  );

  // Gérer les commandes vocales
  const handleVoiceCommand = useCallback(() => {
    if (transcript.includes('suivant')) {
      setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev));
    } else if (transcript.includes('précédent')) {
      setEtapeActuelle((prev) => (prev > 1 ? prev - 1 : prev));
    }
  }, [transcript, etapes.length]);

  // Lire à haute voix l'étape actuelle et ses sous-étapes
  useEffect(() => {
    if (etapeActuelle) {
      const etape = etapes[etapeActuelle - 1];
      const texteAVoix = `Étape ${etape.id}: ${etape.titre}. ${etape.description}. Sous-étapes: ${etape.sousEtapes.join('. ')}`;
      speak(texteAVoix);
    }
  }, [etapeActuelle, etapes, speak]);

  // Appeler handleVoiceCommand chaque fois que le transcript change
  useEffect(() => {
    handleVoiceCommand();
  }, [transcript, handleVoiceCommand]);

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Copilote de démarrage de centrale</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{etapes[etapeActuelle - 1].titre}</h2>
          <p className="mt-2 text-gray-700">{etapes[etapeActuelle - 1].description}</p>
          <div className="mt-4">
            <h3 className="text-lg font-medium">Sous-étapes :</h3>
            <ul className="list-disc list-inside mt-2">
              {etapes[etapeActuelle - 1].sousEtapes.map((sousEtape, index) => (
                <li key={index} className="text-gray-600">
                  {sousEtape}
                </li>
              ))}
            </ul>
          </div>
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