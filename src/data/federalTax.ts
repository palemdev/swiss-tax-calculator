import type { TaxBracket } from '../types';

// Federal Tax Brackets 2025 - Single Tariff (Grundtarif)
export const federalTaxBracketsSingle2025: TaxBracket[] = [
  { minIncome: 0, maxIncome: 18500, baseAmount: 0, rate: 0 },
  { minIncome: 18500, maxIncome: 32000, baseAmount: 25.41, rate: 0.77 },
  { minIncome: 32000, maxIncome: 43600, baseAmount: 129.36, rate: 0.88 },
  { minIncome: 43600, maxIncome: 58100, baseAmount: 231.84, rate: 2.64 },
  { minIncome: 58100, maxIncome: 76200, baseAmount: 614.97, rate: 2.97 },
  { minIncome: 76200, maxIncome: 79200, baseAmount: 1155.49, rate: 5.94 },
  { minIncome: 79200, maxIncome: 108900, baseAmount: 1333.69, rate: 6.60 },
  { minIncome: 108900, maxIncome: 141600, baseAmount: 3277.60, rate: 8.80 },
  { minIncome: 141600, maxIncome: 185000, baseAmount: 6157.40, rate: 11.00 },
  { minIncome: 185000, maxIncome: 793400, baseAmount: 10933.60, rate: 13.20 },
  { minIncome: 793400, maxIncome: null, baseAmount: 91241.00, rate: 11.50 },
];

// Federal Tax Brackets 2025 - Married Tariff (Verheiratetentarif)
export const federalTaxBracketsMarried2025: TaxBracket[] = [
  { minIncome: 0, maxIncome: 33000, baseAmount: 0, rate: 0 },
  { minIncome: 33000, maxIncome: 53400, baseAmount: 33.00, rate: 1.00 },
  { minIncome: 53400, maxIncome: 61400, baseAmount: 237.00, rate: 2.00 },
  { minIncome: 61400, maxIncome: 76100, baseAmount: 397.00, rate: 3.00 },
  { minIncome: 76100, maxIncome: 94900, baseAmount: 838.00, rate: 4.00 },
  { minIncome: 94900, maxIncome: 108600, baseAmount: 1590.00, rate: 5.00 },
  { minIncome: 108600, maxIncome: 120600, baseAmount: 2275.00, rate: 6.00 },
  { minIncome: 120600, maxIncome: 130600, baseAmount: 2995.00, rate: 7.00 },
  { minIncome: 130600, maxIncome: 138400, baseAmount: 3695.00, rate: 8.00 },
  { minIncome: 138400, maxIncome: 141600, baseAmount: 4319.00, rate: 9.00 },
  { minIncome: 141600, maxIncome: 144300, baseAmount: 4607.00, rate: 10.00 },
  { minIncome: 144300, maxIncome: 148300, baseAmount: 4877.00, rate: 11.00 },
  { minIncome: 148300, maxIncome: 150400, baseAmount: 5317.00, rate: 12.00 },
  { minIncome: 150400, maxIncome: 185000, baseAmount: 5569.00, rate: 13.00 },
  { minIncome: 185000, maxIncome: 793400, baseAmount: 10067.00, rate: 13.20 },
  { minIncome: 793400, maxIncome: null, baseAmount: 90355.88, rate: 11.50 },
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
