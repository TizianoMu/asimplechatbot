import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatMessage from './ChatMessage';
import SeaBackground from './SeaBackground';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faAnchor } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faShip, faAnchor);

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Crea un ref per il contenitore dei messaggi

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    setIsSending(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `${inputText}`, isUser: true },
    ]);

    try {
      setInputText('');
      setIsLoading(true);
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

      const data = await response.json();
      setIsLoading(false);
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
      setInputText('');
      setIsLoading(false);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Funzione per far scorrere il contenitore all'ultimo messaggio
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Usa useEffect per chiamare scrollToBottom ogni volta che i messaggi vengono aggiornati
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="app-container">
      <SeaBackground />
      <div className="relative z-10 w-100 flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md w-[60vw]">
          <h1 className="text-center text-2xl font-bold mb-4">ChatBoat <FontAwesomeIcon icon={faShip} /></h1>
          <div ref={messagesContainerRef} className="mb-4 max-h-[400px] overflow-auto">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
                setIsSending={setIsSending}
              />
            ))}
          </div>
          <div className="flex w-full mb-4 position-fixed">
            <textarea
              className="flex-grow h-14 p-2 border rounded mr-2"
              placeholder="Chiedi a ChatBoat"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSend}
              disabled={isSending}
            >
              Invia {isSending && <FontAwesomeIcon icon={faAnchor} fade />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;