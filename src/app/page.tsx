// src/app/page.tsx
'use client'; // Indique que ce composant est côté client

import { useState, useEffect, useCallback, useMemo } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

export default function Home() {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const { transcript, isListening, startListening, stopListening, error } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  // Définir le tableau des étapes
  const etapes = useMemo(
    () => [
      {
        id: 1,
        titre: "Préparation de la chaudière",
        description: "Suivez les étapes pour préparer la chaudière.",
        sousEtapes: [
          "Mettre la turbine à gaz (TG) en service (70 à 80 MW de préférence).",
          "Remplir la chaudière en utilisant le circuit SER et ouvrir les évents HV701 et HV702.",
          "Mettre en service les pompes API et APB.",
          "Remplir les ballons HP et BP jusqu'aux niveaux de démarrage spécifiés : HP = -475 mm + 150 mm, BP = -580 mm + 100 mm.",
          "Ouvrir les vannes motorisées d'évent FSR UV008 et FLB UV008.",
          "Ouvrir les vannes de purge de pot de condensat FSR UV010 et FLB UV010.",
        ],
      },
      {
        id: 2,
        titre: "Conditions d'armement de la chaudière",
        description: "Vérifiez les conditions d'armement de la chaudière.",
        sousEtapes: [
          "La chaudière est considérée comme armée lorsque le registre est ouvert.",
          "La turbine à vapeur (TV) est armée lorsque les vannes d'arrêt sont ouvertes.",
        ],
      },
      {
        id: 3,
        titre: "Sécurité chaudière (FSE)",
        description: "Assurez-vous que toutes les conditions de sécurité sont remplies.",
        sousEtapes: [
          "La turbine à gaz associée doit être synchronisée.",
          "Au moins une pompe API et une pompe APB doivent être en service.",
          "Une pompe CEX doit être en service.",
          "Une pompe FSR doit être en service avec une pression correcte.",
          "Une pompe FLB doit être en service avec une pression correcte.",
          "Le niveau de gonflement des ballons HP et BP doit être détecté : HP = -475 mm, BP = -580 mm.",
          "Absence d'eau dans le pot de condensat de vapeur de surchauffe HP et BP.",
        ],
      },
      {
        id: 4,
        titre: "Conditions de disponibilité de contournement",
        description: "Vérifiez les conditions de disponibilité de contournement.",
        sousEtapes: [
          "La chaudière doit être armée.",
          "Le registre de la chaudière ne doit pas être fermé.",
          "Aucun défaut sur l'unité hydraulique.",
          "L'armoire de contournement doit être en service (ON).",
          "La pression de l'eau de désurchauffe doit être correcte (P < 16 bars).",
          "Au moins un demi-condenseur doit être réfrigéré (vannes d'entrée et de sortie ouvertes).",
          "Le vide du condenseur doit être correct (pression inférieure à 300 mbar).",
          "La température de la vapeur surchauffée doit être élevée (> 300°C).",
        ],
      },
      {
        id: 5,
        titre: "Démarrage du groupe CET",
        description: "Suivez les étapes pour démarrer le groupe CET.",
        sousEtapes: [
          "Lorsque la pression SVA est à 7 bars et la température à 250°C, le groupe CET s'ouvre.",
          "Le groupe CET déclenche (ouverture de la vanne SVA) à P = 11 bars et T = 325°C.",
          "Les paramètres de démarrage du groupe CET sont : 180°C et 1.2 bars.",
          "Mettre en service le groupe CV1 :",
          "   - À 1 bar, l'éjecteur de démarrage se met en marche.",
          "   - À 250 mbar, l'éjecteur d'entretien se met en service.",
          "   - À 150 mbar, l'éjecteur de démarrage s'arrête.",
        ],
      },
      {
        id: 6,
        titre: "Couplage des chaudières",
        description: "Suivez les étapes pour coupler les chaudières.",
        sousEtapes: [
          "Conditions d'ouverture de la vanne d'isolement HP UV001/UV002 :",
          "   - T ≥ 450°C au niveau du capteur BXVVPTSHQ01 ou BLVVPTSHQ01.",
          "   - ΔP ≤ 2 bars.",
          "Conditions d'ouverture de la vanne d'isolement BP UV001/UV002 :",
          "   - T ≥ 175°C au niveau du capteur BXVVPTSHQ02 ou BLVVPTSHQ02.",
          "   - ΔP ≤ 0.5 bars.",
          "Confirmer la fin de disposition de la chaudière avec le chimiste.",
        ],
      },
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Erreur : {error === 'not-allowed' ? "Accès au microphone refusé. Veuillez autoriser l'accès au microphone." : error}
          </div>
        )}
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