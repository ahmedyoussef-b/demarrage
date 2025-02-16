'use client';

interface EtapeComponentProps {
    etape: {
        id: number;
        titre: string;
        description: string;
        sousEtapes: string[];
    };
}

const EtapeComponent = ({ etape }: EtapeComponentProps) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Étape {etape.id}: {etape.titre}</h2>
            <p className="mb-4">{etape.description}</p>
            <ul className="list-disc pl-6">
                {etape.sousEtapes.map((sousEtape, index) => (
                    <li key={index} className="mb-2">
                        {sousEtape}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EtapeComponent;