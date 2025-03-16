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
                        className="block text-white bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Generico
                    </button>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <h2 className="text-lg font-bold mb-2">Modal Title</h2>
                        <p>Modal content goes here.</p>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ChatMessage;