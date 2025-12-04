import type { CantonalTaxConfig, Municipality } from '../../types';

// Geneva Canton Tax Configuration 2024
// Known for higher taxes
export const genevaConfig: CantonalTaxConfig = {
  cantonCode: 'GE',
  cantonName: 'Geneva',
  cantonNameDe: 'Genf',
  cantonNameFr: 'Genève',
  year: 2024,
  taxMultiplier: 100,

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 17493, baseAmount: 0, rate: 0 },
      { minIncome: 17493, maxIncome: 21444, baseAmount: 0, rate: 8.00 },
      { minIncome: 21444, maxIncome: 23463, baseAmount: 316.08, rate: 9.00 },
      { minIncome: 23463, maxIncome: 25482, baseAmount: 497.79, rate: 10.00 },
      { minIncome: 25482, maxIncome: 27501, baseAmount: 699.69, rate: 11.00 },
      { minIncome: 27501, maxIncome: 32798, baseAmount: 921.78, rate: 12.00 },
      { minIncome: 32798, maxIncome: 36479, baseAmount: 1557.42, rate: 13.00 },
      { minIncome: 36479, maxIncome: 40159, baseAmount: 2036.95, rate: 14.00 },
      { minIncome: 40159, maxIncome: 45456, baseAmount: 2552.15, rate: 14.50 },
      { minIncome: 45456, maxIncome: 72416, baseAmount: 3320.22, rate: 15.00 },
      { minIncome: 72416, maxIncome: 119656, baseAmount: 7364.22, rate: 15.50 },
      { minIncome: 119656, maxIncome: 170336, baseAmount: 14686.42, rate: 16.00 },
      { minIncome: 170336, maxIncome: 258086, baseAmount: 22794.22, rate: 17.00 },
      { minIncome: 258086, maxIncome: 499286, baseAmount: 37711.72, rate: 17.50 },
      { minIncome: 499286, maxIncome: null, baseAmount: 79921.72, rate: 17.50 },
    ],
    married: [
      { minIncome: 0, maxIncome: 34986, baseAmount: 0, rate: 0 },
      { minIncome: 34986, maxIncome: 42888, baseAmount: 0, rate: 8.00 },
      { minIncome: 42888, maxIncome: 46926, baseAmount: 632.16, rate: 9.00 },
      { minIncome: 46926, maxIncome: 50964, baseAmount: 995.58, rate: 10.00 },
      { minIncome: 50964, maxIncome: 55002, baseAmount: 1399.38, rate: 11.00 },
      { minIncome: 55002, maxIncome: 65596, baseAmount: 1843.56, rate: 12.00 },
      { minIncome: 65596, maxIncome: 72958, baseAmount: 3114.84, rate: 13.00 },
      { minIncome: 72958, maxIncome: 80318, baseAmount: 4071.90, rate: 14.00 },
      { minIncome: 80318, maxIncome: 90912, baseAmount: 5102.30, rate: 14.50 },
      { minIncome: 90912, maxIncome: 144832, baseAmount: 6638.43, rate: 15.00 },
      { minIncome: 144832, maxIncome: 239312, baseAmount: 14726.43, rate: 15.50 },
      { minIncome: 239312, maxIncome: 340672, baseAmount: 29370.83, rate: 16.00 },
      { minIncome: 340672, maxIncome: 516172, baseAmount: 45588.43, rate: 17.00 },
      { minIncome: 516172, maxIncome: 998572, baseAmount: 75423.43, rate: 17.50 },
      { minIncome: 998572, maxIncome: null, baseAmount: 159843.43, rate: 17.50 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 3000,
      maxCommuting: 500, // Public transport only essentially
      maxMeals: 3200,
      maxOther: 2000,
    },
    insurancePremiums: {
      single: 3042,
      married: 6084,
      perChild: 1521,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 10078,
    childcareDeduction: 4000,
    marriedDeduction: 0,
    socialDeductions: {
      single: 0,
      married: 0,
    },
  },
};

// Geneva Municipalities (Geneva has only one municipality for tax purposes - city of Geneva)
// But different communes exist with the same tax rate
export const genevaMunicipalities: Municipality[] = [
  { id: 'ge-geneva', name: 'Genève', cantonCode: 'GE', taxMultiplier: 45.5, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-carouge', name: 'Carouge', cantonCode: 'GE', taxMultiplier: 50, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-lancy', name: 'Lancy', cantonCode: 'GE', taxMultiplier: 50, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-meyrin', name: 'Meyrin', cantonCode: 'GE', taxMultiplier: 46, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-vernier', name: 'Vernier', cantonCode: 'GE', taxMultiplier: 51, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-onex', name: 'Onex', cantonCode: 'GE', taxMultiplier: 51, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-thonex', name: 'Thônex', cantonCode: 'GE', taxMultiplier: 48, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-plan-les-ouates', name: 'Plan-les-Ouates', cantonCode: 'GE', taxMultiplier: 36, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-grand-saconnex', name: 'Grand-Saconnex', cantonCode: 'GE', taxMultiplier: 43, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-chene-bougeries', name: 'Chêne-Bougeries', cantonCode: 'GE', taxMultiplier: 39, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-cologny', name: 'Cologny', cantonCode: 'GE', taxMultiplier: 32, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
  { id: 'ge-vandoeuvres', name: 'Vandoeuvres', cantonCode: 'GE', taxMultiplier: 28, churchTaxMultipliers: { catholic: 0, protestant: 0, christCatholic: 0 } },
];
