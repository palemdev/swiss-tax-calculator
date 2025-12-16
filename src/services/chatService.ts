import type { ChatMessage, TaxContextSnapshot, ChatApiResponse } from '../types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function sendChatMessage(
  messages: ChatMessage[],
  taxContext: TaxContextSnapshot
): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      taxContext,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: string }).error || `Chat request failed: ${response.status}`
    );
  }

  const data = (await response.json()) as ChatApiResponse;
  return data.content;
}
