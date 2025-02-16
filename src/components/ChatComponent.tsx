'use client';

import { useState } from 'react';
import axios from 'axios';
import { askChatGPT } from '../services/openaiService';

interface ChatComponentProps {
    onResponse: (response: string) => void; // Callback pour la réponse vocale
    context: string; // Contexte des étapes et sous-étapes
}

const ChatComponent = ({ onResponse, context }: ChatComponentProps) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            // Ajouter le message de l'utilisateur
            const userMessage = { role: 'user', content: input };
            setMessages((prev) => [...prev, userMessage]);

            // Envoyer la requête à ChatGPT avec le contexte
            const response = await askChatGPT(input, context);

            // Ajouter la réponse de ChatGPT
            const botMessage = { role: 'assistant', content: response };
            setMessages((prev) => [...prev, botMessage]);

            // Lire la réponse à voix haute
            onResponse(response);
        } catch (error) {
            console.error('Erreur lors de la communication avec ChatGPT :', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <div className="mb-4 h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 mb-2 rounded ${msg.role === 'user' ? 'bg-blue-100 ml-auto w-3/4' : 'bg-green-100 mr-auto w-3/4'
                            }`}
                    >
                        <strong>{msg.role === 'user' ? 'Vous' : 'ChatGPT'}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 p-2 border rounded-l"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-r"
                    disabled={isLoading}
                >
                    {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;