/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { ChatMessage, ChatState, TaxContextSnapshot } from '../types/chat';
import { sendChatMessage } from '../services/chatService';
import { useTax } from './TaxContext';

// Generate unique ID for messages
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Action types
type ChatAction =
  | { type: 'TOGGLE_PANEL' }
  | { type: 'OPEN_PANEL' }
  | { type: 'CLOSE_PANEL' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'CLEAR_ERROR' };

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'TOGGLE_PANEL':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_PANEL':
      return { ...state, isOpen: true };
    case 'CLOSE_PANEL':
      return { ...state, isOpen: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const taxState = useTax();

  // Build tax context snapshot from current tax state
  const buildTaxContext = useCallback((): TaxContextSnapshot => {
    return {
      taxpayer: {
        civilStatus: taxState.taxpayer.civilStatus,
        canton: taxState.taxpayer.canton,
        municipality: taxState.taxpayer.municipality,
        religion: taxState.taxpayer.religion,
        numberOfChildren: taxState.taxpayer.numberOfChildren,
      },
      income: {
        grossIncome: taxState.income.grossIncome,
        wealth: taxState.income.wealth,
      },
      deductions: {
        enabled: taxState.enableDeductions,
        pillar3aContributions: taxState.deductions.pillar3aContributions,
        healthInsurancePremiums: taxState.deductions.healthInsurancePremiums,
      },
      results: taxState.results
        ? {
            totalTax: taxState.results.totalTax,
            effectiveRate: taxState.results.effectiveRate,
            netIncome: taxState.results.netIncome,
            federalTax: taxState.results.federalTax.taxAmount,
            cantonalTax: taxState.results.cantonalTax.taxAmount,
            municipalTax: taxState.results.municipalTax.taxAmount,
            churchTax: taxState.results.churchTax.taxAmount,
            wealthTax: taxState.results.wealthTax.totalTax,
          }
        : null,
    };
  }, [taxState]);

  const togglePanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_PANEL' });
  }, []);

  const openPanel = useCallback(() => {
    dispatch({ type: 'OPEN_PANEL' });
  }, []);

  const closePanel = useCallback(() => {
    dispatch({ type: 'CLOSE_PANEL' });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Clear any previous error
      dispatch({ type: 'CLEAR_ERROR' });

      // Set loading state
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Build conversation history including the new message
        const allMessages = [...state.messages, userMessage];

        // Get tax context
        const taxContext = buildTaxContext();

        // Send to backend
        const response = await sendChatMessage(allMessages, taxContext);

        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to send message';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.messages, buildTaxContext]
  );

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: ChatContextValue = {
    ...state,
    togglePanel,
    openPanel,
    closePanel,
    sendMessage,
    clearMessages,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
