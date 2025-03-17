import React, { useState } from 'react';
import Modal from './Modal';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
}

interface Document {
    title: string;
    content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);

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

    const handleOpenModal = async () => {
        await fetchDocuments();
        setIsModalOpen(true);
    };

    return (
        <div
            className={`mt-4 p-2 border rounded flex justify-between items-center ${isUser ? 'bg-blue-100' : 'bg-gray-100'}`}
        >
            <div>{message}</div>
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
                                            <td className="border p-2">{doc.content}</td>
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