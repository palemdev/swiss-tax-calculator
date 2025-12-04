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
  { minIncome: 0, maxIncome: 32000, baseAmount: 0, rate: 0 },
  { minIncome: 33000, maxIncome: 53500, baseAmount: 33.00, rate: 1.00 },
  { minIncome: 53500, maxIncome: 61300, baseAmount: 239.00, rate: 2.00 },
  { minIncome: 61400, maxIncome: 79200, baseAmount: 398.00, rate: 3.00 },
  { minIncome: 79200, maxIncome: 95000, baseAmount: 933.00, rate: 4.00 },
  { minIncome: 95000, maxIncome: 108700, baseAmount: 1566.00, rate: 5.00 },
  { minIncome: 108700, maxIncome: 120600, baseAmount: 2252.00, rate: 6.00 },
  { minIncome: 120600, maxIncome: 130600, baseAmount: 2967.00, rate: 7.00 },
  { minIncome: 130600, maxIncome: 138400, baseAmount: 3688.00, rate: 8.00 },
  { minIncome: 138400, maxIncome: 144300, baseAmount: 4293.00, rate: 9.00 },
  { minIncome: 144300, maxIncome: 148300, baseAmount: 4825.00, rate: 10.00 },
  { minIncome: 148300, maxIncome: 150400, baseAmount: 5226.00, rate: 11.00 },
  { minIncome: 150400, maxIncome: 152400, baseAmount: 5458.00, rate: 12.00 },
  { minIncome: 152400, maxIncome: 940900, baseAmount: 5669.00, rate: 13.00 },
  { minIncome: 940900, maxIncome: null, baseAmount: 108203.50, rate: 11.50 },
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
