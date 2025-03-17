// Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="max-h-[100vh] overflow-y-auto fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-3/4 max-w-2xl relative max-h-[80%] overflow-y-auto m-auto">
                {children}
                <button
                    className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Chiudi
                </button>
            </div>
        </div>
    );
};

export default Modal;