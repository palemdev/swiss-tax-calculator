import { Router, Request, Response } from 'express';
import { sendMessage, ChatMessageInput } from '../services/anthropic.js';

const router = Router();

// Tax context snapshot type matching frontend
interface TaxContextSnapshot {
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

interface ChatRequest {
  messages: ChatMessageInput[];
  taxContext: TaxContextSnapshot;
}

function buildSystemPrompt(taxContext: TaxContextSnapshot): string {
  const contextSection = taxContext.results
    ? `
## Current Calculator State
- **Location:** ${taxContext.taxpayer.canton} canton, ${taxContext.taxpayer.municipality} municipality
- **Civil Status:** ${taxContext.taxpayer.civilStatus}
- **Religion:** ${taxContext.taxpayer.religion}
- **Children:** ${taxContext.taxpayer.numberOfChildren}
- **Gross Income:** CHF ${taxContext.income.grossIncome.toLocaleString('de-CH')}
- **Wealth:** CHF ${taxContext.income.wealth.toLocaleString('de-CH')}
- **Deductions Enabled:** ${taxContext.deductions.enabled ? 'Yes' : 'No'}
${taxContext.deductions.enabled ? `- **Pillar 3a Contributions:** CHF ${taxContext.deductions.pillar3aContributions.toLocaleString('de-CH')}
- **Health Insurance Premiums:** CHF ${taxContext.deductions.healthInsurancePremiums.toLocaleString('de-CH')}` : ''}

## Calculated Results
- **Total Tax:** CHF ${taxContext.results.totalTax.toLocaleString('de-CH')}
- **Effective Tax Rate:** ${taxContext.results.effectiveRate.toFixed(2)}%
- **Net Income:** CHF ${taxContext.results.netIncome.toLocaleString('de-CH')}
- Federal Tax: CHF ${taxContext.results.federalTax.toLocaleString('de-CH')}
- Cantonal Tax: CHF ${taxContext.results.cantonalTax.toLocaleString('de-CH')}
- Municipal Tax: CHF ${taxContext.results.municipalTax.toLocaleString('de-CH')}
- Church Tax: CHF ${taxContext.results.churchTax.toLocaleString('de-CH')}
- Wealth Tax: CHF ${taxContext.results.wealthTax.toLocaleString('de-CH')}
`
    : `
## Current Calculator State
The user has not completed their tax calculation yet. They have entered:
- **Location:** ${taxContext.taxpayer.canton} canton
- **Civil Status:** ${taxContext.taxpayer.civilStatus}
- **Children:** ${taxContext.taxpayer.numberOfChildren}
- **Gross Income:** CHF ${taxContext.income.grossIncome.toLocaleString('de-CH')}
`;

  return `You are a knowledgeable Swiss tax expert assistant embedded in a Swiss Tax Calculator application. Your role is to help users understand their tax situation and the Swiss tax system.

## Your Expertise
- Swiss federal, cantonal, and municipal tax systems
- Tax deductions (professional expenses, insurance premiums, pillar 3a, childcare, etc.)
- Civil status impact on taxes (single vs married tariffs, marriage penalty/bonus)
- Church tax and religious affiliations
- Wealth tax calculations
- Social security contributions (AHV/IV/EO, ALV)
- Canton-specific rules for Zürich (ZH), Zug (ZG), and Schwyz (SZ)

${contextSection}

## Key Tax Knowledge

### Swiss Tax Structure
- **Federal Tax:** Progressive brackets, different for single/married (Grundtarif vs Verheiratetentarif)
- **Cantonal Tax:** Base tax × cantonal multiplier (e.g., ZG: 82%, ZH: 98%)
- **Municipal Tax:** Base tax × municipal multiplier (varies by municipality)
- **Church Tax:** Base tax × church multiplier (for Catholic, Protestant, Christ-Catholic)
- **Wealth Tax:** Progressive brackets with allowances by canton

### Deduction Limits (2025)
- **Pillar 3a:** CHF 7,056 (with employer pension) / CHF 35,280 (without)
- **Federal commuting max:** CHF 3,000
- **Federal insurance premiums:** CHF 2,700 (single) / CHF 5,400 (married) + CHF 1,350/child
- **Federal child deduction:** CHF 6,600/child
- **Federal childcare deduction:** max CHF 25,000/child

### Social Security Rates (Employee Portion)
- AHV/IV/EO: 5.3%
- ALV: 1.1% (up to CHF 148,200 cap)
- ALV solidarity: 0.5% (above cap)

### Canton Highlights
- **Zug (ZG):** Lowest taxes (82% multiplier), rent deduction (30% up to CHF 15,000), self-care deduction
- **Zürich (ZH):** Mid-range (98% multiplier), dual-earner deduction, education costs
- **Schwyz (SZ):** Between ZG and ZH, dual-earner deduction

## Guidelines
1. Always reference the user's actual numbers when relevant
2. Explain Swiss tax concepts in clear, accessible language
3. Be specific about which canton's rules apply when relevant
4. Mention when something varies by canton
5. If asked about cantons not in the calculator (only ZH, ZG, SZ supported), note this limitation
6. Provide actionable optimization suggestions when appropriate
7. Use CHF for all currency amounts
8. Be concise but thorough
9. If the user hasn't calculated their taxes yet, encourage them to fill in their details

Remember: You're helping real users understand their tax situation. Be helpful, accurate, and practical.`;
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages, taxContext } = req.body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    if (!taxContext) {
      res.status(400).json({ error: 'Tax context is required' });
      return;
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({ error: 'API key not configured on server' });
      return;
    }

    const systemPrompt = buildSystemPrompt(taxContext);

    const response = await sendMessage({
      messages,
      systemPrompt,
    });

    res.json({ content: response });
  } catch (error) {
    console.error('Chat error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to process chat request';
    res.status(500).json({ error: message });
  }
});

export { router as chatRouter };
