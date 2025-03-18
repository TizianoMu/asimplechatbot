import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
    setIsSending: React.Dispatch<React.SetStateAction<boolean>>; //Per riabilitare l'input una volta finito di scrivere
}

interface Document {
    title: string;
    content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, setIsSending }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Stato per gestire l'apertura/chiusura del modal dei documenti
    const [documents, setDocuments] = useState<Document[]>([]); // Stato per memorizzare i documenti recuperati dall'API
    const [typedMessage, setTypedMessage] = useState(''); // Stato per memorizzare il messaggio digitato progressivamente
    const [currentIndex, setCurrentIndex] = useState(0); // tiene traccia dell'indice del carattere corrente nel messaggio (usato con typedMessage)

    // Effetto per simulare la digitazione del messaggio
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        // Se il messaggio non è dell'utente e ci sono ancora caratteri da digitare
        if (!isUser && currentIndex < message.length) {
            timeoutId = setTimeout(() => {
                // Aggiunge il carattere corrente al messaggio digitato
                setTypedMessage(prev => prev + message[currentIndex]);
                // Incrementa l'indice del carattere corrente
                setCurrentIndex(prev => prev + 1);
            }, 50);
        }
        
        return () => clearTimeout(timeoutId);
    }, [currentIndex, message, isUser]);

    // Effetto per resettare lo stato della digitazione quando il messaggio cambia
    useEffect(() => {
        if (!isUser && message.length > 0) {
            // Resetta l'indice del carattere corrente
            setCurrentIndex(0);
            setTypedMessage('');
            setIsSending(false);
        } else if (isUser) {
            // Se il messaggio è dell'utente, mostra il messaggio completo immediatamente
            setTypedMessage(message);
        }
    }, [message, isUser]);

    // Funzione per recuperare i documenti
    const fetchDocuments = async () => {
        try {
            const response = await fetch('/documents');
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            const data = await response.json();
            setDocuments(data.response);
        } catch (error) {
            console.error('Errore durante la chiamata API:', error);
        }
    };

    // Funzione per aprire il modal dei documenti
    const handleOpenModal = async () => {
        await fetchDocuments();
        setIsModalOpen(true);
    };

    return (
        <div
            className={`w-[60%] mb-4 p-2 border rounded flex justify-between items-center ${isUser ? 'bg-blue-100 float-right' : 'bg-gray-100 float-left'}`}
        >
            <div>{typedMessage}</div>
            {!isUser && (
                <>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleOpenModal}
                    >
                        Documenti
                    </button>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <h2 className="text-lg font-bold mb-2">Documenti</h2>
                        {documents.length > 0 && (
                            <table className="mt-4 w-full">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Nome</th>
                                        <th className="border p-2">Contenuto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">{doc.title}</td>
                                            <td className="border p-2"><ReactMarkdown>{doc.content}</ReactMarkdown></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ChatMessage;