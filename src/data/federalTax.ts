import type { TaxBracket } from '../types';

// Federal Tax Brackets 2025 - Single Tariff (Grundtarif)
export const federalTaxBracketsSingle2025: TaxBracket[] = [
  { minIncome: 0, maxIncome: 14500, baseAmount: 0, rate: 0 },
  { minIncome: 14500, maxIncome: 31600, baseAmount: 0, rate: 0.77 },
  { minIncome: 31600, maxIncome: 41400, baseAmount: 131.65, rate: 0.88 },
  { minIncome: 41400, maxIncome: 55200, baseAmount: 217.90, rate: 2.64 },
  { minIncome: 55200, maxIncome: 72500, baseAmount: 582.20, rate: 2.97 },
  { minIncome: 72500, maxIncome: 78100, baseAmount: 1095.85, rate: 5.94 },
  { minIncome: 78100, maxIncome: 103600, baseAmount: 1428.45, rate: 6.60 },
  { minIncome: 103600, maxIncome: 134600, baseAmount: 3111.45, rate: 8.80 },
  { minIncome: 134600, maxIncome: 176000, baseAmount: 5839.45, rate: 11.00 },
  { minIncome: 176000, maxIncome: 755200, baseAmount: 10393.45, rate: 13.20 },
  { minIncome: 755200, maxIncome: null, baseAmount: 86847.85, rate: 11.50 },
];

// Federal Tax Brackets 2025 - Married Tariff (Verheiratetentarif)
export const federalTaxBracketsMarried2025: TaxBracket[] = [
  { minIncome: 0, maxIncome: 28300, baseAmount: 0, rate: 0 },
  { minIncome: 28300, maxIncome: 50900, baseAmount: 0, rate: 1.00 },
  { minIncome: 50900, maxIncome: 58400, baseAmount: 226.00, rate: 2.00 },
  { minIncome: 58400, maxIncome: 75300, baseAmount: 376.00, rate: 3.00 },
  { minIncome: 75300, maxIncome: 90300, baseAmount: 883.00, rate: 4.00 },
  { minIncome: 90300, maxIncome: 103400, baseAmount: 1483.00, rate: 5.00 },
  { minIncome: 103400, maxIncome: 114700, baseAmount: 2138.00, rate: 6.00 },
  { minIncome: 114700, maxIncome: 124200, baseAmount: 2816.00, rate: 7.00 },
  { minIncome: 124200, maxIncome: 131700, baseAmount: 3481.00, rate: 8.00 },
  { minIncome: 131700, maxIncome: 137300, baseAmount: 4081.00, rate: 9.00 },
  { minIncome: 137300, maxIncome: 141200, baseAmount: 4585.00, rate: 10.00 },
  { minIncome: 141200, maxIncome: 143100, baseAmount: 4975.00, rate: 11.00 },
  { minIncome: 143100, maxIncome: 145000, baseAmount: 5184.00, rate: 12.00 },
  { minIncome: 145000, maxIncome: 895800, baseAmount: 5412.00, rate: 13.00 },
  { minIncome: 895800, maxIncome: null, baseAmount: 103016.00, rate: 11.50 },
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
