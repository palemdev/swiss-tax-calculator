import type { TaxBracket } from '../types';

// Federal Tax Brackets 2025 - Single Tariff (Grundtarif)
export const federalTaxBracketsSingle2025: TaxBracket[] = [
  { minIncome: 0, maxIncome: 18500, baseAmount: 0, rate: 0 },
  { minIncome: 18500, maxIncome: 33200, baseAmount: 25.41, rate: 0.77 },
  { minIncome: 33200, maxIncome: 43500, baseAmount: 138.60, rate: 0.88 },
  { minIncome: 43500, maxIncome: 58000, baseAmount: 229.20, rate: 2.64 },
  { minIncome: 58000, maxIncome: 76100, baseAmount: 612.00, rate: 2.97 },
  { minIncome: 76100, maxIncome: 82000, baseAmount: 1149.55, rate: 5.94 },
  { minIncome: 82000, maxIncome: 108800, baseAmount: 1500.00, rate: 6.60 },
  { minIncome: 108800, maxIncome: 141500, baseAmount: 3268.80, rate: 8.80 },
  { minIncome: 141500, maxIncome: 184900, baseAmount: 6146.40, rate: 11.00 },
  { minIncome: 184900, maxIncome: 793300, baseAmount: 10920.40, rate: 13.20 },
  { minIncome: 793300, maxIncome: null, baseAmount: 91229.20, rate: 11.50 },
];

// Federal Tax Brackets 2025 - Married Tariff (Verheiratetentarif)
export const federalTaxBracketsMarried2025: TaxBracket[] = [
  { minIncome: 0, maxIncome: 33000, baseAmount: 0, rate: 0 },
  { minIncome: 33000, maxIncome: 53300, baseAmount: 33.00, rate: 1.00 },
  { minIncome: 53400, maxIncome: 61300, baseAmount: 239.00, rate: 2.00 },
  { minIncome: 61300, maxIncome: 79100, baseAmount: 398.00, rate: 3.00 },
  { minIncome: 79100, maxIncome: 94900, baseAmount: 933.00, rate: 4.00 },
  { minIncome: 94900, maxIncome: 108600, baseAmount: 1566.00, rate: 5.00 },
  { minIncome: 108600, maxIncome: 120500, baseAmount: 2252.00, rate: 6.00 },
  { minIncome: 120500, maxIncome: 130500, baseAmount: 2967.00, rate: 7.00 },
  { minIncome: 130500, maxIncome: 138300, baseAmount: 3660.00, rate: 8.00 },
  { minIncome: 138300, maxIncome: 144200, baseAmount: 4284.00, rate: 9.00 },
  { minIncome: 144200, maxIncome: 148200, baseAmount: 4815.00, rate: 10.00 },
  { minIncome: 148200, maxIncome: 150300, baseAmount: 5215.00, rate: 11.00 },
  { minIncome: 150300, maxIncome: 152300, baseAmount: 5446.00, rate: 12.00 },
  { minIncome: 152300, maxIncome: 940800, baseAmount: 5686.00, rate: 13.00 },
  { minIncome: 940800, maxIncome: null, baseAmount: 108191.00, rate: 11.50 },
];

export const getFederalTaxBrackets = (
  tariff: 'single' | 'married',
  _year: number = 2025
): TaxBracket[] => {
  // Currently only 2025 data, can be extended for other years
  if (tariff === 'married') {
    return federalTaxBracketsMarried2025;
  }
  return federalTaxBracketsSingle2025;
};
