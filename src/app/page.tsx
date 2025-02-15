// src/app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import etapes  from '../data/etapes';
import EtapeComponent from '../components/EtapeComponent';
import NavigationButtons from '../components/NavigationButtons';
import VoiceRecognition from '../components/VoiceRecognition';

export default function Home() {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [sousEtapeActuelle, setSousEtapeActuelle] = useState<number | null>(null);
  const [sousEtapesActivees, setSousEtapesActivees] = useState<number[]>([]);
  const [lectureEnCours, setLectureEnCours] = useState(false);
  const [applicationDemarree, setApplicationDemarree] = useState(false);
  const [microphoneDisponible, setMicrophoneDisponible] = useState(false);

  const { transcript, isListening, startListening, stopListening, error } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  // Vérifier la disponibilité du microphone
  useEffect(() => {
    const verifierMicrophone = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphoneExiste = devices.some((device) => device.kind === 'audioinput');
        setMicrophoneDisponible(microphoneExiste);
      } catch (err) {
        console.error('Erreur lors de la vérification du microphone:', err);
        setMicrophoneDisponible(false);
      }
    };

    verifierMicrophone();
  }, []);

  // Fonction pour lire une sous-étape
  const lireSousEtape = useCallback(
    (index: number) => {
      if (lectureEnCours) return; // Ne pas lancer une nouvelle lecture si une lecture est déjà en cours

      const sousEtape = etapes[etapeActuelle - 1].sousEtapes[index];
      const texteAVoix = `Sous-étape ${index + 1}: ${sousEtape}`;
      console.log("Texte à lire :", texteAVoix); // Log pour déboguer
      speak(texteAVoix, () => {
        setLectureEnCours(false); // Marquer la lecture comme terminée
        setSousEtapeActuelle(null); // Réinitialiser la sous-étape actuelle
      });
      setLectureEnCours(true); // Marquer la lecture comme en cours
      setSousEtapeActuelle(index); // Mettre à jour la sous-étape actuellement lue
    },
    [etapeActuelle, speak, lectureEnCours]
  );

  // Fonction pour lire l'étape actuelle (titre et description)
  const lireEtapeActuelle = useCallback(() => {
    if (lectureEnCours) return; // Ne pas lancer une nouvelle lecture si une lecture est déjà en cours

    const etape = etapes[etapeActuelle - 1];
    const texteAVoix = `Étape ${etape.id}: ${etape.titre}. ${etape.description}`;
    console.log("Texte à lire :", texteAVoix); // Log pour déboguer
    speak(texteAVoix, () => {
      setLectureEnCours(false); // Marquer la lecture comme terminée
      setSousEtapeActuelle(null); // Réinitialiser la sous-étape actuelle
    });
    setLectureEnCours(true); // Marquer la lecture comme en cours
  }, [etapeActuelle, speak, lectureEnCours]);

  // Gérer les commandes vocales
  const handleVoiceCommand = useCallback(() => {
    if (transcript.toLowerCase().includes('suivant') && !lectureEnCours) {
      if (sousEtapeActuelle === null) {
        lireSousEtape(0); // Commencer la première sous-étape
      } else if (sousEtapeActuelle < etapes[etapeActuelle - 1].sousEtapes.length - 1) {
        lireSousEtape(sousEtapeActuelle + 1); // Passer à la sous-étape suivante
      } else {
        setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev)); // Passer à l'étape suivante
      }
      stopListening(); // Arrêter l'écoute après avoir traité la commande
    } else if (transcript.toLowerCase().includes('précédent') && !lectureEnCours) {
      if (sousEtapeActuelle !== null && sousEtapeActuelle > 0) {
        lireSousEtape(sousEtapeActuelle - 1); // Revenir à la sous-étape précédente
      } else {
        setEtapeActuelle((prev) => (prev > 1 ? prev - 1 : prev)); // Revenir à l'étape précédente
      }
      stopListening(); // Arrêter l'écoute après avoir traité la commande
    }
  }, [transcript, lectureEnCours, stopListening, sousEtapeActuelle, etapeActuelle, lireSousEtape]);

  // Activer une sous-étape
  const activerSousEtape = (index: number) => {
    if (!sousEtapesActivees.includes(index)) {
      setSousEtapesActivees((prev) => [...prev, index]);
    }
    lireSousEtape(index); // Lire la sous-étape cliquée
  };

  // Démarrer l'application
  const demarrerApplication = () => {
    setApplicationDemarree(true);
    if (microphoneDisponible) {
      startListening();
    }
    lireEtapeActuelle(); // Lire l'étape actuelle
  };

  // Passer à l'étape suivante
  const passerAEtapeSuivante = () => {
    if (!lectureEnCours) {
      setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev));
    }
  };

  // Appeler handleVoiceCommand chaque fois que le transcript change
  useEffect(() => {
    if (microphoneDisponible) {
      handleVoiceCommand();
    }
  }, [transcript, handleVoiceCommand, microphoneDisponible]);

  // Lire l'étape actuelle uniquement lors du démarrage ou du changement d'étape
  useEffect(() => {
    if (applicationDemarree && !lectureEnCours) {
      lireEtapeActuelle();
    }
  }, [etapeActuelle, applicationDemarree]);

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Copilote de démarrage de centrale</h1>
        {!applicationDemarree ? (
          <>
            <button
              onClick={demarrerApplication}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Démarrer la reconnaissance vocale
            </button>
            {!microphoneDisponible && (
              <p className="mt-4 text-red-500">
                Le microphone n&apos;est pas disponible. L&apos;interaction vocale est désactivée.
              </p>
            )}
            <button
              onClick={() => {
                console.log("Bouton de test cliqué"); // Log pour déboguer
                speak("Ceci est un test de synthèse vocale.");
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
            >
              Tester la synthèse vocale
            </button>
          </>
        ) : (
          <>
            <EtapeComponent
              etape={etapes[etapeActuelle - 1]}
              sousEtapesActivees={sousEtapesActivees}
              activerSousEtape={activerSousEtape}
              onEtapeClick={passerAEtapeSuivante}
            />
            <NavigationButtons
              etapeActuelle={etapeActuelle}
              etapesLength={etapes.length}
              onPrecedent={() => {
                if (!lectureEnCours) {
                  setEtapeActuelle((prev) => (prev > 1 ? prev - 1 : prev));
                }
              }}
              onSuivant={passerAEtapeSuivante}
              lectureEnCours={lectureEnCours}
            />
            {microphoneDisponible && (
              <VoiceRecognition
                isListening={isListening}
                startListening={startListening}
                stopListening={stopListening}
                transcript={transcript}
                error={error}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}