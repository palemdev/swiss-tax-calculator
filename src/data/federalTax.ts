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
  { minIncome: 0, maxIncome: 32000, baseAmount: 0, rate: 0 },
  { minIncome: 33000, maxIncome: 53500, baseAmount: 33.00, rate: 1.00 },
  { minIncome: 53500, maxIncome: 61300, baseAmount: 238.00, rate: 2.00 },
  { minIncome: 61300, maxIncome: 76100, baseAmount: 394.00, rate: 3.00 },
  { minIncome: 76100, maxIncome: 94900, baseAmount: 838.00, rate: 4.00 },
  { minIncome: 94900, maxIncome: 108700, baseAmount: 1590.00, rate: 5.00 },
  { minIncome: 108700, maxIncome: 120500, baseAmount: 2280.00, rate: 6.00 },
  { minIncome: 120500, maxIncome: 130500, baseAmount: 2988.00, rate: 7.00 },
  { minIncome: 130500, maxIncome: 138300, baseAmount: 3688.00, rate: 8.00 },
  { minIncome: 138300, maxIncome: 141500, baseAmount: 4312.00, rate: 9.00 },
  { minIncome: 141500, maxIncome: 144200, baseAmount: 4600.00, rate: 10.00 },
  { minIncome: 144200, maxIncome: 148200, baseAmount: 4870.00, rate: 11.00 },
  { minIncome: 148200, maxIncome: 150300, baseAmount: 5310.00, rate: 12.00 },
  { minIncome: 150300, maxIncome: 250000, baseAmount: 5562.00, rate: 13.00 },
  { minIncome: 250000, maxIncome: 950000, baseAmount: 18387.00, rate: 13.00 },
  { minIncome: 950000, maxIncome: null, baseAmount: 109387.00, rate: 11.50 },
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
