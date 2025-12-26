import { User, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-red-100 dark:bg-red-900/50 text-gray-900 dark:text-gray-100'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm prose-gray dark:prose-invert max-w-none
            prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0
            prose-headings:my-2 prose-headings:font-semibold
            prose-strong:font-semibold prose-code:text-red-600 dark:prose-code:text-red-400
            prose-code:bg-red-50 dark:prose-code:bg-red-900/30 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-800 prose-pre:text-gray-100">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-red-400 dark:text-red-300' : 'text-gray-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
