import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faRemove);

interface ModalProps {
    isOpen: boolean; // Flag per indicare se il modal è aperto o chiuso
    onClose: () => void; // Funzione da chiamare quando il modal deve essere chiuso
    children: React.ReactNode; // Contenuto del modal (qualsiasi nodo React)
}

// Componente funzionale Modal che accetta le props ModalProps
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    //Non viene renderizzato nulla se il modal non è aperto
    if (!isOpen) return null;
    return (
        // Aggiunto overlay di sfondo
        <div className="max-h-[100vh] overflow-y-auto fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg relative max-h-[80%] overflow-y-auto m-auto">
                {children}
                <button
                    className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faRemove} />
                </button>
            </div>
        </div>
    );
};

export default Modal;