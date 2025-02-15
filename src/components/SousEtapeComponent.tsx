import React from 'react';

interface SousEtapeComponentProps {
    index: number;
    sousEtape: string;
    isActive: boolean;
    onClick: () => void;
}

const SousEtapeComponent: React.FC<SousEtapeComponentProps> = ({ sousEtape, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-2 rounded ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
            {sousEtape}
        </button>
    );
};

export default SousEtapeComponent;