import { useRef, useEffect } from 'react';
import { X, Trash2, Bot, AlertCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatbotPanel() {
  const {
    messages,
    isOpen,
    isLoading,
    error,
    closePanel,
    sendMessage,
    clearMessages,
    clearError,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closePanel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-4 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:max-h-[600px]
        bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 animate-slideUp"
      role="dialog"
      aria-label="Tax Expert Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <Bot size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Tax Expert</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ask about Swiss taxes</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={closePanel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <Bot size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-medium text-gray-600 dark:text-gray-300">Welcome to Tax Expert!</p>
            <p className="text-sm mt-1">
              Ask me anything about Swiss taxes, deductions, or your calculation.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <button
                onClick={() => sendMessage('Why is my tax so high?')}
                className="block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300"
              >
                💡 Why is my tax so high?
              </button>
              <button
                onClick={() => sendMessage('What deductions am I missing?')}
                className="block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300"
              >
                📋 What deductions am I missing?
              </button>
              <button
                onClick={() => sendMessage('How does Pillar 3a work?')}
                className="block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300"
              >
                🏦 How does Pillar 3a work?
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border-t border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
