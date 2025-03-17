// ChatMessage.tsx
import React from 'react';
import Modal from './Modal';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <div
            className={`mt-4 p-2 border rounded flex justify-between items-center ${isUser ? 'bg-blue-100' : 'bg-gray-100'
                }`}
        >
            <div>{message}</div>
            {!isUser && (
                <>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded "
                        onClick={() => setIsModalOpen(true)} //GET /documents
                    >
                        Verifica le fonti
                    </button>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <h2 className="text-lg font-bold mb-2">Documenti</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Contenuto</th>
                                </tr>
                            </thead>
                        </table>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ChatMessage;