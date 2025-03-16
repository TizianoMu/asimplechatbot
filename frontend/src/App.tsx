// App.tsx
import React, { useState } from 'react';
import './App.css';
import ChatMessage from './ChatMessage';

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    setIsSending(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `Tu: ${inputText}`, isUser: true },
    ]);

    const response = `AI: ${inputText}`;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, isUser: false },
    ]);
    setIsSending(false);

    setInputText('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
        <textarea
          className="w-full h-14 p-2 border rounded mb-4"
          placeholder="Chiedi al Chatbot"
          value={inputText}
          onChange={handleInputChange}
        />
        <div className="flex justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={handleSend}
            disabled={isSending}
          >
            Invia
          </button>
        </div>
        <div className="mt-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;