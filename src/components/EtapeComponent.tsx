import React from 'react';
import SousEtapeComponent from './SousEtapeComponent';

interface EtapeComponentProps {
    etape: {
        id: number;
        titre: string;
        description: string;
        sousEtapes: string[];
    };
    sousEtapesActivees: number[];
    activerSousEtape: (index: number) => void;
    onEtapeClick: () => void; // Nouvelle prop pour gérer le clic sur l'étape
}

const EtapeComponent: React.FC<EtapeComponentProps> = ({
    etape,
    sousEtapesActivees,
    activerSousEtape,
    onEtapeClick,
}) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold cursor-pointer" onClick={onEtapeClick}>
                {etape.titre}
            </h2>
            <p className="mt-2 text-gray-700">{etape.description}</p>
            <div className="mt-4">
                <h3 className="text-lg font-medium">Sous-étapes :</h3>
                <div className="space-y-2">
                    {etape.sousEtapes.map((sousEtape, index) => (
                        <SousEtapeComponent
                            key={index}
                            index={index}
                            sousEtape={sousEtape}
                            isActive={sousEtapesActivees.includes(index)}
                            onClick={() => activerSousEtape(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EtapeComponent;