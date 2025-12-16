import Anthropic from '@anthropic-ai/sdk';

// Lazily initialize client to ensure env vars are loaded
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

export interface SendMessageParams {
  messages: ChatMessageInput[];
  systemPrompt: string;
}

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export async function sendMessage({
  messages,
  systemPrompt,
}: SendMessageParams): Promise<string> {
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const response = await getClient().messages.create({
    model,
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (textContent && textContent.type === 'text') {
    return textContent.text;
  }

  return '';
}
