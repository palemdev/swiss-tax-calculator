import type { CantonalTaxConfig, Municipality } from '../../types';

// Schwyz Canton Tax Configuration 2024
// Known for low taxes (similar to Zug)
export const schwyzConfig: CantonalTaxConfig = {
  cantonCode: 'SZ',
  cantonName: 'Schwyz',
  cantonNameDe: 'Schwyz',
  cantonNameFr: 'Schwytz',
  year: 2024,
  taxMultiplier: 100,

  tariffs: {
    single: [
      { minIncome: 0, maxIncome: 5000, baseAmount: 0, rate: 0 },
      { minIncome: 5000, maxIncome: 10000, baseAmount: 0, rate: 1.00 },
      { minIncome: 10000, maxIncome: 20000, baseAmount: 50.00, rate: 2.00 },
      { minIncome: 20000, maxIncome: 30000, baseAmount: 250.00, rate: 3.00 },
      { minIncome: 30000, maxIncome: 45000, baseAmount: 550.00, rate: 4.00 },
      { minIncome: 45000, maxIncome: 60000, baseAmount: 1150.00, rate: 5.00 },
      { minIncome: 60000, maxIncome: 80000, baseAmount: 1900.00, rate: 5.50 },
      { minIncome: 80000, maxIncome: 100000, baseAmount: 3000.00, rate: 6.00 },
      { minIncome: 100000, maxIncome: 140000, baseAmount: 4200.00, rate: 6.50 },
      { minIncome: 140000, maxIncome: 200000, baseAmount: 6800.00, rate: 7.00 },
      { minIncome: 200000, maxIncome: 300000, baseAmount: 11000.00, rate: 7.50 },
      { minIncome: 300000, maxIncome: null, baseAmount: 18500.00, rate: 8.00 },
    ],
    married: [
      { minIncome: 0, maxIncome: 10000, baseAmount: 0, rate: 0 },
      { minIncome: 10000, maxIncome: 20000, baseAmount: 0, rate: 1.00 },
      { minIncome: 20000, maxIncome: 40000, baseAmount: 100.00, rate: 2.00 },
      { minIncome: 40000, maxIncome: 60000, baseAmount: 500.00, rate: 3.00 },
      { minIncome: 60000, maxIncome: 90000, baseAmount: 1100.00, rate: 4.00 },
      { minIncome: 90000, maxIncome: 120000, baseAmount: 2300.00, rate: 5.00 },
      { minIncome: 120000, maxIncome: 160000, baseAmount: 3800.00, rate: 5.50 },
      { minIncome: 160000, maxIncome: 200000, baseAmount: 6000.00, rate: 6.00 },
      { minIncome: 200000, maxIncome: 280000, baseAmount: 8400.00, rate: 6.50 },
      { minIncome: 280000, maxIncome: 400000, baseAmount: 13600.00, rate: 7.00 },
      { minIncome: 400000, maxIncome: 600000, baseAmount: 22000.00, rate: 7.50 },
      { minIncome: 600000, maxIncome: null, baseAmount: 37000.00, rate: 8.00 },
    ],
  },

  deductionLimits: {
    professionalExpenses: {
      flatRate: 2400,
      maxCommuting: 6000,
      maxMeals: 3200,
      maxOther: 2000,
    },
    insurancePremiums: {
      single: 2800,
      married: 5600,
      perChild: 1400,
    },
    pillar3a: {
      withPension: 7056,
      withoutPension: 35280,
    },
    childDeduction: 9200,
    childcareDeduction: 6000,
    marriedDeduction: 4400,
    socialDeductions: {
      single: 3500,
      married: 7000,
    },
  },
};

// Schwyz Municipalities
export const schwyzMunicipalities: Municipality[] = [
  { id: 'sz-schwyz', name: 'Schwyz', cantonCode: 'SZ', taxMultiplier: 150, churchTaxMultipliers: { catholic: 15, protestant: 15, christCatholic: 15 } },
  { id: 'sz-freienbach', name: 'Freienbach', cantonCode: 'SZ', taxMultiplier: 90, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'sz-wollerau', name: 'Wollerau', cantonCode: 'SZ', taxMultiplier: 60, churchTaxMultipliers: { catholic: 8, protestant: 8, christCatholic: 8 } },
  { id: 'sz-feusisberg', name: 'Feusisberg', cantonCode: 'SZ', taxMultiplier: 85, churchTaxMultipliers: { catholic: 10, protestant: 10, christCatholic: 10 } },
  { id: 'sz-kuesnacht', name: 'Küssnacht', cantonCode: 'SZ', taxMultiplier: 130, churchTaxMultipliers: { catholic: 13, protestant: 13, christCatholic: 13 } },
  { id: 'sz-einsiedeln', name: 'Einsiedeln', cantonCode: 'SZ', taxMultiplier: 145, churchTaxMultipliers: { catholic: 14, protestant: 14, christCatholic: 14 } },
  { id: 'sz-arth', name: 'Arth', cantonCode: 'SZ', taxMultiplier: 115, churchTaxMultipliers: { catholic: 12, protestant: 12, christCatholic: 12 } },
  { id: 'sz-lachen', name: 'Lachen', cantonCode: 'SZ', taxMultiplier: 125, churchTaxMultipliers: { catholic: 13, protestant: 13, christCatholic: 13 } },
  { id: 'sz-altendorf', name: 'Altendorf', cantonCode: 'SZ', taxMultiplier: 110, churchTaxMultipliers: { catholic: 12, protestant: 12, christCatholic: 12 } },
  { id: 'sz-galgenen', name: 'Galgenen', cantonCode: 'SZ', taxMultiplier: 120, churchTaxMultipliers: { catholic: 12, protestant: 12, christCatholic: 12 } },
];
