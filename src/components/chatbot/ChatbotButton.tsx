import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ChatbotPanel } from './ChatbotPanel';

export function ChatbotButton() {
  const { isOpen, togglePanel } = useChat();

  return (
    <>
      {/* Chat panel */}
      <ChatbotPanel />

      {/* Floating button */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center transition-all duration-200 z-50
          ${
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-red-600 hover:bg-red-700 hover:scale-105'
          }`}
        aria-label={isOpen ? 'Close chat' : 'Open Tax Expert chat'}
        title={isOpen ? 'Close chat' : 'Ask Tax Expert'}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
    </>
  );
}
