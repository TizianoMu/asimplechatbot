import React, { useState } from 'react';
import './App.css';
import ChatMessage from './ChatMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faShip,faSpinner);

// Interfaccia per i messaggi della chat
interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [inputText, setInputText] = useState<string>(''); // Stato per l'input di testo dell'utente
  const [messages, setMessages] = useState<Message[]>([]); // array dei messaggi della chat
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // icona di caricamento
  // Gestisce il cambiamento dell'input di testo
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // Gestisce l'invio del messaggio
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    // Imposta lo stato di invio a true
    setIsSending(true);
    // Aggiunge il messaggio dell'utente all'array dei messaggi
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `${inputText}`, isUser: true },
    ]);

    try {
      // Pulisce l'input di testo
      setInputText('');
      setIsLoading(true);
      // Effettua la chiamata API per inviare il messaggio al backend
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      // Attende la risposta JSON del backend
      const data = await response.json();
      setIsLoading(false);
      // Aggiunge la risposta del chatbot all'array dei messaggi
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data.response}`, isUser: false },
      ]);
    } catch (error) {
      console.error('Errore durante la chiamata API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Errore durante la comunicazione con il server.', isUser: false },
      ]);
    } finally {
      // Imposta lo stato di invio a false e pulisce l'input di testo
      setInputText('');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-100 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-[60vw]">
        <h1 className="text-center text-2xl font-bold mb-4">ChatBoat <FontAwesomeIcon icon={faShip} /></h1>
        <div className="mb-4">
          {/* Mappa l'array dei messaggi e renderizza i componenti ChatMessage */}
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isUser={message.isUser}
              setIsSending={setIsSending}
            />
          ))}
        </div>
        <div className="flex w-full mb-4">
          <textarea
            className="flex-grow h-14 p-2 border rounded mr-2"
            placeholder="Chiedi al Chatbot"
            value={inputText}
            onChange={handleInputChange}
          />
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSend}
            disabled={isSending}
          >
            Invia {isSending && <FontAwesomeIcon icon={faSpinner} spin />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;