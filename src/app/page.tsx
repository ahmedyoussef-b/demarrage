'use client';
import { useState, useCallback } from 'react';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import etapes from '../data/etapes';
import EtapeComponent from '../components/EtapeComponent';
import Modal from '../components/Modal';
import ChatComponent from '../components/ChatComponent';

export default function Home() {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { speak } = useSpeechSynthesis();

  // Formater les étapes et sous-étapes en texte pour ChatGPT
  const formatContextForChatGPT = useCallback(() => {
    let context = "Voici les étapes et sous-étapes de l'application :\n";
    etapes.forEach((etape) => {
      context += `Étape ${etape.id}: ${etape.titre}\n`;
      context += `Description: ${etape.description}\n`;
      context += "Sous-étapes :\n";
      etape.sousEtapes.forEach((sousEtape, index) => {
        context += `  ${index + 1}. ${sousEtape}\n`;
      });
      context += "\n";
    });
    return context;
  }, []);

  // Passer à l'étape suivante
  const nextEtape = () => {
    if (etapeActuelle < etapes.length) {
      setEtapeActuelle((prev) => prev + 1);
    }
  };

  // Revenir à l'étape précédente
  const previousEtape = () => {
    if (etapeActuelle > 1) {
      setEtapeActuelle((prev) => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Copilote de démarrage de centrale</h1>

        {/* Afficher l'étape actuelle */}
        <EtapeComponent etape={etapes[etapeActuelle - 1]} />

        {/* Boutons de navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={previousEtape}
            disabled={etapeActuelle === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Étape précédente
          </button>
          <button
            onClick={nextEtape}
            disabled={etapeActuelle === etapes.length}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Étape suivante
          </button>
        </div>

        {/* Bouton pour ouvrir la modale ChatGPT */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded mt-4"
        >
          Ouvrir l&apos;assistant ChatGPT
        </button>

        {/* Modale pour ChatGPT */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ChatComponent
            onResponse={(response) => {
              speak(response); // Lire la réponse de ChatGPT à voix haute
            }}
            context={formatContextForChatGPT()} // Passer le contexte des étapes
          />
        </Modal>
      </div>
    </div>
  );
}


{/*}
import { useState, useEffect, useCallback } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import etapes from '../data/etapes';
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

  // Lire une sous-étape
  const lireSousEtape = useCallback(
    (index: number) => {
      if (lectureEnCours) return;

      const sousEtape = etapes[etapeActuelle - 1].sousEtapes[index];
      const texteAVoix = `Sous-étape ${index + 1}: ${sousEtape}`;
      console.log("Texte à lire :", texteAVoix);

      speak(texteAVoix, () => {
        setLectureEnCours(false);
        setSousEtapeActuelle(null);
      }).catch((err) => {
        console.error('Erreur lors de la lecture vocale :', err);
        setLectureEnCours(false);
      });

      setLectureEnCours(true);
      setSousEtapeActuelle(index);
    },
    [etapeActuelle, speak, lectureEnCours]
  );

  // Lire l'étape actuelle (titre et description)
  const lireEtapeActuelle = useCallback(() => {
    if (lectureEnCours) return;

    const etape = etapes[etapeActuelle - 1];
    const texteAVoix = `Étape ${etape.id}: ${etape.titre}. ${etape.description}`;
    console.log("Texte à lire :", texteAVoix);

    speak(texteAVoix, () => {
      setLectureEnCours(false);
      setSousEtapeActuelle(null);
    }).catch((err) => {
      console.error('Erreur lors de la lecture vocale :', err);
      setLectureEnCours(false);
    });

    setLectureEnCours(true);
  }, [etapeActuelle, speak, lectureEnCours]);

  // Gérer les commandes vocales
  const handleVoiceCommand = useCallback(() => {
    if (transcript.toLowerCase().includes('suivant') && !lectureEnCours) {
      if (sousEtapeActuelle === null) {
        lireSousEtape(0);
      } else if (sousEtapeActuelle < etapes[etapeActuelle - 1].sousEtapes.length - 1) {
        lireSousEtape(sousEtapeActuelle + 1);
      } else {
        setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev));
      }
      stopListening();
    } else if (transcript.toLowerCase().includes('précédent') && !lectureEnCours) {
      if (sousEtapeActuelle !== null && sousEtapeActuelle > 0) {
        lireSousEtape(sousEtapeActuelle - 1);
      } else {
        setEtapeActuelle((prev) => (prev > 1 ? prev - 1 : prev));
      }
      stopListening();
    }
  }, [transcript, lectureEnCours, stopListening, sousEtapeActuelle, etapeActuelle, lireSousEtape]);

  // Activer une sous-étape
  const activerSousEtape = (index: number) => {
    if (!sousEtapesActivees.includes(index)) {
      setSousEtapesActivees((prev) => [...prev, index]);
    }
    lireSousEtape(index);
  };

  // Démarrer l'application
  const demarrerApplication = () => {
    setApplicationDemarree(true);
    if (microphoneDisponible) {
      startListening();
    }
    lireEtapeActuelle();
  };

  // Passer à l'étape suivante
  const passerAEtapeSuivante = () => {
    if (!lectureEnCours) {
      setEtapeActuelle((prev) => (prev < etapes.length ? prev + 1 : prev));
    }
  };

  // Appeler handleVoiceCommand lorsque le transcript change
  useEffect(() => {
    if (microphoneDisponible) {
      handleVoiceCommand();
    }
  }, [transcript, handleVoiceCommand, microphoneDisponible]);

  // Lire l'étape actuelle lors du démarrage ou du changement d'étape
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
              aria-label="Démarrer la reconnaissance vocale"
            >
              Démarrer la reconnaissance vocale
            </button>
            {!microphoneDisponible && (
              <p className="mt-4 text-red-500">
                Le microphone n&apos;est pas disponible. L&apos;interaction vocale est désactivée.
              </p>
            )}
            <button
              onClick={() => speak("Ceci est un test de synthèse vocale.")}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
              aria-label="Tester la synthèse vocale"
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
  */}