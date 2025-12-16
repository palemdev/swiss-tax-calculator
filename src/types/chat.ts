export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TaxContextSnapshot {
  taxpayer: {
    civilStatus: string;
    canton: string;
    municipality: string;
    religion: string;
    numberOfChildren: number;
  };
  income: {
    grossIncome: number;
    wealth: number;
  };
  deductions: {
    enabled: boolean;
    pillar3aContributions: number;
    healthInsurancePremiums: number;
  };
  results: {
    totalTax: number;
    effectiveRate: number;
    netIncome: number;
    federalTax: number;
    cantonalTax: number;
    municipalTax: number;
    churchTax: number;
    wealthTax: number;
  } | null;
}

export interface ChatApiRequest {
  messages: Array<{ role: MessageRole; content: string }>;
  taxContext: TaxContextSnapshot;
}

export interface ChatApiResponse {
  content: string;
}
