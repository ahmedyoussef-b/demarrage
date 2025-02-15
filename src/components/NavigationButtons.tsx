import React from 'react';

interface NavigationButtonsProps {
    etapeActuelle: number;
    etapesLength: number;
    onPrecedent: () => void;
    onSuivant: () => void;
    lectureEnCours: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    etapeActuelle,
    etapesLength,
    onPrecedent,
    onSuivant,
    lectureEnCours,
}) => {
    return (
        <div className="flex justify-between">
            <button
                onClick={onPrecedent}
                disabled={lectureEnCours || etapeActuelle === 1}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
                Précédent
            </button>
            <button
                onClick={onSuivant}
                disabled={lectureEnCours || etapeActuelle === etapesLength}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Suivant
            </button>
        </div>
    );
};

export default NavigationButtons;