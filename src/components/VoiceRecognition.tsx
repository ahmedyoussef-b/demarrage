import React from 'react';

interface VoiceRecognitionProps {
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    transcript: string;
    error: string | null;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
    isListening,
    startListening,
    stopListening,
    transcript,
    error,
}) => {
    return (
        <div className="mt-6">
            <button
                onClick={isListening ? stopListening : startListening}
                className={`px-4 py-2 ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white rounded hover:opacity-80`}
            >
                {isListening ? 'Arrêter la reconnaissance vocale' : 'Démarrer la reconnaissance vocale'}
            </button>
            <p className="mt-2 text-gray-600">Transcript: {transcript}</p>
            {error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    Erreur : {error === 'not-allowed' ? "Accès au microphone refusé. Veuillez autoriser l'accès au microphone." : error}
                </div>
            )}
        </div>
    );
};

export default VoiceRecognition;